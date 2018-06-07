"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var JsonDB = require("node-json-db");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var graphql_server_express_1 = require("graphql-server-express");
var graphql_tools_1 = require("graphql-tools");
var types_1 = require("./types");
var resolvers_1 = require("./resolvers");
var app = express();
var filename = path.resolve(__dirname, 'db.json');
var db = new JsonDB(filename, true, true);
var resolvers = resolvers_1.getResolvers(db);
var schema = graphql_tools_1.makeExecutableSchema({
    typeDefs: types_1.typeDefs,
    resolvers: resolvers
});
var homePath = '/graphiql';
app.use(cors());
app.use('/graphql', bodyParser.json(), graphql_server_express_1.graphqlExpress({ schema: schema }));
app.use(homePath, graphql_server_express_1.graphiqlExpress({ endpointURL: '/graphql' }));
app.use(express.static(__dirname + '/www'));
var PORT = 3001;
app.listen(PORT, function () {
    console.log("Visit http://localhost:" + PORT);
});
//# sourceMappingURL=index.js.map