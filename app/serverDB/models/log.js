
/**
 * logModel - model for a log document
 */
const logModel = {
    _userId: null,
    title: "",
    description: "",
    status: "",
    type: "",
    helpfulResources: [],
    init(userId, title) {
        this._userId = userId;
        this.title = title;

        if (!this._userId) throw new Error('userId must be provided');
        if (!this.title) throw new Error('title must be provided');
    }
};

module.exports = logModel;