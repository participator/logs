(function(undefined) {
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');
    if (!window.Log.Shared) throw new Error('App Shared library is not loaded');
    if (!window.Log.Error) throw new Error('Error library is not loaded');

    const Shared = window.Log.Shared
    const App = window.Log.App;

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

    exports.updateActionsButtons = (userId, logElement) => {
        const logDataOriginal = parseLogDataOriginal(logElement);
        console.log('logDataOriginal ', logDataOriginal);
        convertLogToEditable(logElement);
        addEventsToEditableActions(userId, logElement);
        switchToEditableActions(logElement.querySelector('.log_actions'));
    }

    /***
     * @param {HTMLDIVELEMENT} LogElement - html log element
     * @returns {Object} LogData - data of a log
     */
    const parseLogDataOriginal = (logElement) => {
        const logData = {};
        const editableElements = logElement.querySelectorAll('[data-name]');

        logData._id = logElement.dataset.id;
        editableElements.forEach(element => {

            switch (element.dataset.name) {
                case 'title':
                case 'description':
                    logData[element.dataset.name] = element.innerText;
                    break;

                case 'helpfulResource':
                    const titleElement = element.querySelector('[data-helpful-resource="title"]');
                    const usefulnessElement = element.querySelector('[data-helpful-resource="usefulness"]');
                    
                    if (logData.helpfulResources === undefined) 
                        logData.helpfulResources = [];

                    logData.helpfulResources.push({
                        name: titleElement.innerText,
                        url: titleElement.href,
                        usefulness: usefulnessElement.innerText
                    });
                    break;

                    case 'status':
                    logData.status = element.innerText;
                    break;

                case 'type':
                    logData.type = element.innerText;
                    break;
            }
        });

        return logData;
    };

    const parseLogDataUpdates = (logElement) => {
        const logData = {};
        logData.id = logElement.dataset.id;

        const titleAndDescriptionParser = (element) => {
            logData[element.dataset.name] = element.innerText;
        }

        const helpfulResourceParser = (element) => {
            const titleElement = element.querySelector('[data-helpful-resource="title"]');
            const urlElement = element.querySelector('[data-helpful-resource="url"]');
            const usefulnessElement = element.querySelector('[data-helpful-resource="usefulness"]');

            if (logData.helpfulResources === undefined)
                logData.helpfulResources = [];

            logData.helpfulResources.push({
                name: titleElement.value,
                url: urlElement.value,
                usefulness: usefulnessElement.value
            });
        }

        const statusParser = (element) => {
            logData.status = element.querySelector('select').value;
            console.log('[statusParser]', element);
        }

        const typeParser = (element) => {
            logData.type = element.querySelector('select').value;
            console.log('[typeParser]', element);
        }

        logElementParser(logElement,
            titleAndDescriptionParser,
            helpfulResourceParser,
            statusParser,
            typeParser
        )

        return logData;
    }
    
    // TODO: consider having a function that builds a JSON object with log data on UI
    // that log data is passed into another function with creates a new log element
    // replaces the old log element
    const convertLogToEditable = (logElement) => {

        const titleAndDescriptionParser = (element) => {
            element.contentEditable = true;
        }

        const helpfulResourceParser = (element) => {
            const titleElement = element.querySelector('[data-helpful-resource="title"]');
            const descriptionElement = element.querySelector('[data-helpful-resource="usefulness"]');

            /**
             * @param title - input element for title of resource
             * @param link - input element for link of resource
             * @param description - input element for description of resource
             * @returns {DocumentFragment} fragment - all inputs without a container
             */
            const helpfulResourceInputsElement = Shared.createAddHelpfulResourceInputs(
                titleElement.innerText,
                titleElement.href,
                descriptionElement.innerText);

            const inputs = helpfulResourceInputsElement.querySelectorAll('input');
            inputs[0].dataset.helpfulResource = 'title';
            inputs[1].dataset.helpfulResource = 'url';
            inputs[2].dataset.helpfulResource = 'usefulness';

            element.classList.remove('log_helpfulResource');
            element.classList.add('update_helpfulResource_Input');

            element.contentEditable = true;
            element.innerHTML = '';
            
            element.appendChild(helpfulResourceInputsElement);
        }

        const statusParser = (element) => {
            const statusSelectElement = Shared.createFormSelectStatusElement(true);
            statusSelectElement.value = element.innerText;

            element.parentNode.contentEditable = true;

            element.innerHTML = '';
            element.appendChild(statusSelectElement);
        }

        const typeParser = (element) => {
            const typeSelectElement = Shared.createFormSelectTypeElement(element.innerText);
            typeSelectElement.querySelector('select').value = element.innerText;

            element.contentEditable = true;

            element.innerHTML = '';
            element.appendChild(typeSelectElement);
        }
        
        logElementParser(logElement,
            titleAndDescriptionParser,
            helpfulResourceParser,
            statusParser,
            typeParser
            )
    }

    const logElementParser = (logElement, titleAndDescriptionParser, helpfulResourceParser, statusParser, typeParser) => {
        const editableElements = logElement.querySelectorAll('[data-name]');

        editableElements.forEach(element => {

            switch (element.dataset.name) {
                case 'title':
                case 'description':
                    titleAndDescriptionParser(element);
                    break;

                case 'helpfulResource':
                    helpfulResourceParser(element);
                    break;

                case 'status':
                    statusParser(element);
                    break;

                case 'type':
                    typeParser(element);
                    break;
            }
        });
    }

    const addEventsToEditableActions = (userId, logElement) => {
        const logId = logElement.dataset.id;
        const editableActions = document.querySelectorAll(`button[data-id="${logId}"][data-editable-action="true"]`);
        const updateElement = editableActions[0];
        const cancelElement = editableActions[1];

        // Update Button Click Handler
        updateElement.addEventListener('click', () => {
            const logDataUpdates = parseLogDataUpdates(logElement);
            console.info('[parseLogDataUpdates]', logDataUpdates);
            updateLog(userId, logId, logElement, logDataUpdates);
            console.info('[updateLog] complete');
        });

        // Cancel Button Click Handler
        cancelElement.addEventListener('click', () => revertLog(userId, logId, logElement));
    }

    const switchToEditableActions = (actionsElement) => {
        actionsElement.childNodes.forEach(element => {
            element.dataset.editableAction ?
                element.classList.remove('none') :
                element.classList.add('none');
        })
    }

    const updateLog = (userId, logId, logElement, logDataUpdates) => {
        // Show loading icon
        const loadingOverlay = createLoadingOverlay('Updating...');
        
        logElement.appendChild(loadingOverlay);
        logElement.classList.add('log_centerElements'); // Helps aligns loading overlay in the center

        // Save updates
        const host = 'http://localhost:8081';
        Shared.fetchData(`${host}/updates/log`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({userId: userId, data: logDataUpdates}),
        })
        .then(log => {
            // Display log data
            if (log) {
                const newLogElement = App.createLogElement(log);
                logElement.classList.remove('log_centerElements');
                logElement.parentElement.replaceChild(newLogElement, logElement);
            }
        }).catch(err => {
            // TODO: Log error
            //LogError(error);
            console.log('[error: updateLog]', err);
            logElement.innerText = 'Unable to update log.  Refresh to see log\'s data';
        })

        // Show Successful message

        // Show updated log data
    };

    const revertLog = (userId, logId, logElement) => {
        // Show loading icon
        const loadingOverlay = createLoadingOverlay('Canceling...');
        
        logElement.appendChild(loadingOverlay);
        logElement.classList.add('log_centerElements'); // Helps aligns loading overlay in the center

        // Get log data
        const host = '//localhost:8081';
        Shared.fetchData(`${host}/reads/${userId}/log/${logId}`)
        .then(data => {
            // Display log data
            data && data.forEach(log => {
                const newLogElement = App.createLogElement(log);
                logElement.classList.remove('log_centerElements');
                logElement.parentElement.replaceChild(newLogElement, logElement);
            })
        }).catch(err => {
            // TODO: Log error
            //LogError(error);
            console.log('[error: revertLog]', err);
            logElement.innerText = 'Unable to reload log.  Refresh to see log\'s data';
        });

    }

    const createLoadingOverlay = (message) => {
        const container = document.createElement('div');
        container.classList.add('log_overlay');

        const loadingElement = document.createElement('div');
        loadingElement.append(message);
        loadingElement.classList.add('log_data_loading');

        container.appendChild(loadingElement);

        return container;
    }
    
})()