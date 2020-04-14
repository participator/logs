(function(undefined) {
    
    if (!window.Log) throw new Error('Log library is not loaded');
    if (!window.Log.App) throw new Error('App library is not loaded');
    if (!window.Log.Error) throw new Error('Error library is not loaded');

    const exports = {};
    window.Log.App.Delete = exports;

    exports.deleteLog = id => {
        deleteData('http://localhost:8081/deletes/log', id)
        .then(response => {
            if (response === true) {
                const deleted = document.querySelector(`li[data-id="${id}"]`);
                deleted.remove();
            }
            else if (response === false) {
                console.log('Unable to delete');
            }
        })
    }

    const deleteData = (url, id) => {
        return fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify({userId: window.Log.userId, id: id})
        })
        .then(response => response.json());
    };
})()