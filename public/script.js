const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", () => {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
        addTodoToServer(todoText);

    }
});
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function createTodoElement(todoText) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

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

    editButton.addEventListener("click", () => {
        editTodo(newTodo);
    });
}

async function addTodoToServer(todoText) {
    try {
        const response = await fetch('http://localhost:3000/addTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: todoText }),
        });

        if (response.ok) {
            // Se a adição for bem-sucedida, chame a função getTodos para atualizar a lista na tela.
            await getTodos(); // Aguarde a conclusão da solicitação getTodos
            createTodoElement(todoText);
        } else {
            console.error('Falha ao adicionar a tarefa');
        }
    } catch (error) {
        console.error(error);
    }
}


function deleteCheck(e) {
    const item = e.target;

    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        const todoId = todo.getAttribute("data-id"); // Adicione um atributo de dados (data-id) para identificar a tarefa

        deleteTodoOnServer(todoId);

        todo.classList.add("slide");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }
}

async function deleteTodoOnServer(id) {
    try {
        const response = await fetch(`http://localhost:3000/deleteTodo/${id}`, {
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


function filterTodo(e) {
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
            todos.forEach((todo) => {
                createTodoElement(todo.todo);
            });
        } else {
            console.error('Erro ao buscar as tarefas do servidor');
        }
    } catch (error) {
        console.error(error);
    }
}

async function removeLocalTodos(todoElement) {
    // Você também pode remover essa função se preferir não armazenar dados localmente no navegador.
}

async function updateLocalTodos(oldTodo, newTodo) {
    // Você também pode remover essa função se preferir não armazenar dados localmente no navegador.
}
