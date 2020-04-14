(function(undefined) {

    if (!window.Log) window.Log = {};
    if (window.Log.Error) throw new Error('Name collision with Log package');

    const host = '//localhost:8081';

    const exports = err => {
        fetch(host + '/create/error', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(err)
        });
    };

    window.Log.Error = exports;

})()