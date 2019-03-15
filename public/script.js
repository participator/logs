(function(undefined) {

    if(window.Log) throw new Error('Name collision with Log package');

    const exports = {};
    window.Log = exports;

    window.onload = function() {
        const displayCurrentYear = Object.create(currentYear);
        displayCurrentYear.applyToPage('year');

        // Get data
        // fetchLogs('/log.json').then(data => {
        //     const displayLogsOnPage = Object.create(logsOnPage);
        //     displayLogsOnPage.getElement('app');
        //     displayLogsOnPage.displayLogs(data);            
        // });

        fetchLogs('//localhost:8081/read/all').then(data => {
        // fetchLogs('/read/log/5c82d61a95ba82107847d3ea').then(data => {
            console.table('[dbData]', data);
            const displayLogsOnPage = Object.create(logsOnPage);
            displayLogsOnPage.getElement('app');
            displayLogsOnPage.displayLogs(data); 
        })
    }

    // Fetch data from endpoint with search parameters
    const fetchLogs = (url, data) => fetch(url, {
        body: JSON.stringify(data)
    }).then(response => {
        // console.table(response);K
        return response.json();
    })

    // Display data
    const logsOnPage = {
        getElement(id) {
            if (!this.logsDomElement) {
                this.logsDomElement = document.getElementById(id);
                if (!this.logsDomElement) return new Error('Must supply a page element to display data on');
            }
        },
        displayLogs(logs) {
            const logsElement = createLogsElement(logs);
            this.logsDomElement.innerHTML = '';
            this.logsDomElement.appendChild(logsElement);
        }
    }

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
    }


    //--- Helper Methods ---//

    /**
     * Create the html element for log area
     * @param {Object[]} logs log data
     */
    const createLogsElement = (logs) => {
        const logsElement = document.createElement('ul');
        logsElement.classList.add('logs');

        if (!logs || logs.length === 0) return logsElement;

        logs.forEach(log => {
            const logElement = document.createElement('li');

            // Add title
            let title = document.createElement('h2');
            title.innerText = log.title;
            logElement.appendChild(title);

            // Add Helplful Resources
            if (log.helpfulResources && log.helpfulResources.length > 0) {
                logElement.appendChild(createHelpfulResourcesElement(log.helpfulResources));
            }

            // Add Last Modified
            const lastModified = document.createElement('p');
            lastModified.append('Last Modified ');
            const date = new Date(log.modifiedDate || log.createDate);
            lastModified.append(date.toLocaleDateString() || 'unset');
            logElement.appendChild(lastModified);

            // Add status
            const status = document.createElement('p');
            status.append('Status ');
            status.append(log.status);
            logElement.appendChild(status);

            // Add action buttons
            const actions = document.createElement('div');

            // Add update to actions
            const update = document.createElement('button');
            update.setAttribute('id', log.id);
            update.append('Update Log');
            actions.appendChild(update);
            
            // Add history to actions
            const history = document.createElement('button');
            history.setAttribute('id', log.id);
            history.append('See History');
            actions.appendChild(history);
            
            // Add See task to actions
            const tasks = document.createElement('button');
            tasks.setAttribute('id', log.id);
            tasks.append('See Tasks');
            actions.appendChild(tasks);

            // Append actions to logElement
            logElement.appendChild(actions);

            // Append to LogsElement
            logsElement.appendChild(logElement);
        });


        return logsElement;
    }

    /**
     * Creates the HTMLElements for the helpful resources section
     * @param {Object[]} helpfulResources - resources used to accomplish task
     * @returns {Object} helpfulResourcesElement - HTMLUListElement to add to DOM
     */
    const createHelpfulResourcesElement = helpfulResources => {
        const helpfulResourcesElement = document.createElement('ul');

        helpfulResources.forEach(helpfulResource => {
            helpfulResourcesElement.appendChild(createHelpfulResourceElement(helpfulResource));
        });

        return helpfulResourcesElement;
    };

    const createHelpfulResourceElement = helpfulResource => {        
        const element = document.createElement('li');
        
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
    }

    
    
})()