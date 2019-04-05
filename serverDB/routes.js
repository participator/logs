/**
 * Regex string to match db object ids
 */
const matchIdsString = '([0-9a-z]{24})';

/**
 * Regexp string to match db object ids in url
 */
const matchIdsRegExpString = /[0-9a-z]{24}/g;

/**
 * Route parsers for each CRUD operation
 */
const routes = {
    /**
     * Create - new entry in database
     * _userId is passed in the body
     */
    creates: {
        error: new RegExp('^/create/error$'),
        log: new RegExp('^/create/log$'),
        logHistory: new RegExp(`^/create/log/history$`),
        task: new RegExp(`^/create/task$`),
        taskHistory: new RegExp(`^/create/task/history$`),
        user: new RegExp(`^/create/user$`)
    },
    reads: {
        all: new RegExp('^/read/all$'),
        specific: new RegExp(`^/read/log/${matchIdsString}$`),
        userAll: new RegExp(`^/read/${matchIdsString}$`),
        userSpecific: new RegExp(`^/read/${matchIdsString}/log/${matchIdsString}`)
    },
    updates: {
        log: new RegExp(`^/update/log$`),
        logHistory: new RegExp(`^/update/log/history$`),
        task: new RegExp(`^/update/task$`),
        taskHistory: new RegExp(`^/update/task/history$`),
        user: new RegExp(`^/update/user`)
    },
    deletes: {
        log: new RegExp(`^/delete/log$`),
        logHistory: new RegExp(`^/delete/log/history$`),
        task: new RegExp(`^/delete/task$`),
        taskHistory: new RegExp(`^/delete/task/history$`),
        user: new RegExp(`^/delete/user$`)
    }

}

module.exports = {
    routes,
    matchIdsRegExpString
};