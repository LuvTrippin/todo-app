
const todos = [];
const users = [];

document.addEventListener('DOMContentLoaded', initApp);

function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
}

function createTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;

    const close = document.createElement('span');
    close.innerHTML = '&times';
    close.className = 'close';

    li.prepend(status);
    li.append(close);

    return li;
}

function printTodo(todo) {
    const todoList = document.querySelector('#todo-list');
    todoList.prepend(createTodo(todo));
}

function printTodos(todos) {
    todos.forEach(todo => {
        printTodo(todo);
    });
}

function createUser(name) {
    const op = document.createElement('option');
    op.innerText = name;
    
    return op;
}

function printUser(user) {
    const select = document.querySelector('#user-todo');
    select.append(createUser(user.name));
}

function printUsers(users) {
    users.forEach(user => {
        printUser(user);
    });
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()])
    .then(values => {
        todos.push(...values[0]);
        users.push(...values[1]);

        printUsers(users);
        printTodos(todos);
    })
}


async function getAllTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();

    return data
}

async function getAllUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();

    return data
}

