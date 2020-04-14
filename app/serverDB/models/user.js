const userModel = {
    firstName: "",
    middleInitial: "",
    lastName: "",
    username: "",
    createdDate: new Date(),
    connectedAccount: [],
    init(firstName, lastName, username) {
        this.createdDate = Date.now();
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;

        if (!this.firstName) throw new Error('firstName must be provided');
        if (!this.lastName) throw new Error('lastName must be provided');
        if (!this.username) throw new Error('username must be provided');
    }
};

module.exports = userModel;