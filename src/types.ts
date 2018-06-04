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
        updateTodo(completed: Boolean): Todo
        deleteTodo(id: String): Todo       
    }
    schema {
        query: Query
        mutation: Mutation
    }
`];