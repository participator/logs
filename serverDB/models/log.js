/**
 * logModel - model for a log document
 */
const logModel = {
    _userId: null,
    title: "",
    description: "",
    status: "",
    type: "",
    createdDate: null,
    modifiedDate: null,
    helpfulResources: [],
    init(userId, title) {
        this._userId = userId;
        this.title = title;
        this.createdDate = this.createdDate || Date.now(); // TODO: possibly create this value in db with trigger

        if (!this._userId) throw new Error('userId must be provided');
        if (!this.title) throw new Error('title must be provided');
    }
};

module.exports = logModel;