import * as crypto from 'crypto';

export function getResolvers(db) {
    return {
        Query: {
          todo: async (root, {id}) => {
            return db.getData('/todo/' + id)            
          },
          todos: async () => {
            var todos = []; 
            var dbTodos = db.getData('/todo')
            for(var td in dbTodos) {
                todos.push(dbTodos[td]);
            }
            return todos;
          }
        },
        Mutation: {
          createTodo: async (root, args, context, info) => { 
            args.completed = false;             
            args.id = crypto.randomBytes(2).toString("hex");
            const res = db.push("/todo/" + args.id, args, false);
            return db.getData('/todo/' + args.id);
          },
          updateTodo: async (root, args, context, info) => {            
            const res = db.push("/todo/" + args.id, args, false);
            return db.getData('/todo/' + args.id);
          }, 
          deleteTodo: async (root, args, context, info) => {            
            const res = db.delete("/todo/" + args.id, args, false);
            return { id: args.id };
          }
        },
    }
}