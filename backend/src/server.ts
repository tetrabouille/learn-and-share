import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import express from 'express';
import path from 'path';
import fs from 'fs';

import { getUserFromToken } from './utils/auth';
import { error, user, profile } from './schemas';
import { userContext, profileContext } from './contexts';

const launchServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs: [error.typeDefs, user.typeDefs, profile.typeDefs],
    resolvers: merge(user.resolvers, profile.resolvers),
    context: ({ req }) => {
      const userInfo = getUserFromToken(req.headers.authorization);
      return merge(userInfo, userContext, profileContext);
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  const staticPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(staticPath, 'index.html'));
    });
  }

  app.listen(process.env.PORT || 4000, () => {
    console.log('server on', server.graphqlPath);
  });
};

launchServer();
