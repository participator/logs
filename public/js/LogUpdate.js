(function(undefined) {
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');
    if (!window.Log.App.Shared) throw new Error('App Shared library is not loaded');
    if (!window.Log.Error) throw new Error('Error library is not loaded');

    const Shared = window.Log.App.Shared;

    const exports = {};
    window.Log.App.Update = exports;

    const submitEventHandler = (event, logId) => {
        const fd = new FormData(event.target.form);

            const url = 'http://localhost:8081/updates/log';
            const submittedValues = {};
            
            // Add log id to formData object
            fd.set('id', logId);
            for(keyValueArr of fd) {
                submittedValues[keyValueArr[0]] = keyValueArr[1];
            }

            console.log('[create event form]', fd);
            
            return fetch(url, {
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify({userId: window.Log.userId, data:submittedValues}),
                headers: {
                    'Content-Type': 'application/json'
                }
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
    };

    const mapLogData = (id, form) => {
        const log = document.querySelector(`.logs li[data-id="${id}"]`);

        for( var elem of form.elements ) {
            log.childNodes.forEach(l => {
                if (l.dataset.name === elem.name) {
                    elem.value = l.textContent;
                }
            })
        }

        return form;
    };

    exports.updateActionsButtons = (log) => {
        convertLogToEditable(log);
        switchToEditableActions(log.querySelector('.log_actions'));
    }
    
    // TODO: consider having a function that builds a JSON object with log data on UI
    // that log data is passed into another function with creates a new log element
    // replaces the old log element
    const convertLogToEditable = (logElement) => {
        const editableElements = logElement.querySelectorAll('[data-name]');

        editableElements.forEach(element => {

            switch (element.dataset.name) {
                case 'title':
                case 'description':
                    element.contentEditable = true;
                    break;

                case 'helpfulResource':
                    const titleElement = element.querySelector('[data-helpful-resource="title"]');
                    const descriptionElement = element.querySelector('[data-helpful-resource="usefulness"]');
                    
                    /**
                     * @param title - input element for title of resource
                     * @param link - input element for link of resource
                     * @param description - input element for description of resource
                     */
                    const helpfulResourceInputs = Shared.createAddHelpfulResourceInputs(
                        titleElement.innerText, 
                        titleElement.href, 
                        descriptionElement.innerText);

                    helpfulResourceInputs.contentEditable = true;

                    element.innerHTML = '';
                    element.appendChild(helpfulResourceInputs);
                    console.log('[helpfulResource]', helpfulResourceInputs);
                    break;

                    case 'status':
                    const statusSelectElement = Shared.createFormSelectStatusElement(element.value);

                    element.parentNode.contentEditable = true;

                    element.innerHTML = '';
                    element.appendChild(statusSelectElement.querySelector('[name="status"]'));
                    console.log('[status]', statusSelectElement);
                    break;

                case 'type':
                    const typeSelectElement = Shared.createFormSelectTypeElement(element.value);

                    element.contentEditable = true;

                    element.innerHTML = '';
                    element.appendChild(typeSelectElement);
                    console.log('[type]', typeSelectElement);
                    break;
            }
        });
    }

    const switchToEditableActions = (actionsElement) => {
        actionsElement.childNodes.forEach(element => {
            element.dataset.editableAction ?
                element.classList.remove('none') :
                element.classList.add('none');
        })
    }


    
})()