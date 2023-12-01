// JavaScript code for the To-Do List application

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const taskList = document.getElementById("task-list");
    const categorySelector = document.getElementById("category-selector");
    const taskCategory = document.getElementById("task-category");
    const categoryFilters = document.querySelectorAll('input[name="category-filter"]');

    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    displayTasks();

    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            categorySelector.style.display = "block";
            // Optional: prevent the default action to avoid form submission
            event.preventDefault();
        }
    });

    addButton.addEventListener("click", () => {
        categorySelector.style.display = "block";
    });

    

    taskCategory.addEventListener("change", () => {
        const taskText = taskInput.value.trim();
        const taskCat = taskCategory.value;
        if (taskText !== "") {
            const task = { text: taskText, important: false, completed: false, category: taskCat };
            renderTask(task);
            saveTask(task);
            taskInput.value = "";
            categorySelector.style.display = "none";
        }
    });

    categoryFilters.forEach(filter => filter.addEventListener('change', filterTasks));
    // Sort tasks so that important ones are at the top
    savedTasks.sort((a, b) => a.important - b.important);

    function displayTasks(selectedCategory = 'All') {
        taskList.innerHTML = '';
        savedTasks.forEach(task => {
            if (filterPasses(task.category, selectedCategory)) {
                renderTask(task);
            }
        });
    }

    function filterTasks() {
        const selectedCategory = document.querySelector('input[name="category-filter"]:checked').value;
        displayTasks(selectedCategory);
    }

    function filterPasses(taskCategory, selectedCategory) {
        return selectedCategory === 'All' || taskCategory === selectedCategory;
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
            <span class="task-category-label">${task.category}</span>
            <button class="delete-button">Delete</button>
            <button class="important-button">Important</button>
        `;
        listItem.querySelector(".task-checkbox").addEventListener("change", toggleCompletion.bind(null, task));
        listItem.querySelector(".delete-button").addEventListener("click", deleteTask.bind(null, task));
        listItem.querySelector(".important-button").addEventListener("click", toggleImportant.bind(null, task));
        taskList.prepend(listItem);
    }

    function toggleCompletion(task, event) {
        task.completed = event.target.checked;
        saveTasks();
        if (task.completed) {
            event.target.parentElement.classList.add("completed");
        } else {
            event.target.parentElement.classList.remove("completed");
        }
    }

    function deleteTask(taskToDelete, event) {
        savedTasks = savedTasks.filter(task => task !== taskToDelete);
        saveTasks();
        event.target.parentElement.remove();
    }

    function toggleImportant(taskToToggle, event) {
        taskToToggle.important = !taskToToggle.important;
        saveTasks();
        event.target.parentElement.classList.toggle("important");
    }

    function saveTask(newTask) {
        savedTasks.unshift(newTask);
        saveTasks();
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
    }
});
