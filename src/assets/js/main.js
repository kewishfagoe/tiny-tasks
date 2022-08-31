/**
 * Use browser localStorage for tasks persistence
 */
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

window.addEventListener("DOMContentLoaded", function() {
    console.info("DOM loaded!");

    displayDate();
	
	if (tasks.length != 0) {
		loadTasks(tasks);
	}

	// On enter key press, trigger add button click
	let input = document.querySelector("#taskinput");
	input.addEventListener("keyup", addEnterKeyFunction, true);

	let addBtn = document.querySelector("#add-task-btn");
	addBtn.addEventListener("click", addTask);

}, false);

function displayDate() {
	const date = new Date();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const curWeekDay = days[date.getDay()];
	const curDay = date.getDate();
	const curMonth = months[date.getMonth()];
	const curYear = date.getFullYear();

	const formattedDate = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
	document.querySelector(".date").innerHTML = formattedDate;
}

function addEnterKeyFunction(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("add-task-btn").click();
	}
}

function addEnterKeyUpdateFunction(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.querySelector(".update-task-btn").click();
	}
}

function loadTasks(locallyStoredTasks) {

	for (let i = 0; i < locallyStoredTasks.length; i++) {
		let taskObj = locallyStoredTasks[i];

		var taskNode = document.createElement("div");
		taskNode.classList.add("task-item");

		var taskContainer = document.createElement("div");
		taskContainer.classList.add("task-container");

		var newTaskCheckbox = document.createElement("input");
		newTaskCheckbox.setAttribute("id", "task" + taskObj.id);
		newTaskCheckbox.setAttribute("type", "checkbox");
		newTaskCheckbox.addEventListener("click", OnCheckboxChange);
		newTaskCheckbox.setAttribute("name", "task" + taskObj.id);
		newTaskCheckbox.setAttribute("data-id", taskObj.id);
		if (taskObj.completed) {
			newTaskCheckbox.checked = true;
		}

		var newTaskLabel = document.createElement("label");
		newTaskLabel.setAttribute("for", "task" + taskObj.id);

		var newTaskLabelChild = document.createElement("p");
		newTaskLabelChild.setAttribute("data-id", taskObj.id);
		if (taskObj.completed) {
			newTaskLabelChild.classList.add("completed");
		}

		var labelTextNode = document.createTextNode(taskObj.taskDescription);

		taskContainer.appendChild(newTaskCheckbox);
		newTaskLabelChild.appendChild(labelTextNode);
		newTaskLabel.appendChild(newTaskLabelChild);
		taskContainer.appendChild(newTaskLabel);
		taskNode.appendChild(taskContainer);

		var taskBtnsDiv = document.createElement("div");
		taskBtnsDiv.classList.add("task-buttons");

		var spanNodeUpdate = document.createElement("span");
		spanNodeUpdate.innerHTML = "&#9998;";
		spanNodeUpdate.classList.add("update-button");
		spanNodeUpdate.setAttribute("data-id", taskObj.id);
		spanNodeUpdate.addEventListener("click", editTask);

		var spanNode = document.createElement("span");
		spanNode.innerHTML = "X";
		spanNode.classList.add("delete-button");
		spanNode.setAttribute("data-id", taskObj.id);
		spanNode.addEventListener("click", deleteTask);

		taskBtnsDiv.appendChild(spanNodeUpdate);
		taskBtnsDiv.appendChild(spanNode);
		taskNode.appendChild(taskBtnsDiv);

		// add task to the bottom of the existing list
		document.querySelector(".tasks").appendChild(taskNode);
	}
}

function OnCheckboxChange() {

	var checkbox = this;
	
	if (checkbox.checked) {
		checkbox.nextElementSibling.firstChild.classList.add("completed");
		// update array item and store in localstorage
		tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
		var updateIndex = tasks.findIndex(function (o) {
			return o.id === parseInt(checkbox.dataset.id);
		});
		tasks[updateIndex].completed = true;
		localStorage.setItem("tasks", JSON.stringify(tasks));
	} else {
		checkbox.nextElementSibling.firstChild.classList.remove("completed");
		// update array item and store in localstorage
		tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
		var updateIndex = tasks.findIndex(function (o) {
			return o.id === parseInt(checkbox.dataset.id);
		});
		tasks[updateIndex].completed = false;
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}
}

