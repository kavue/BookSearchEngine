import express from 'express';
import path from 'node:path';
import { ApolloServer, } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { fileURLToPath } from 'url';
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
// restructured the way you configured apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const app = express();
const startApolloServer = async () => {
    await server.start();
    db;
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
// Call apollo function to start server
startApolloServer();
