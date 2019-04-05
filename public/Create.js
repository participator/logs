(function(undefined) {

    const userId = window.Log.userId;
    const App = window.Log.App;
    
    const createButton = document.getElementById('create');

    let createFormHeader;
    let createFormElement;
    createButton.addEventListener('click', event => {
        const createFormParentElement = document.getElementById('createForm');
        if (!createFormElement) {
            createFormHeader = makeCreateFormHeader(createFormParentElement, 'Create Log');
            createFormElement = makeCreateForm(createFormParentElement);
        }
        createFormParentElement.appendChild(createFormHeader);
        createFormParentElement.appendChild(createFormElement);
        createFormParentElement.hidden = false;
    });

    const makeCreateForm = () => {
        const form = document.createElement('form');
        form.id = 'createLog';
        form.enctype = 'multipart/form-data';
        form.method = 'post';

        const titleElement = createFormInputElement('text', 'title', 'Title');
        titleElement.lastElementChild.classList.add('createForm_title');
        form.appendChild(titleElement);

        const descriptionElement = createFormTextAreaElement('description', 'Description');
        descriptionElement.lastElementChild.classList.add('createForm_description');
        form.appendChild(descriptionElement);

        const statusElement = createFormSelectElement('status', 'Status');
        statusElement.lastElementChild.options.add(new Option('In Progress', 'InProgress'));
        statusElement.lastElementChild.options.add(new Option('Pending', 'Pending'));
        statusElement.lastElementChild.options.add(new Option('Completed', 'Completed'));
        statusElement.lastElementChild.options.add(new Option('Cancelled', 'Cancelled'));
        form.appendChild(statusElement);

        const typeElement = createFormSelectElement('type', 'Type');
        typeElement.lastElementChild.options.add(new Option('Development', 'Development'));
        typeElement.lastElementChild.options.add(new Option('Financial', 'Financial'));
        typeElement.lastElementChild.options.add(new Option('Entertainment', 'Entertainment'));
        typeElement.lastElementChild.options.add(new Option('Health', 'Health'));
        typeElement.lastElementChild.options.add(new Option('Travel', 'Travel'));
        typeElement.lastElementChild.options.add(new Option('Add One', 'AddOne'));
        form.appendChild(typeElement);

        // const userIdElement = document.createElement('input');
        // userIdElement.type = "hidden";
        // userIdElement.name = 'userId';
        // userIdElement.value = window.Log.userId;
        // form.appendChild(userIdElement);

        const createLogElement = document.createElement('button');
        createLogElement.classList.add('createLog');
        createLogElement.type = "submit";
        createLogElement.form = 'createLog';
        createLogElement.innerText = 'Create Log';

        // Add Submit Event Handler
        createLogElement.addEventListener('click', event => {
            event.preventDefault();
            
            const fd = new FormData(event.target.form);

            const url = 'http://localhost:8081/create/log';
            const submittedValues = {};
            for(keyValueArr of fd) {
                submittedValues[keyValueArr[0]] = keyValueArr[1];
            }

            console.log('[create event form]', fd);
            fetch(url, {
                method: 'POST',
                // mode: 'cors',
                body: JSON.stringify({userId: window.Log.userId, data:submittedValues})
            })
            .then(response => response.json())
            .then(data => {
                // Add new log to UI
                const logElements = data.map(log => {
                    return App.createLogElement(log);
                });

                const logsElement = document.querySelector('.logs');
                logElements.forEach(logElement => logsElement.insertBefore(logElement, logsElement.children[0]));
            }).catch(err => {
                // Show error on UI
            });
        });
        form.appendChild(createLogElement);

        return form;
    };

    const makeCreateFormHeader = (parent, title) => {
        const headerElement = document.createElement('header');
        headerElement.classList.add('createForm_header');
        
        const titleElement = document.createElement('p');
        titleElement.classList.add('createForm_header_title');
        titleElement.innerHTML = title;
        
        const closeElement = document.createElement('button');
        closeElement.innerHTML = 'x';
        closeElement.classList.add('createLog_close');
        closeElement.addEventListener('click', event => {
            event.preventDefault();
            // Close Create Log Form
            parent.hidden = true;
        });

        headerElement.appendChild(titleElement);
        headerElement.appendChild(closeElement);

        return headerElement;
    };

    /**
     * 
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLLabelElement}
     */
    const createFormInputElement = (type, name, title) => {
        const element = document.createElement('input');
        element.name = name;
        element.type = type;
        
        // Create element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }

    /**
     * 
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLLabelElement}
     */
    const createFormSelectElement = (name, title) => {
        const element = document.createElement('select');
        element.name = name;
        
        // Create element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }

    /**
     * 
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLLabelElement}
     */
    const createFormTextAreaElement = (name, title) => {
        const element = document.createElement('textarea');
        element.name = name;
        
        // Create element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }
})()