function deleteTask() {
	
	var deleteBtn = this;

	// update UI, remove parent task node
	var task = deleteBtn.parentNode.parentNode;
	task.remove();
	tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
	// get data-id and remove task from localStorage
	var removeIndex = tasks.findIndex(function (o) {
		return o.id === parseInt(deleteBtn.dataset.id);
	});
	// remove from tasks array and store array in localStorage
	removeIndex >= 0 && tasks.splice(removeIndex, 1);

	localStorage.setItem("tasks", JSON.stringify(tasks));

	showNotification("Task " + (removeIndex + 1) + " deleted.");
}

function addTask() {
	var newTask = document.querySelector("#taskinput");

	// Check if input isn't empty, show dialog / notification
	if (newTask.value === "") {
		showNotification("Input is empty, please type something in.");
	} else {
		// Check if similar task doesn't already exist
		var taskExists = tasks.filter(function (task) {
			return (
				task.taskDescription.toLowerCase() ===
				String(newTask.value).toLowerCase()
			);
		});

		if (taskExists.length > 0) {
			showNotification("Similar task already exists.");
		} else {
			tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
			var newTaskId = Math.floor(Math.random() * 1000000);
			tasks.push({
				id: newTaskId,
				taskDescription: String(newTask.value),
				completed: false,
			});
			// store in local storage
			localStorage.setItem("tasks", JSON.stringify(tasks));

			var taskNode = document.createElement("div");
			taskNode.classList.add("task-item");

			var taskContainer = document.createElement("div");
			taskContainer.classList.add("task-container");

			var newTaskCheckbox = document.createElement("input");
			newTaskCheckbox.setAttribute("id", "task" + newTaskId);
			newTaskCheckbox.setAttribute("type", "checkbox");
			newTaskCheckbox.addEventListener("click", OnCheckboxChange);
			newTaskCheckbox.setAttribute("name", "task" + newTaskId);
			newTaskCheckbox.setAttribute("autocomplete", "off");
			newTaskCheckbox.setAttribute("data-id", newTaskId);

			var newTaskLabel = document.createElement("label");
			newTaskLabel.setAttribute("for", "task" + newTaskId);

			var newTaskLabelChild = document.createElement("p");
			newTaskLabelChild.setAttribute("data-id", newTaskId);
			var labelTextNode = document.createTextNode(newTask.value);

			taskContainer.appendChild(newTaskCheckbox);
			newTaskLabelChild.appendChild(labelTextNode);
			newTaskLabel.appendChild(newTaskLabelChild);
			taskContainer.appendChild(newTaskLabel);
			taskNode.appendChild(taskContainer);

			var taskBtnsDiv = document.createElement("div");
			taskBtnsDiv.classList.add("task-buttons");

			var spanNodeUpdate = document.createElement("span");
			spanNodeUpdate.innerHTML = "&#9998;";
			spanNodeUpdate.classList.add("update-button");
			spanNodeUpdate.setAttribute("data-id", newTaskId);
			spanNodeUpdate.addEventListener("click", editTask);

			var spanNode = document.createElement("span");
			spanNode.innerHTML = "X";
			spanNode.classList.add("delete-button");
			spanNode.setAttribute("data-id", newTaskId);
			spanNode.addEventListener("click", deleteTask);

			taskBtnsDiv.appendChild(spanNodeUpdate);
			taskBtnsDiv.appendChild(spanNode);
			taskNode.appendChild(taskBtnsDiv);

			// add task to the bottom of the existing list
			document.querySelector(".tasks").appendChild(taskNode);

			// clear taskInput
			newTask.value = "";

			showNotification("Task added.");
		}
	}
}

