"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = ["\n    type Query {\n        todo(id: String): Todo\n        todos: [Todo]\n    }\n    type Todo {\n        id: String\n        completed: Boolean\n        task: String        \n    }    \n    type Mutation {\n        createTodo(task: String): Todo\n        updateTodo(completed: Boolean): Todo\n        deleteTodo(id: String): Todo       \n    }\n    schema {\n        query: Query\n        mutation: Mutation\n    }\n"];
//# sourceMappingURL=types.js.map