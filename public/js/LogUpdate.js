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

    exports.convertToEditable = (logElement) => {
        const editableElements = logElement.querySelectorAll('[data-name]');

        editableElements.forEach(element => {
            element.contentEditable = true

            switch (element.dataset.name) {
                case 'helpfulResource': 
                    console.log('[helpfulResource] ', element);
                    break;
                case 'status': 
                    console.log('[status]', element.innerText);
                    break;
                case 'type':
                    console.log('[type]', element.innerText);
                    break;
            }
        });
    }
    
})()