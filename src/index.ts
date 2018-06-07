import * as express from 'express';
import * as JsonDB from 'node-json-db';
import * as path from 'path';
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs } from './types';
import { getResolvers } from './resolvers';

var app = express();

var filename = path.resolve(__dirname, 'db.json');
const db = new JsonDB(filename, true, true); 

const resolvers = getResolvers(db);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const homePath = '/graphiql'    

app.use(cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))
app.use(homePath, graphiqlExpress({ endpointURL: '/graphql' }))

app.use(express.static(__dirname + '/www'));
    
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Visit http://localhost:${PORT}`)
})