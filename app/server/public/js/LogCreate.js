(function(undefined) {

    const userId = window.Log.userId;
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.Shared) throw new Error('App Shared library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');

    const Shared = window.Log.Shared;
    const App = window.Log.App;
        
    const createButton = document.querySelector('.app_actions_create');

    let createForm;
    createButton.addEventListener('click', () => {
        const createFormParentElement = document.querySelector('.app_forms_create');
        
        if (!createForm) {
            createForm = Shared.makeCreateForm(createFormParentElement, {
                id: 'createLog',
                enctype: 'multipart/form-data',
                method: 'post'
            }, 'Create Log', submitEventHandler);
        }
        
        createFormParentElement.appendChild(createForm.header);
        createFormParentElement.appendChild(createForm.form);
        createFormParentElement.hidden = false;
    });

    const submitEventHandler = event => {
        const fd = new FormData(event.target.form);

            const submittedValues = {};
            const helpfulResourcesNames = [];
            const helpfulResourcesUrls = [];
            const helpfulResourcesUsefulnesses = [];

            for(keyValueArr of fd) {
                switch (keyValueArr[0]) {
                    case 'helpfulResource_name':
                            helpfulResourcesNames.push(keyValueArr[1]);
                        break;
                    case 'helpfulResource_url':
                        helpfulResourcesUrls.push(keyValueArr[1]);
                        break;
                    case 'helpfulResource_usefulness':
                        helpfulResourcesUsefulnesses.push(keyValueArr[1]);
                        break;
                    default:
                        submittedValues[keyValueArr[0]] = keyValueArr[1];
                }
            }

            if (helpfulResourcesNames && 
                helpfulResourcesUrls && 
                helpfulResourcesUsefulnesses &&
                helpfulResourcesNames.length === helpfulResourcesUrls.length &&
                helpfulResourcesNames.length === helpfulResourcesUsefulnesses.length) {
                const helpfulResources = [];

                for (var index=0; index < helpfulResourcesNames.length; index++) {
                    helpfulResources.push({
                        name: helpfulResourcesNames[index],
                        url: new URL(helpfulResourcesUrls[index]),
                        usefulness: helpfulResourcesUsefulnesses[index]

                    })
                }

                submittedValues.helpfulResources = helpfulResources;
            }

            const url = 'http://localhost:8081/creates/log';
            Shared.fetchData(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({userId: window.Log.userId, data:submittedValues})
            })
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
})()