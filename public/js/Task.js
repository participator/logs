(function(undefined) {

    const exports = {};
    window.Log.App.Task = exports;

    exports.createTaskElement = task => {

        const taskElement = document.createElement('li');
        taskElement.dataset.id = task._id;

        // Delete Actions
        let deleteElement = document.createElement('button');
        deleteElement.dataset.id = task._id;
        deleteElement.innerText = 'X';
        deleteElement.classList.add('task_delete');
        deleteElement.addEventListener('click', event => {
            exports.Delete.deletetask(event.target.dataset.id);
        });
        taskElement.appendChild(deleteElement);

        // Add title
        let title = document.createElement('h2');
        title.dataset.name = 'title';
        if (task.title) {
            title.innerText = task.title;
        }
        taskElement.appendChild(title);

        let description = document.createElement('p');
        description.dataset.name = 'description';
        if (task.description) {
            description.innerText = task.description;
        }
        taskElement.appendChild(description);

        // Add Helplful Resources
        if (task.helpfulResources && task.helpfulResources.length > 0) {
            taskElement.appendChild(createHelpfulResourcesElement(task.helpfulResources));
        }

        // Add Last Modified
        const lastModified = document.createElement('p');
        lastModified.append('Last Modified ');
        const date = new Date(task.modifiedDate || task.createdDate);
        lastModified.append(date.toLocaleDateString() || 'unset');
        taskElement.appendChild(lastModified);

        // Add status
        const status = document.createElement('p');
        status.append('Status ');
        const statusValue = document.createElement('span');
        statusValue.append(task.status);
        statusValue.dataset.name = 'status';
        status.append(statusValue);
        taskElement.appendChild(status);

        // Add type
        const type = document.createElement('span');
        type.classList.add('task_type');
        type.append(task.type);
        taskElement.appendChild(type);

        // Add action buttons
        const actions = document.createElement('div');
        actions.classList.add('task_actions');

        // Add Update task to actions
        const update = document.createElement('button');
        update.dataset.id = task._id;
        update.append('Update task');
        update.addEventListener('click', event => {
            const Update = window.task.App.Update;
            const target = event.target;
            Update.createUpdateForm(target.dataset.id);
        });
        actions.appendChild(update);

        // Add See history to actions
        const history = document.createElement('button');
        history.dataset.id = task._id;
        history.append('See History');
        actions.appendChild(history);

        // Add See task to actions
        const tasks = document.createElement('button');
        tasks.dataset.id = task._id;
        tasks.append('See Tasks');
        actions.appendChild(tasks);
        
        // Append actions to taskElement
        taskElement.appendChild(actions);

        return taskElement;

    };
})()