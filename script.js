(function(undefined) {

    if(window.Log) throw new Error('Name collision with Log package');

    const exports = {};
    window.log = exports;

    window.onload = function() {
        const displayCurrentYear = Object.create(currentYear);
        displayCurrentYear.applyToPage('year');
    }

    // Fetch data from endpoint with search parameters

    // Display data
    const displayOnPage = {
        getElement(id) {
            if (!this.logsElement) {
                this.logsElement = document.getElementById(id);
                if (!this.logsElement) return new Error('Must supply a page element to display data on');
            }
        },
        displayData(id) {

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

        logs.forEach(log => {
            const logElement = document.createElement('li');

            // Add ShortDescription
            let p = document.createElement('p');
            p.innerText = log.shortDescription;
            logElement.appendChild(p);

            // Add Helplful Resources
            if (logs.helpfulResources.length > 0) {
                logElement.appendChild(createHelpfulResourcesElement(logs.helpfulResources));
            }

            // Add Last Modified
            const lastModified = document.createElement('p');
            lastModified.append('Last Modified ');
            lastModified.append(log.modifiedDate || log.createDate || 'unset');
            logElement.appendChild(lastModified);

            // Add status
            const status = document.createElement('p');
            status.append('Status ');
            status.append(log.status);
            logElement.appendChild(status);

            // Add edit
            const edit = document.createElement('button');
            edit.setAttribute('id', log.id);
            edit.append('Edit Log');
            logElement.appendChild(edit);

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