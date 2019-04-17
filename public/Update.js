(function(undefined) {
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');
    if (!window.Log.App.Shared) throw new Error('App Shared library is not loaded');
    if (!window.Log.Error) throw new Error('Error library is not loaded');

    const Shared = window.Log.App.Shared;

    const exports = {};
    window.Log.App.Update = exports;

    let createForm;
    exports.createUpdateForm = (id) => {
        const updateFormParentElement = document.getElementById('updateForm');
        
        if (!createForm) {
            createForm = Shared.makeCreateForm(updateFormParentElement, {
                id: 'updateLog',
                enctype: 'multipart/form-data',
                method: 'UPDATE'
            }, 'Update Log', submitEventHandler, id);
        }
        
        updateFormParentElement.appendChild(createForm.header);
        updateFormParentElement.appendChild(createForm.form);
        updateFormParentElement.hidden = false;
    }

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
                method: 'UPDATE',
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