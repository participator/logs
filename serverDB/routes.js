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
    create: {
        log: new RegExp('^/create/log$'),
        task: new RegExp(`^/create/task$`),
        logHistory: new RegExp(`^/create/log/history$`),
        taskHistory: new RegExp(`^/create/task/history$`)
    },
    read: {
        all: new RegExp('^/read/all$'),
        specific: new RegExp(`^/read/log/${matchIdsString}$`),
        userAll: new RegExp(`^/read/${matchIdsString}$`),
        userSpecific: new RegExp(`^/read/${matchIdsString}/log/${matchIdsString}`)
    },
    update: {
        log: new RegExp('^/update/log$'),
        task: new RegExp(`^/update/task$`),
        logHistory: new RegExp(`^/update/log/history$`),
        taskHistory: new RegExp(`^/update/task/history$`)
    },
    delete: {
        log: new RegExp('^/delete/log$'),
        task: new RegExp(`^/delete/task$`),
        logHistory: new RegExp(`^/delete/log/history$`),
        taskHistory: new RegExp(`^/delete/task/history$`)
    }

}

module.exports = {
    routes,
    matchIdsRegExpString
};