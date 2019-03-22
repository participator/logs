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
        user: new RegExp(`^/create/user$`),
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
        log: new RegExp(`^/update/${matchIdsString}/log/${matchIdsString}$`),
        task: new RegExp(`^/update/${matchIdsString}/task/${matchIdsString}$`),
        user: new RegExp(`^/update/${matchIdsString}`),
        logHistory: new RegExp(`^/update/${matchIdsString}/log/${matchIdsString}/history$`),
        taskHistory: new RegExp(`^/update/${matchIdsString}/task/${matchIdsString}/history$`)
    },
    delete: {
        log: new RegExp(`^/delete/log/${matchIdsString}$`),
        task: new RegExp(`^/delete/task/${matchIdsString}$`),
        user: new RegExp(`^/delete/${matchIdsString}$`),
        logHistory: new RegExp(`^/delete/log/history/${matchIdsString}$`),
        taskHistory: new RegExp(`^/delete/task/history/${matchIdsString}$`)
    }

}

module.exports = {
    routes,
    matchIdsRegExpString
};