function editTask() {
	// console.log(editBtn);
	var editBtn = this;

	// remove existing updateBtn if exists
	let existingUpdateBtn = document.querySelector(".update-task-btn");
	if (existingUpdateBtn != null) {
		existingUpdateBtn.remove();
	}

	let existingCancelBtn = document.querySelector(".cancel-update-btn");
	if (existingCancelBtn != null) {
		existingCancelBtn.remove();
	}

	// hide add btn
	let addBtn = document.querySelector("#add-task-btn");
	addBtn.style.display = "none";

	// dynamically create new update btn button and add to add-task div
	var updateTaskBtn = document.createElement("button");
	updateTaskBtn.innerHTML = "Update";
	// updateTaskBtn.setAttribute("id", "update-task-btn");
	// updateTaskBtn.id = "update-task-btn";
	// updateTaskBtn.setAttribute("id", "update-task-btn");
	updateTaskBtn.classList.add("update-task-btn");
	updateTaskBtn.setAttribute("data-id", editBtn.dataset.id);
	document.querySelector(".add-task").appendChild(updateTaskBtn);

	let updateBtn = document.querySelector(".update-task-btn");
	updateBtn.addEventListener("click", updateTask);

	// dynamically create cancel btn and add to add-task div
	var cancelUpdateBtn = document.createElement("button");
	cancelUpdateBtn.innerHTML = "Cancel";
	cancelUpdateBtn.classList.add("cancel-update-btn");
	document.querySelector(".add-task").appendChild(cancelUpdateBtn);

	let cancelBtn = document.querySelector(".cancel-update-btn");
	cancelBtn.addEventListener("click", cancelTaskUpdate);

	// add taskToUpdate current description to input
	// retrieve task to update
	let taskToUpdate = tasks.find(function (o) {
		return o.id === parseInt(editBtn.dataset.id);
	});

	let taskInput = document.querySelector("#taskinput");
	taskInput.value = taskToUpdate.taskDescription;
	taskInput.focus();

	taskInput.removeEventListener("keyup", addEnterKeyFunction, true);
	taskInput.addEventListener("keyup", addEnterKeyUpdateFunction, true);
}

function updateTask() {
	// console.log(this);
	var updateBtn = this;

	// retrieve task to update
	tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
	let taskToUpdateIndex = tasks.findIndex(function (o) {
		return o.id === parseInt(updateBtn.dataset.id);
	});

	// Check if input isn't empty, show dialog / notification
	let taskInput = document.querySelector("#taskinput");
	if (taskInput.value === "") {
		showNotification(
			"Input is empty, please type something in to update the task."
		);
	} else {
		// check if task is the same as an existing task / task not updated
		let taskExists = tasks.filter(function (task) {
			return (
				task.taskDescription.toLowerCase() ===
				String(taskInput.value).toLowerCase()
			);
		});

		if (taskExists.length > 0) {
			showNotification("Similar task already exists.");
		} else {
			tasks[taskToUpdateIndex].taskDescription = taskInput.value;
			localStorage.setItem("tasks", JSON.stringify(tasks));

			// show add btn
			let addBtn = document.querySelector("#add-task-btn");
			addBtn.style.display = "block";

			// remove update btn
			this.remove();

			// remove cancelBtn
			let cancelBtn = document.querySelector(".cancel-update-btn");
			cancelBtn.remove();

			// update task UI p text to new task Description
			let pTextToUpdate = document.querySelector(
				'p[data-id="' + updateBtn.dataset.id + '"]'
			);
			pTextToUpdate.textContent = taskInput.value;

			// clear taskInput
			taskInput.value = "";

			//Change enter key functionality back to adding task
			taskInput.removeEventListener("keyup", addEnterKeyUpdateFunction, true);
			taskInput.addEventListener("keyup", addEnterKeyFunction, true);

			showNotification("Task " + (taskToUpdateIndex + 1) + " updated.");
		}
	}
}

function cancelTaskUpdate() {
	// remove updateBtn
	let updateBtn = document.querySelector(".update-task-btn");
	updateBtn.remove();

	// show addBtn
	let addBtn = document.querySelector("#add-task-btn");
	addBtn.style.display = "block";

	// clear input field
	let taskInput = document.querySelector("#taskinput");
	taskInput.value = "";

	// remove cancelBtn
	var cancelBtn = this;
	cancelBtn.remove();

	taskInput.focus();

	taskInput.removeEventListener("keyup", addEnterKeyUpdateFunction, true);
	taskInput.addEventListener("keyup", addEnterKeyFunction, true);
}

function showNotification(message) {
	document.querySelector(".notification p").innerHTML = message;

	// show notification
	document.querySelector(".notification").classList.add("show");

	// hide notification after 2 seconds
	setTimeout(function () {
		document.querySelector(".notification").classList.remove("show");
	}, 2250);
}

// const tasks = [
//     {
//         id: 1,
//         taskDescription: "Lorem ipsum dolor sit amet consectetur. Debitis, in! 1",
//         completed: false
//     },
//     {
//         id: 2,
//         taskDescription: "Lorem, ipsum dolor sit amet consectetur. Tempora, doloribus! 2",
//         completed: true
//     }
// ];