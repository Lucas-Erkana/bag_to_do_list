document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addButton = document.getElementById("add-button");
    const taskList = document.getElementById("task-list");

    addButton.addEventListener("click", addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-button">Delete</button>
            `;
            listItem.querySelector(".delete-button").addEventListener("click", deleteTask);
            taskList.prepend(listItem);
            taskInput.value = "";
        }
    }

    function deleteTask(event) {
        const listItem = event.target.parentElement;
        listItem.remove();
    }

    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    taskList.addEventListener("click", function (event) {
        const listItem = event.target.parentElement;
        if (event.target.tagName === "SPAN") {
            listItem.classList.toggle("completed");
        }
    });
});
