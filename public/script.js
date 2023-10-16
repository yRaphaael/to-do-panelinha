
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", () => {
    getLocalTodos();
});

todoButton.addEventListener("click", (e) => {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
        addTodoToServer(todoText);
    }
});


todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function createTodoElement(item) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = item.todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const newSpan = document.createElement("span");
    newSpan.innerText = item._id;
    todoDiv.setAttribute("data-id", item._id);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    if (item.completed) {
        todoDiv.classList.add("completed");
    }

    completedButton.addEventListener("click", () => {
        todoDiv.classList.toggle("completed");
        updateTodoOnServer(item._id, !item.completed);
        item.completed = !item.completed; 

        if (item.completed) {
            saveLocalCompletedTodo(item);
        }
    });

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);
    
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";

    editButton.addEventListener("click", (e) => {
        todoInput.value = item.todo;
        todoInput.setAttribute("data-id", item._id);
    });

    todoList.appendChild(todoDiv);
    todoInput.value = "";

// Adicione o evento de edição novamente
editButton.addEventListener("click", (e) => {
    todoInput.value = item.todo;
    todoInput.setAttribute("data-id", item._id);
});
}

async function addTodoToServer(todoText) {
    try {
        const todoId = todoInput.getAttribute("data-id");
        let url = 'http://localhost:3000/addTodo';

        if (todoId) {
            // Se todoId for válido (não é null), adicione o / e o todoId ao URL
            url += `/${todoId}`;
        }

        const method = todoId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: todoText }),
        });

        if (response.ok) {
            const item = { _id: todoId, todo: todoText };
            if (todoId) removeLocalTodos(item);
            createTodoElement(item);
        } else {
            console.error('Falha ao adicionar a tarefa');
        }

        todoInput.removeAttribute('data-id');
    } catch (error) {
        console.error(error);
    }
}

async function deleteTodoOnServer(todoId) {
    try {
        const response = await fetch(`http://localhost:3000/delete-todo/${todoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Tarefa removida com sucesso no servidor');
        } else {
            console.error('Falha ao remover a tarefa no servidor');
        }
    } catch (error) {
        console.error(error);
    }
}

function deleteCheck(e) {
    e.preventDefault();
    const item = e.target;
    if (item.classList.contains("trash-btn")) {
        const todo = item.parentElement;
        const todoId = todo.getAttribute("data-id");
        console.log(todoId);
        if (todoId) {
            deleteTodoOnServer(todoId)
                .then(() => {
                    todo.classList.add("slide");
                    todo.addEventListener("transitionend", () => {
                        todo.remove();
                    });
                })
                .catch((error) => {
                    console.error('Falha ao remover a tarefa no servidor', error);
                });
        }
    }
}


function filterTodo(e) {
    e.preventDefault();
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

async function getLocalTodos() {
    try {
        const response = await fetch('http://localhost:3000/getTodos');
        if (response.ok) {
            const todos = await response.json();
            console.log(todos)
            todos.forEach((todo) => {
                createTodoElement(todo);
            });
        } else {
            console.error('Erro ao buscar as tarefas do servidor');
        }
    } catch (error) {
        console.error(error);
    }
}

async function removeLocalTodos(todo) {
    todoList.childNodes.forEach((item) => {
        if (item.getAttribute("data-id") === todo._id) {
            item.remove();
            return;
        }
    });
}

async function updateTodoOnServer(todoId, completed) {
    try {
        const response = await fetch(`http://localhost:3000/update-todo/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed }),
        });

        if (response.ok) {
            console.log('Tarefa atualizada no servidor');
        } else {
            console.error('Falha ao atualizar a tarefa no servidor');
        }
    } catch (error) {
        console.error(error);
    }
};

function saveLocalCompletedTodo(item) {
    let completedTodos;
    if (localStorage.getItem("completedTodos") === null) {
        completedTodos = [];
    } else {
        completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    }
    completedTodos.push(item);
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}