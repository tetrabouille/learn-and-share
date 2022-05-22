import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

import { getUserFromToken } from './utils/auth';
import { error, commun, user, profile, story, topic, tag } from './schemas';
import { userContext, profileContext, storyContext, topicContext, tagContext } from './contexts';

const launchServer = async () => {
  const app = express();

  app.use(cors()); // TODO secure CORS policy

  const server = new ApolloServer({
    typeDefs: [
      error.typeDefs,
      commun.typeDefs,
      user.typeDefs,
      profile.typeDefs,
      story.typeDefs,
      topic.typeDefs,
      tag.typeDefs,
    ],
    resolvers: merge(user.resolvers, profile.resolvers, story.resolvers, topic.resolvers, tag.resolvers),
    context: ({ req }) => {
      const userInfo = getUserFromToken(req.headers.authorization);
      return merge(userInfo, userContext, profileContext, storyContext, topicContext, tagContext);
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
