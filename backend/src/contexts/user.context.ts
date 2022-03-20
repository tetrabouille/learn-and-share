import { prisma } from "../db/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Credentials } from "../schemas";
import { userLoader } from "../loaders/user.loader";

const error = (msgList: string[]) => ({
  user: null,
  userErrors: msgList.map((message) => ({ message })),
});

const userGetAll = () => prisma.user.findMany();

const userGetById = (id: string | number) => userLoader.load(Number(id));

const userCreate = async (credentials: Credentials, name: string, bio?: string) => {
  const { email, password } = credentials;
  const errorMsgList = [];
  if (!!(await prisma.user.findUnique({ where: { email } }))) errorMsgList.push("Email already taken");
  if (!validator.isEmail(email)) errorMsgList.push("Invalid email");
  if (!validator.isLength(password, { min: 5 })) errorMsgList.push("Password must be 5 chars minimum");
  if (!name) errorMsgList.push("Must provide a name");

  if (errorMsgList.length) return error(errorMsgList);

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  });

  await prisma.profile.create({
    data: {
      bio: bio || "Your bio is empty",
      userId: user.id,
    },
  });

  const token = jwt.sign({ userId: user.id }, String(process.env.JWT_SIGNATURE));

  return {
    token,
    userErrors: [],
  };
};

const userLogin = async ({ email, password }: Credentials) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return error(["Invalid credential"]);

  const match = await bcrypt.compare(password, user.password);
  if (!match) return error(["Invalid credential"]);

  const token = jwt.sign({ userId: user.id }, String(process.env.JWT_SIGNATURE));

  return {
    token,
    userErrors: [],
  };
};

const context = {
  userGetAll,
  userGetById,
  userCreate,
  userLogin,
};
type UserContext = typeof context & { userId: number };

export default context;
export { UserContext };
