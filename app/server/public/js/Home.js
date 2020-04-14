(function(undefined) {

    if (!window.Log) window.Log = {};
    if (!window.Log.Shared) throw new Error('App Shared library is not loaded');    
    if (window.Log.Home) throw new Error('Name collision with Log\'s Home package');
    
    const exports = {};
    window.Log.Home = exports;

    const Shared = window.Log.Shared;

    window.onload = function() {
        // Get Logs
        const displayCurrentYear = Object.create(Shared.CurrentYear);
        displayCurrentYear.applyToPage('#year');
    };

})()