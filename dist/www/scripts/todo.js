var tasks = [];
// var state = {
//     ALL: 1,
//     ACTIVE: 2,
//     COMPLETE: 3
// }
var state = 1;
var httpState = 0;
var firaFor;

window.onload = function() {
    // app ready

    firaFor = document.querySelector('fira-for');
    firaFor.content = tasks;

    var managed = document.querySelector('.manage .bar');
    var managedInnerHTML = managed.innerHTML;    

    firaFor.addEventListener('change', function(items) {
        var count = items.detail[0].length;
        // items.detail[0].forEach((v) => {
        //     if(!v.completed) count++;
        // });

        var manageObj = {
            count: count + ' items left',
            message: 'Successfully Changed'
        }
        managed.innerHTML = interpolate(managedInnerHTML, manageObj);        

        // if(items.detail[0].length > 0) managed.classList.add('active');
        // else managed.classList.remove('active');   
        managed.classList.add('active');
        
        buttons(state);
    });    
    
    //list.setContent(tasks);
    var query = {"query":"query {\n  todos {\n    id\n    task\n    completed\n  }\n}","variables":null};
    var http = document.querySelector('fira-http');
    http.body = query;
    window.setTimeout(() => {
        http.fetch();
    })    

    http.addEventListener('fetched', ($e) => {
        var results = 
            JSON.parse($e.detail[0].responseText)
            .data;
        if(results.todos) results.todos.forEach(v => tasks.push(v));
        if(results.createTodo) tasks.push(results.createTodo);
        if(results.updateTodo) 
            tasks.forEach((v) => {
                if(v.id === results.updateTodo.id) v.completed = true;
            });
        
    });

    document.getElementById("item")
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {  
                // var id = guid();              
                // var item = {
                //     id: id,
                //     task: event.currentTarget.value,
                //     completed: false
                // };
                // tasks.push(item);
                addItem(event.currentTarget.value);
                event.currentTarget.value = '';
            }
        });

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

function addItem(task) {
    var query = {"query": `mutation {
                                createTodo(task: "${task}") {
                                    id,
                                    task,
                                    completed
                                }
                            }`};
    var http = document.querySelector('fira-http');
    http.body = query;
    window.setTimeout(() => {
        http.fetch();
    }) 
}

function complete(id) {
    var query = {"query": `mutation {
        updateTodo(id:"${id}", completed:true) {
          id,
          completed,
          task
        }
    }`};
    var http = document.querySelector('fira-http');
    http.body = query;
    window.setTimeout(() => {
        http.fetch();
    }) 

    // tasks.forEach((v) => {
    //     if(v.id === id) v.completed = true;
    // });
    //list.render();    
}

function closeItem(id) {    
    //list.removeContentItem(v => v.id === id);
    //tasks = tasks.filter(v => v.id !== id);

    var query = {"query": `mutation {
                                deleteTodo(id:"${id}") {
                                    task
                                }
                            }`};
    var http = document.querySelector('fira-http');
    http.body = query;    
    window.setTimeout(() => {
        http.fetch();
    }) 

    var idx = tasks.map(t => t.id).indexOf(id);
    if(idx > -1) tasks.splice(idx, 1);
}

function scope(s) {
    state = s;
    if(s === 1) {        
        firaFor.filter = t => t;        
    } else if (s === 2) {
        firaFor.filter = t => !t.completed;               
    } else {
        firaFor.filter = t => t.completed;        
    }
}

function buttons(s) {
    if(s === 1) {
        document.querySelector("#activeBtn").classList.remove('active');
        document.querySelector("#completeBtn").classList.remove('active');
        document.querySelector("#allBtn").classList.add('active');        
    } else if (s === 2) {
        document.querySelector("#activeBtn").classList.add('active');
        document.querySelector("#completeBtn").classList.remove('active');
        document.querySelector("#allBtn").classList.remove('active');        
    } else {
        document.querySelector("#activeBtn").classList.remove('active');
        document.querySelector("#completeBtn").classList.add('active');
        document.querySelector("#allBtn").classList.remove('active');        
    }
}

function clearCompleted() {
    //tasks = tasks.filter(t => !t.completed);
    //list.setContent(tasks);
    // var found = tasks.map(t => t.completed).indexOf(true);
    // if(found > -1) {
    //     closeItem(tasks[found].id);
    //     clearCompleted();
    // }
    var arr = [];
    tasks.forEach(v => {
        if(v.completed) arr.push(v.id)
    })

    var query = {"query": `mutation {
                                deleteTodos(id: ["${arr.join('","')}"])                                                                    
                            }`};
    var http = document.querySelector('fira-http');
    http.body = query;    
    window.setTimeout(() => {
        http.fetch();
    }) 

    recursiveClear();
}

function recursiveClear() {
    var found = tasks.map(t => t.completed).indexOf(true);
    if(found > -1) {
        tasks.splice(found, 1);
        recursiveClear();
    }
}

function interpolate(template, obj) {
    if (typeof obj == "object") {
        for (var key in obj) {
            const find = "${" + key + "}";
            if (template.indexOf(find) > -1) {                        
                template = template.split(find).join(obj[key]);                        
            }
        }
    }
    return template;
}