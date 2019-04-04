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

        const titleElement = createFormInputElement('input', 'Title');
        titleElement.name = 'title';
        titleElement.lastElementChild.classList.add('createForm_title');
        form.appendChild(titleElement);

        const descriptionElement = createFormTextAreaElement('Description');
        descriptionElement.lastElementChild.classList.add('createForm_description');
        descriptionElement.name = 'description';
        form.appendChild(descriptionElement);

        const statusElement = createFormSelectElement('Status');
        statusElement.name = 'status';
        statusElement.lastElementChild.options.add(new Option('In Progress', 'InProgress'));
        statusElement.lastElementChild.options.add(new Option('Pending', 'Pending'));
        statusElement.lastElementChild.options.add(new Option('Completed', 'Completed'));
        statusElement.lastElementChild.options.add(new Option('Cancelled', 'Cancelled'));
        form.appendChild(statusElement);

        const typeElement = createFormSelectElement('Type');
        typeElement.name = 'type';
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
        createLogElement.value = window.Log.userId;
        createLogElement.innerText = 'Create Log';
        createLogElement.addEventListener('click', event => {
            event.preventDefault();
            
            const url = 'http://localhost:8081/create/log';
            const submittedValues = {
                title: titleElement.children[1].value,
                description: descriptionElement.children[1].value,
                status: statusElement.children[1].value,
                type: typeElement.children[1].value
            };

            fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({userId: window.Log.userId, data:[submittedValues]})
            }).then(res => {
                return res.json();
            }).then(data => {
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

    const createFormInputElement = (type, name) => {
        const element = document.createElement('input');
        element.setAttribute('type', type);
        
        // Create element's label
        const label = document.createElement('label');
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = name;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }

    const createFormSelectElement = (name) => {
        const element = document.createElement('select');
        
        // Create element's label
        const label = document.createElement('label');
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = name;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }

    const createFormTextAreaElement = (name) => {
        const element = document.createElement('textarea');
        element.setAttribute('name', name);
        
        // Create element's label
        const label = document.createElement('label');
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = name;
        
        label.appendChild(text);
        label.appendChild(element);

        return label;
    }
})()