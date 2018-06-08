export const typeDefs = [`
    type Query {
        todo(id: String): Todo
        todos: [Todo]
    }
    type Todo {
        id: String
        completed: Boolean
        task: String        
    }    
    type Mutation {
        createTodo(task: String): Todo
        updateTodo(id: String, completed: Boolean): Todo
        deleteTodo(id: String): Todo 
        deleteTodos(id: [String]): Boolean
    }
    schema {
        query: Query
        mutation: Mutation
    }
`];