(function(undefined) {

    if (!window.Log) window.Log = {};
    if (window.Log.App) throw new Error('Name collision with Log\'s App package');
    
    const exports = {};
    window.Log.App = exports;

    const LogError = window.Log.Error;

    window.onload = function() {
        // TODO: Get User Id
        // TODO: Store on Log

        // Get Logs
        const displayCurrentYear = Object.create(currentYear);
        displayCurrentYear.applyToPage('year');

        // TEST ONLY: Get data from local computer
        // fetchLogs('/log.json').then(data => {
        //     const displayLogsOnPage = Object.create(logsOnPage);
        //     displayLogsOnPage.getElement('app');
        //     displayLogsOnPage.displayLogs(data);            
        // });

        const host = '//localhost:8081';
        fetchLogs(host + '/reads/logs').then(data => {
        // fetchLogs('/read/log/5c82d61a95ba82107847d3ea').then(data => {
            console.table('[dbData]', data);
            const displayLogsOnPage = Object.create(logsOnPage);
            displayLogsOnPage.getElement('app_data');
            displayLogsOnPage.displayLogs(data);
        })
        .catch(() => {
            const app = document.getElementById('app');
            app.innerHTML = 'Unable to load data';
        });
    };

    // Fetch data from endpoint with search parameters
    /**
     * 
     * @param {string} url - url string to resource
     * @param {Object} data - Request data
     */
    const fetchLogs = (url, data) => fetch(url, {
        body: JSON.stringify(data)
    }).then(response => {
        return response.json();
    }).catch(err => {
        // LogError(err);
        throw err;
    });

    // Display data
    const logsOnPage = {
        /**
         * Grabs DOM element to display log data in
         * @param {string} className - element className
         */
        getElement(className) {
            if (!this.logsDomElement) {
                this.logsDomElement = document.querySelector('.' + className);
                if (!this.logsDomElement) return new Error('Must supply a page element to display data on');
            }
        },
        /**
         * Display log data inside DOM element
         * @param {Object} - JSON data of logs
         */
        displayLogs(logs) {
            window.Log.userId = logs[0]._userId; // Temporary fix until user is know from signin
            const logsElement = createLogsElement(logs);
            this.logsDomElement.innerHTML = '';
            this.logsDomElement.appendChild(logsElement);
        }
    };

    // Current Year
    const currentYear = {
        getYear() {
            if (!this.year) {
                this.year = new Date().getFullYear();
            }
            return this.year;
        },
        applyToPage(id) {
            document.getElementById(id).innerText = this.getYear();
        }
    };


    //--- Helper Methods ---//

    /**
     * Create the html element for log area
     * @param {Object[]} logs log data
     */
    const createLogsElement = (logs) => {
        const logsElement = document.createElement('ul');
        logsElement.classList.add('logs');

        if (!logs || logs.length === 0) return logsElement;

        const logElements = logs.map(log => {
            return exports.createLogElement(log);
        });
        
        // Append to LogsElement
        logElements.forEach(logElement => logsElement.insertBefore(logElement, logsElement.children[0]));

        return logsElement;
    };

    /**
     * Create the HTMLLIElement for a log
     * @param {Object} log data
     * @retuns HTMLLIElement
     */
    exports.createLogElement = log => {

        const logElement = document.createElement('li');
        logElement.dataset.id = log._id;

        // Delete Actions
        let deleteElement = document.createElement('button');
        deleteElement.dataset.id = log._id;
        deleteElement.innerText = 'X';
        deleteElement.classList.add('log_delete');
        deleteElement.addEventListener('click', event => {
            exports.Delete.deleteLog(event.target.dataset.id);
        });
        logElement.appendChild(deleteElement);

        // Add title
        let title = document.createElement('h2');
        title.innerText = log.title;
        title.dataset.name = 'title';
        logElement.appendChild(title);

        let description = document.createElement('p');
        description.innerText = log.description;
        description.dataset.name = 'description';
        logElement.appendChild(description);

        // Add Helplful Resources
        if (log.helpfulResources && log.helpfulResources.length > 0) {
            logElement.appendChild(createHelpfulResourcesElement(log.helpfulResources));
        }

        // Add Last Modified
        const lastModified = document.createElement('p');
        lastModified.append('Last Modified ');
        const date = new Date(log.modifiedDate || log.createdDate);
        lastModified.append(date.toLocaleDateString() || 'unset');
        logElement.appendChild(lastModified);

        // Add status
        const status = document.createElement('p');
        status.append('Status ');
        const statusValue = document.createElement('span');
        statusValue.append(log.status);
        statusValue.dataset.name = 'status';
        status.append(statusValue);
        logElement.appendChild(status);

        // Add type
        const type = document.createElement('span');
        type.classList.add('log_type');
        type.append(log.type);
        logElement.appendChild(type);

        // Add action buttons
        const actions = document.createElement('div');
        actions.classList.add('log_actions');

        // Add update to actions
        const update = document.createElement('button');
        update.dataset.id = log._id;
        update.append('Update Log');
        update.addEventListener('click', event => {
            const Update = window.Log.App.Update;
            const target = event.target;
            Update.createUpdateForm(target.dataset.id);
        });
        actions.appendChild(update);

        // Add history to actions
        const history = document.createElement('button');
        history.dataset.id = log._id;
        history.append('See History');
        actions.appendChild(history);

        // Add See task to actions
        const tasks = document.createElement('button');
        tasks.dataset.id = log._id;
        tasks.append('See Tasks');
        actions.appendChild(tasks);
        
        // Append actions to logElement
        logElement.appendChild(actions);

        return logElement;
    };

    /**
     * Creates the HTMLElements for the helpful resources section
     * @param {Object[]} helpfulResources - resources used to accomplish task
     * @returns {Object} helpfulResourcesElement - HTMLUListElement to add to DOM
     */
    const createHelpfulResourcesElement = helpfulResources => {
        const helpfulResourcesElement = document.createElement('ul');
        helpfulResourcesElement.classList.add('log_helpfulResources');

        helpfulResources.forEach(helpfulResource => {
            helpfulResourcesElement.appendChild(createHelpfulResourceElement(helpfulResource));
        });

        return helpfulResourcesElement;
    };

    const createHelpfulResourceElement = helpfulResource => {
        const element = document.createElement('li');
        element.classList.add('log_helpfulResource');
        
        const link = document.createElement('a');
        link.href = helpfulResource.url;
        link.rel = 'external';
        link.target = '_blank';
        link.append(helpfulResource.name);
        element.appendChild(link);

        const usefulness = document.createElement('p');
        usefulness.append(helpfulResource.usefulness);
        link.appendChild(usefulness);
        element.appendChild(usefulness);
        
        return element;
    };
})()