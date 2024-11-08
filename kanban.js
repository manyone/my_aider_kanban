function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const columns = ['todo', 'in-progress', 'done'];

    columns.forEach(column => {
        const list = document.getElementById(`${column}-list`);
        list.addEventListener('dragover', allowDrop);
        list.addEventListener('drop', drop);
    });

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const task = document.getElementById(data);
        const target = ev.target;

        // Check if the target is a task or the list itself
        if (target.className === 'task') {
            // If it's a task, insert the dragged task before this task
            target.parentNode.insertBefore(task, target);
        } else if (target.className === 'task-list') {
            // If it's the list, append the task to the end
            target.appendChild(task);
        }
    }

    // Add event listener to the "Add Task" button
    document.getElementById('add-task-button').addEventListener('click', addTask);
});

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskColor = document.getElementById('task-color').value;
    if (taskName) {
        const task = document.createElement('div');
        task.className = 'task';
        task.draggable = true;
        task.id = `task-${Date.now()}`;
        task.textContent = taskName;
        task.style.backgroundColor = taskColor;
        task.addEventListener('dragstart', drag);
        task.addEventListener('click', showUpdateForm);

        document.getElementById('todo-list').appendChild(task);
        document.getElementById('task-name').value = '';
        document.getElementById('task-color').value = '#ffffff';
    }
}

function showUpdateForm(event) {
    const task = event.target;
    const form = document.createElement('form');
    form.className = 'update-form';
    const rgbColor = task.style.backgroundColor;
    const hexColor = rgbToHex(rgbColor);
    form.innerHTML = `
        <input type="text" id="update-task-name" value="${task.textContent}">
        <input type="color" id="update-task-color" value="${hexColor}">
        <button type="button" id="save-task">Save</button>
        <button type="button" id="cancel-task">Cancel</button>
        <button type="button" id="delete-task">Delete</button>
    `;

    // Save button functionality
    form.querySelector('#save-task').addEventListener('click', function() {
        const newName = document.getElementById('update-task-name').value;
        const newColor = document.getElementById('update-task-color').value;
        task.textContent = newName;
        task.style.backgroundColor = newColor;
        form.remove();
    });

    // Cancel button functionality
    form.querySelector('#cancel-task').addEventListener('click', function() {
        form.remove();
    });

    // Delete button functionality
    form.querySelector('#delete-task').addEventListener('click', function() {
        task.remove();
    });

    task.appendChild(form);
}

function rgbToHex(rgb) {
    // Convert RGB to Hex
    if (rgb.startsWith('rgb')) {
        const rgbValues = rgb.match(/\d+/g);
        const r = parseInt(rgbValues[0], 10);
        const g = parseInt(rgbValues[1], 10);
        const b = parseInt(rgbValues[2], 10);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return rgb; // If it's already in hex format, return as is
}
