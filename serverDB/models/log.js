/**
 * logModel - model for a log document
 */
const logModel = {
    _userId: undefined,
    title: "",
    description: "",
    status: "",
    type: "",
    createdDate: undefined,
    modifiedDate: undefined,
    helpfulResources: [],
    init(userId, title) {
        this._userId = userId;
        this.title = title;
        this.createdDate = this.createdDate || Date.now(); // TODO: possibly create this value in db with trigger

        if (!this._userId) throw new Error('userId must be provided');
        if (!this.title) throw new Error('ritle must be provided');
    }
};

module.exports = logModel;