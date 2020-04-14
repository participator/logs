const taskModel = {
    _logId: null,
    _userId: null,
    title: null,
    status: null,
    completedDate: null,
    createDate: null,
    modifiedDate: null,
    explanation: null,
    init(userId, logId, title) {
        this._logId = logId;
        this._userId = userId;
        this.createdDate = Date.now();
        this.title = title;

        if (!this._userId) throw new Error('userId must be provided');
        if (!this._logId) throw new Error('logId must be provided');
        if (!this.title) throw new Error('title must be provided');
    }
};

module.exports = taskModel;