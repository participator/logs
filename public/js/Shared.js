(function(undefined) {

    if (!window.Log) window.Log = {};
    if (window.Log.Shared) throw new Error('Name collision with Log\'s Shared package');
    
    const exports = {};
    window.Log.Shared = exports;

    // Fetch data from endpoint with search parameters
    /**
     * 
     * @param {string} url - url string to resource
     * @param {Object} options - Request options
     */
    exports.fetchData = (url, options) => fetch(url, options)
    .then(response => {
        return response.json();
    })
    .catch(err => {
        // LogError(err);
        throw err;
    });
    
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

        const statusElement = exports.createFormSelectStatusElement();
        form.appendChild(statusElement);

        const typeElement = exports.createFormSelectTypeElement()
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
        // Create input element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        // Create input element's title
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        label.appendChild(text);
        
        // Create input element
        const input = document.createElement('input');
        input.name = name;
        input.type = type;
        label.appendChild(input);

        return label;
    }

    /**
     * createFormSelectElementWithLabel
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLLabelElement} - select form surrounded with label and text for its title
     */
    const createFormSelectElementWithLabel = (name, title) => {
        // Create element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        label.appendChild(text);
        
        const select = document.createElement('select');
        select.name = name;
        label.appendChild(select);

        return label;
    }

    /**
     * createFormSelectElement
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLSelectElement} - select form
     */
    const createFormSelectElement = (name) => {
        const select = document.createElement('select');
        select.name = name;

        return select;
    }

    const statusOptions = [
        {
            text: 'In Progress',
            value: 'In Progress'
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
            text: 'Canceled',
            value: 'Canceled'
        }
    ]

    /**
     * Creates a select input
     * @param {Boolean} withoutLabel - Create a select element without a label?
     * @returns {HTMLSelectElement} statusSelectElement
     */
    exports.createFormSelectStatusElement = (withoutLabel) => {
        let statusSelectElement;
        
        withoutLabel ? statusSelectElement = createFormSelectElement('status') :
        statusSelectElement = createFormSelectElementWithLabel('status', 'Status');

        statusOptions.forEach(option => {
            if (withoutLabel) {
                statusSelectElement.options.add(new Option(option.text, option.value));
            }
            else {
                statusSelectElement.lastElementChild.options.add(new Option(option.text, option.value));
            }
        })

        return statusSelectElement;
    }

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

    exports.createFormSelectTypeElement = () => {
        const typeSelectElement = createFormSelectElementWithLabel('type', 'Type');

        typeOptions.forEach(option => {
            typeSelectElement.lastElementChild.options.add(new Option(option.text, option.value));
        })

        return typeSelectElement;
    }

    /**
     * 
     * @param {string} name - string added into element's name attribute
     * @param {string} title - string shown on UI to title the field
     * @returns {HTMLLabelElement}
     */
    const createFormTextAreaElement = (name, title) => {
        // Create element's label
        const label = document.createElement('label');
        label.htmlFor = name;
        
        const text = document.createElement('span');
        text.classList.add('createForm_label_text');
        text.innerHTML = title;
        label.appendChild(text);

        const textarea = document.createElement('textarea');
        textarea.name = name;
        label.appendChild(textarea);

        return label;
    }

    const createAddHelpfulResourceButton = (parentElement) => {
        const addHelpfulResourceButton = document.createElement('button');
        addHelpfulResourceButton.classList.add('createLog_addHelpfulResourceButton');
        addHelpfulResourceButton.innerText = 'Add a Resource';
        addHelpfulResourceButton.type = 'button';

        addHelpfulResourceButton.addEventListener('click', () => {
            const container = document.createElement('div');
            container.classList.add('createForm_helpfulResources_Inputs');
            
            const addHelpfulResourceInputs = exports.createAddHelpfulResourceInputs();

            container.appendChild(addHelpfulResourceInputs);

            parentElement.appendChild(container);
        });

        return addHelpfulResourceButton;
    }

    /**
     * Creates input elements for Helpful Resources
     * @param {string} title - input element for title of resource
     * @param {string} link - input element for link of resource
     * @param {string} description - input element for description of resource
     * @returns {DocumentFragment} fragment - all inputs without a container
     */
    exports.createAddHelpfulResourceInputs = (title, link, description) => {
        const fragment = document.createDocumentFragment();

        // delete
        const deleteHelpfulResource = document.createElement('button');
        deleteHelpfulResource.innerText = 'X';
        deleteHelpfulResource.classList.add('createForm_helpfulResources_Delete');
        deleteHelpfulResource.classList.add('btn');
        deleteHelpfulResource.addEventListener('click', event => {
            const helpfulResource = event.target.parentNode;
            helpfulResource.remove();
        });
        fragment.appendChild(deleteHelpfulResource);
        
        // name
        const nameInputElement = document.createElement('input');
        nameInputElement.classList.add('createForm_helpfulResources_Input');
        nameInputElement.name = 'helpfulResource_name';
        nameInputElement.placeholder = 'Add name of resource here';
        nameInputElement.type = 'text';
        nameInputElement.value = title || "";
        fragment.appendChild(nameInputElement);
        
        // url
        const urlInputElement = document.createElement('input');
        urlInputElement.classList.add('createForm_helpfulResources_Input');
        urlInputElement.name = 'helpfulResource_url';
        urlInputElement.placeholder = 'Add link to this resource here';
        urlInputElement.type = 'text';
        urlInputElement.value = link || "";
        fragment.appendChild(urlInputElement);
        
        // description
        const usefulnessInputElement = document.createElement('input');
        usefulnessInputElement.classList.add('createForm_helpfulResources_Input');
        usefulnessInputElement.name = 'helpfulResource_usefulness';
        usefulnessInputElement.placeholder = 'How is this useful?';
        usefulnessInputElement.type = 'text';
        usefulnessInputElement.value = description || "";
        fragment.appendChild(usefulnessInputElement);

        return fragment;
    }

})();