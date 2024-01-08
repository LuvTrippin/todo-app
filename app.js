
const todos = [];
const users = [];

document.addEventListener('DOMContentLoaded', initApp);

function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
}

function createTodoElement({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span class="todo">${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('click', handleStatusChange);

    const close = document.createElement('span');
    close.innerHTML = '&times';
    close.className = 'close';
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.append(close);

    return li;
}

function printTodo(todo) {
    const todoList = document.querySelector('#todo-list');
    todoList.prepend(createTodoElement(todo));
}

function printTodos(todos) {
    todos.forEach(todo => {
        printTodo(todo);
    });
}

function createUserOption(user) {
    const op = document.createElement('option');
    op.value = user.id;
    op.innerText = user.name;
    
    return op;
}

function printUserOption(user) {
    const select = document.querySelector('#user-todo');
    select.append(createUserOption(user));
}

function printUsersOptions(users) {
    users.forEach(user => {
        printUserOption(user);
    });
}

function handleSubmit(event) {
    event.preventDefault();

    createTodo({
        userId: Number(this.user.value),
        title: this.todo.value,
        completed: false,
    });

    this.reset();
}

function handleStatusChange() {
    changeTodoStatus(this.parentElement.dataset.id, this.checked);
}

function handleClose() {
    deleteTodo(this.parentElement.dataset.id);
    this.parentElement.remove();
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()])
    .then(values => {
        todos.push(...values[0]);
        users.push(...values[1]);

        printUsersOptions(users);
        printTodos(todos);
    })

    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
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

async function createTodo(todo) {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const newTodo = await response.json();
    
    printTodo(newTodo);
}

async function changeTodoStatus(todoId, completed) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({completed}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    console.log(data);
}

async function deleteTodo(todoId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
