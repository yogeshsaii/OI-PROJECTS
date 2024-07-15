document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    const titleInput = document.getElementById('new-task-title');
    const descInput = document.getElementById('new-task-desc');
    const taskTitle = titleInput.value.trim();
    const taskDesc = descInput.value.trim();

    if (taskTitle !== '' && taskDesc !== '') {
        createTaskElement(taskTitle, taskDesc, 'pending');
        titleInput.value = '';
        descInput.value = '';
    } else {
        alert('Please fill out all fields.');
    }
}

function createTaskElement(taskTitle, taskDesc, status) {
    const table = status === 'pending' ? document.getElementById('pending-tasks') : document.getElementById('completed-tasks');
    
    const row = document.createElement('tr');
    const titleCell = document.createElement('td');
    const descCell = document.createElement('td');
    const actionCell = document.createElement('td');
    
    titleCell.textContent = taskTitle;
    descCell.textContent = taskDesc;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
        row.remove();
    });

    const toggleButton = document.createElement('button');
    toggleButton.textContent = status === 'pending' ? 'Complete' : 'Pending';
    toggleButton.addEventListener('click', () => {
        if (status === 'pending') {
            document.getElementById('completed-tasks').appendChild(row);
            row.classList.add('completed');
            status = 'completed';
            toggleButton.textContent = 'Pending';
        } else {
            document.getElementById('pending-tasks').appendChild(row);
            row.classList.remove('completed');
            status = 'pending';
            toggleButton.textContent = 'Complete';
        }
    });

    actionCell.appendChild(toggleButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(titleCell);
    row.appendChild(descCell);
    row.appendChild(actionCell);

    table.appendChild(row);
}
