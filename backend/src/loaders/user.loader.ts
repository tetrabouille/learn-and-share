import DataLoader from "dataloader";
import { User } from "@prisma/client";
import { prisma } from "../db/prisma";
import { keyBy } from "lodash";

const batchUsers = async (ids: readonly number[]) => {
  const users = await prisma.user.findMany({ where: { id: { in: [...ids] } } });
  const mapUsers = keyBy(users, "id");
  return ids.map((id) => mapUsers[id]);
};

export const userLoader = new DataLoader<number, User>(batchUsers);
