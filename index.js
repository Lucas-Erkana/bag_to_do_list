// JavaScript code for the To-Do List application

// Wait until the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve HTML elements for input, add button, and task list
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const taskList = document.getElementById("task-list");

    // Load tasks from local storage when the page loads
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.sort((a, b) => (b.important === a.important) ? 0 : b.important ? -1 : 1); // Sort tasks so that important ones are at the top
    // Render tasks from local storage
    savedTasks.forEach((taskText) => {
        renderTask(taskText);
    });

    // Add an event listener to the add button for adding new tasks
    addButton.addEventListener("click", addTask);

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const task = { text: taskText, important: false }; // Task as an object
            renderTask(task);
            saveTask(task);
            taskInput.value = "";
        }
    }
    

    // Function to render a task in the DOM
    function renderTask(task) {
        const listItem = document.createElement("li"); // Create a new list item
        // Set the inner HTML of the list item, including the task text and buttons
        if (task.important) {
            listItem.classList.add("important"); // Apply styling if important
        }
        listItem.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-button">Delete</button>
            <button class="important-button">Important</button>
        `;
        // Add event listeners to the delete and important buttons
        listItem.querySelector(".delete-button").addEventListener("click", deleteTask);
        listItem.querySelector(".important-button").addEventListener("click", toggleImportant);
        taskList.prepend(listItem); // Add the new list item to the beginning of the list
    }

    // Function to save a task in local storage
    function saveTask(task) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
        savedTasks.unshift(task); // Add the new task object to the beginning
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
    }

    // Function to delete a task
    function deleteTask(event) {
        const listItem = event.target.parentElement; // Get the parent list item of the delete button
        const taskText = listItem.querySelector("span").textContent; // Get the task text
        removeTaskFromStorage(taskText); // Remove the task from local storage
        listItem.remove(); // Remove the list item from the DOM
    }

    // Function to toggle the importance of a task
    function toggleImportant(event) {
        const listItem = event.target.parentElement; // Get the parent list item of the important button
        listItem.classList.toggle("important"); // Toggle the 'important' class
        // Update the task in local storage with its new importance status
        updateTaskInStorage(listItem.querySelector("span").textContent, listItem.classList.contains("important"));
    }

    // Function to remove a task from local storage
    function removeTaskFromStorage(taskText) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.indexOf(taskText); // Find the index of the task
        if (index !== -1) {
            savedTasks.splice(index, 1); // Remove the task from the array
            localStorage.setItem("tasks", JSON.stringify(savedTasks)); // Save the updated array in local storage
        }
    }

    // Function to update a task in local storage
    function updateTaskInStorage(taskText, isImportant) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = savedTasks.findIndex(t => t.text === taskText);
    
        if (index !== -1) {
            // Update the 'important' status of the task
            savedTasks[index].important = isImportant;
    
            // Reorder the task
            if (isImportant) {
                // Move the important task to the top of the list
                const importantTask = savedTasks.splice(index, 1)[0];
                savedTasks.unshift(importantTask);
            } else {
                // Move the unimportant task towards the end of the list
                // This step can be more complex depending on how you want to handle non-important tasks ordering
                const nonImportantTask = savedTasks.splice(index, 1)[0];
                savedTasks.push(nonImportantTask);
            }
    
            // Save the updated tasks back to local storage
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        }
    }
    
    // Add an event listener to the task input for adding tasks with the Enter key
    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask(); // Call the addTask function when Enter key is pressed
        }
    });

    // Add an event listener to the task list for marking tasks as completed
    taskList.addEventListener("click", function (event) {
        const listItem = event.target.parentElement; // Get the parent list item of the clicked element
        if (event.target.tagName === "SPAN") {
            listItem.classList.toggle("completed"); // Toggle the 'completed' class on the list item
            // Update the task in local storage with its new completed status
            updateTaskInStorage(listItem.querySelector("span").textContent, listItem.classList.contains("important"));
        }
    });
});
