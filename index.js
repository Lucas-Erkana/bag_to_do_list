// JavaScript code for the To-Do List application

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const taskList = document.getElementById("task-list");

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => {
        renderTask(task);
    });

    addButton.addEventListener("click", addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const task = { text: taskText, important: false, completed: false };
            renderTask(task);
            saveTask(task);
            taskInput.value = "";
        }
    }

    function renderTask(task) {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");
        if (task.important) {
            listItem.classList.add("important");
        }
        if (task.completed) {
            listItem.classList.add("completed");
        }
        listItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-button">Delete</button>
            <button class="important-button">Important</button>
        `;
        listItem.querySelector(".task-checkbox").addEventListener("change", toggleCompletion);
        listItem.querySelector(".delete-button").addEventListener("click", deleteTask);
        listItem.querySelector(".important-button").addEventListener("click", toggleImportant);
        listItem.querySelector(".task-text").addEventListener("click", makeEditable);
        taskList.prepend(listItem);
    }

    function toggleCompletion(event) {
        const listItem = event.target.parentElement;
        const taskText = listItem.querySelector(".task-text").textContent;
        listItem.classList.toggle("completed");
        updateTaskInStorage(taskText, taskText, listItem.classList.contains("important"), listItem.classList.contains("completed"));
    }

    function makeEditable(event) {
        // ... existing code for makeEditable ...
    }

    function updateTask(input, listItem, originalText) {
        // ... existing code for updateTask ...
    }

    function saveTask(task) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.unshift(task);
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
    }

    function deleteTask(event) {
        const listItem = event.target.parentElement;
        const taskText = listItem.querySelector(".task-text").textContent;
        removeTaskFromStorage(taskText);
        listItem.remove();
    }

    function toggleImportant(event) {
        const listItem = event.target.parentElement;
        listItem.classList.toggle("important");
        const taskText = listItem.querySelector(".task-text").textContent;
        updateTaskInStorage(taskText, taskText, listItem.classList.contains("important"), listItem.classList.contains("completed"));
    }

    function removeTaskFromStorage(taskText) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.findIndex(t => t.text === taskText);
        if (index !== -1) {
            savedTasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        }
    }

    function updateTaskInStorage(originalText, newText, isImportant, isCompleted) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.findIndex(t => t.text === originalText);
        if (index !== -1) {
            savedTasks[index].text = newText;
            savedTasks[index].important = isImportant;
            savedTasks[index].completed = isCompleted;
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        }
    }

    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
