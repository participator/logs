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

        const helpfulResourcesElement = document.createElement('div');
        helpfulResourcesElement.classList.add('createForm_helpfulResources');
        const addHelpfulResourceButton = createAddHelpfulResourceButton(helpfulResourcesElement);
        form.appendChild(helpfulResourcesElement);
        form.appendChild(addHelpfulResourceButton);

        const statusElement = createFormSelectElement('status', 'Status');
        statusOptions.forEach(option => {
            statusElement.lastElementChild.options.add(new Option(option.text, option.value));
        })
        form.appendChild(statusElement);

        const typeElement = createFormSelectElement('type', 'Type');
        typeOptions.forEach(option => {
            typeElement.lastElementChild.options.add(new Option(option.text, option.value));
        })
        form.appendChild(typeElement);

        const createLogButton = document.createElement('button');
        createLogButton.classList.add('createLog_submitButton');
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

    const createAddHelpfulResourceButton = (parentElement) => {
        const addHelpfulResourceButton = document.createElement('button');
        addHelpfulResourceButton.classList.add('createLog_addHelpfulResourceButton');
        addHelpfulResourceButton.innerText = 'Add a Resource';
        addHelpfulResourceButton.type = 'button';

        addHelpfulResourceButton.addEventListener('click', () => {
            const container = createAddHelpfulResourceInputs();            

            parentElement.appendChild(container);
        });

        return addHelpfulResourceButton;
    }

    const createAddHelpfulResourceInputs = (title, link, description) => {
        const container = document.createElement('div');
        container.classList.add('createForm_helpfulResources_Inputs');

        // delete
        const deleteHelpfulResource = document.createElement('button');
        deleteHelpfulResource.innerText = 'X';
        deleteHelpfulResource.classList.add('createForm_helpfulResources_Delete');
        deleteHelpfulResource.classList.add('btn');
        deleteHelpfulResource.addEventListener('click', event => {
            const helpfulResource = event.target.parentNode;
            helpfulResource.remove();
        });
        container.appendChild(deleteHelpfulResource);
        
        // title
        const titleInputElement = document.createElement('input');
        titleInputElement.classList.add('createForm_helpfulResources_Input');
        titleInputElement.placeholder = 'Add title of resource here';
        titleInputElement.type = 'text';
        titleInputElement.value = title || "";
        container.appendChild(titleInputElement);
        
        // link
        const linkInputElement = document.createElement('input');
        linkInputElement.classList.add('createForm_helpfulResources_Input');
        linkInputElement.placeholder = 'Add link to this resource here';
        linkInputElement.type = 'text';
        linkInputElement.value = link || "";
        container.appendChild(linkInputElement);
        
        // description
        const descriptionInputElement = document.createElement('input');
        descriptionInputElement.classList.add('createForm_helpfulResources_Input');
        descriptionInputElement.placeholder = 'How is this useful?';
        descriptionInputElement.type = 'text';
        descriptionInputElement.value = description || "";
        container.appendChild(descriptionInputElement);

        return container;
    }

    const statusOptions = [
        {
            text: 'In Progress',
            value: 'InProgress'
        },
        {
            text: 'Pending',
            value: 'Pending'
        },
        {
            text: 'Completed',
            value: 'Completed'
        },
        {
            text: 'Cancelled',
            value: 'Cancelled'
        }
    ]

    const typeOptions = [
        {
            text: 'Development',
            value: 'Development'
        },
        {
            text: 'Financial',
            value: 'Financial'
        },
        {
            text: 'Entertainment',
            value: 'Entertainment'
        },
        {
            text: 'Health',
            value: 'Health'
        },
        {
            text: 'Travel',
            value: 'Travel'
        }
    ]
})();