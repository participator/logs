(function(undefined) {

    const userId = window.Log.userId;
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');
    if (!window.Log.App.Shared) throw new Error('App Shared library is not loaded');

    const App = window.Log.App;
    const Shared = window.Log.App.Shared;
        
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

            const url = 'http://localhost:8081/creates/log';
            const submittedValues = {};
            for(keyValueArr of fd) {
                submittedValues[keyValueArr[0]] = keyValueArr[1];
            }

            console.log('[create event form]', fd);
            fetch(url, {
                method: 'POST',
                mode: 'cors',
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
    };
})()