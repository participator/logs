(function(undefined) {
    
    if (!window.Log) return;
    if (!window.Log.App) return;

    const exports = {};
    window.Log.App.Delete = exports;

    exports.deleteLog = id => {
        deleteData('http://localhost:8081/delete/log', id).then(response => {
            if (response === true) {
                // remove log from DOM
            }
        })
    }

    const deleteData = (url, id) => {
        return fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify({userId: window.Log.userId, id: id})
        });
    };
})()