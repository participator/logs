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
        error: new RegExp('^/creates/error$'),
        log: new RegExp('^/creates/log$'),
        logHistory: new RegExp(`^/creates/log/history$`),
        task: new RegExp(`^/creates/task$`),
        taskHistory: new RegExp(`^/creates/task/history$`),
        user: new RegExp(`^/creates/user$`)
    },
    reads: {
        error: new RegExp('^/reads/error$'),
        logs: new RegExp('^/reads/logs$'),
        task: new RegExp('^/reads/tasks$'),
        specific: new RegExp(`^/reads/log/${matchIdsString}$`),
        user: new RegExp(`^/reads/user/${matchIdsString}$`),
        userLogs: new RegExp(`^/reads/${matchIdsString}$`),
        userLog: new RegExp(`^/reads/${matchIdsString}/log/${matchIdsString}`)
    },
    updates: {
        error: new RegExp('^/updates/error$'),
        log: new RegExp(`^/updates/log$`),
        logHistory: new RegExp(`^/updates/log/history$`),
        task: new RegExp(`^/updates/task$`),
        taskHistory: new RegExp(`^/updates/task/history$`),
        user: new RegExp(`^/updates/user`)
    },
    deletes: {
        error: new RegExp('^/deletes/error$'),
        log: new RegExp(`^/deletes/log$`),
        logHistory: new RegExp(`^/deletes/log/history$`),
        task: new RegExp(`^/deletes/task$`),
        taskHistory: new RegExp(`^/deletes/task/history$`),
        user: new RegExp(`^/deletes/user$`)
    }

}

module.exports = {
    routes,
    matchIdsRegExpString
};