(function(undefined) {

    if (!window.Log.App) throw new Error('App library is not loaded');
    
    const exports = {};
    window.Log.App.Shared = exports;

    /**
     * Makes a log form to submit to the server
     * @param {HTMLElement} formParentElement - element to enter form into
     * @param {Object} formObjects - object with {id, enctype, method} for the form
     * @param {string} title - words for the form's submit button
     * @param {Function} submitHandler - callback to use for the submit event
     * @param {Number} logId - id of element to update or delete
     */
    exports.makeCreateForm = (formParentElement, formOptions, title, submitHandler, id) => {
        return {
            header: makeFormHeader(formParentElement, title),
            form: makeForm(formOptions, title, submitHandler, id)
        };
    };

    const makeForm = (formOptions, title, submitHandler, id) => {
        const form = document.createElement('form');
        form.id = formOptions.id;
        form.enctype = formOptions.enctype;
        form.method = formOptions.method;

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

        const createLogButton = document.createElement('button');
        createLogButton.classList.add('createLog');
        createLogButton.type = "submit";
        createLogButton.form = form.id;
        createLogButton.innerText = title;

        // Add Submit Event Handler
        createLogButton.addEventListener('click', event => {
            event.preventDefault();
            
            submitHandler(event, id);
        });

        // Attach to form
        form.appendChild(createLogButton);

        return form;
    };

    const makeFormHeader = (parent, title) => {
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
})();