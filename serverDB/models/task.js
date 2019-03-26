const taskModel = {
    _logId: undefined,
    _userId: undefined,
    title: undefined,
    status: undefined,
    completedDate: undefined,
    createDate: undefined,
    modifiedDate: undefined,
    explanation: undefined,
    init(userId, logId, title) {
        this._logId = logId;
        this._userId = userId;
        this.createdDate = Date.now();
        this.title = title;

        if (!this._userId) throw new Error('userId must be provided');
        if (!this._logId) throw new Error('logId must be provided');
        if (!this.title) throw new Error('ritle must be provided');
    }
};

module.exports = taskModel;