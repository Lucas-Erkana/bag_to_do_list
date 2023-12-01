// JavaScript code for the To-Do List application

// Wait until the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const taskList = document.getElementById("task-list");

    // Load tasks from local storage when the page loads
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.sort((a, b) => (b.important === a.important) ? 0 : b.important ? -1 : 1);
    savedTasks.forEach((task) => {
        renderTask(task);
    });

    addButton.addEventListener("click", addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const task = { text: taskText, important: false };
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
        listItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-button">Delete</button>
            <button class="important-button">Important</button>
        `;
        listItem.querySelector(".delete-button").addEventListener("click", deleteTask);
        listItem.querySelector(".important-button").addEventListener("click", toggleImportant);
        listItem.querySelector(".task-text").addEventListener("click", makeEditable);
        taskList.prepend(listItem);
    }

    function makeEditable(event) {
        const span = event.target;
        const listItem = span.parentElement;
        const originalText = span.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = originalText;
        input.classList.add("task-input-edit");
        listItem.insertBefore(input, span);
        span.style.display = "none";

        input.focus();

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                updateTask(input, listItem, originalText);
            }
        });

        input.addEventListener("blur", function () {
            updateTask(input, listItem, originalText);
        });
    }

    function updateTask(input, listItem, originalText) {
        const newText = input.value.trim();
        const span = listItem.querySelector(".task-text");
        if (newText) {
            span.textContent = newText;
            updateTaskInStorage(originalText, newText, listItem.classList.contains("important"));
        } else {
            span.textContent = originalText; // Revert to original text if input is empty
        }
        span.style.display = "";
        listItem.removeChild(input);
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
        updateTaskInStorage(taskText, taskText, listItem.classList.contains("important"));
    }

    function removeTaskFromStorage(taskText) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.findIndex(t => t.text === taskText);
        if (index !== -1) {
            savedTasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        }
    }

    function updateTaskInStorage(originalText, newText, isImportant) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.findIndex(t => t.text === originalText);
        if (index !== -1) {
            savedTasks[index].text = newText;
            savedTasks[index].important = isImportant;
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        }
    }

    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
