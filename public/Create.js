(function(undefined) {

    const userId = window.Log.userId;

    const createButton = document.getElementById('create');

    createButton.addEventListener('click', event => {
        const createFormElement = document.getElementById('createForm');
        createFormElement.innerHTML = createForm();
    });

    const createForm = () => {
        const form = document.createElement('form');
        
        const titleElement = createFormElement('input', 'Title');
        form.appendChild(titleElement);

        const descriptionElement = createFormElement('input', 'Description');
        form.appendChild(descriptionElement);

        const statusElement = createFormElement('select', 'Status');
        form.appendChild(statusElement);

        const typeElement = createFormElement('radio', 'Type');
        form.appendChild(typeElement);

        const userIdElement = document.createElement('hidden');
        userIdElement.value = userId;
        form.appendChild(userIdElement);

        return form.outerHTML;
    };

    const createFormElement = (type, name) => {
        const element = document.createElement('input');
        element.setAttribute('type', type);
        
        // Create element's label
        const label = document.createElement('label');
        label.innerHTML = name;
        label.appendChild(element);

        return element;
    }
})()