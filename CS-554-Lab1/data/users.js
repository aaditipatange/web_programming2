const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

let exportedMethods = {
async getAllUsers() {
    const collectionOfUsers = await users();
    const allUsers = await collectionOfUsers.find({}).toArray();
    for (let user of allUsers) {
        user._id = user._id.toString();
    }
    return allUsers;
},

async createUser(name, username, password) {
    if (!name || typeof name !== 'string' || name.trim().length === 0 ) {
        throw 'Name given is invalid';
    }
    name = name.trim();
    for (let i = 0; i < name.length; i++) {
      const element = name[i];
      if (!element.match(/([a-zA-Z])/)) {
        throw "only characters allowed for name";
      }
    }
    if (!username || typeof username !== 'string' || username.trim().length === 0 ) {
        throw 'Please provide username';
    }
    username = username.trim().toLowerCase();
    if (username.length < 4)
        throw 'username should be at least 4 characters long';

    for (let i = 0; i < username.length; i++) {
        const element = username[i];
        if (/\s+/g.test(element)) throw 'spaces not allowed in username';
        if (!element.match(/([a-z0-9])/))
            throw 'only alphanumeric characters allowed for username';
    }
    //For Password
    if (!password || typeof password !== 'string' || password.trim().length === 0
    ) {
        throw 'Please provide password';
    }
    if (password.length < 6)
        throw 'password should be at least 6 characters long';

    for (let i = 0; i < password.length; i++) {
        const element = password[i];
        if (/\s+/g.test(element)) throw 'spaces not allowed in password';
    }

    //Insert data into Database
    const collectionOfUsers = await users();

    const allUsers = await this.getAllUsers();
    allUsers.forEach((user) => {
        if (user.username == username) throw 'This username is already taken.';
    });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let userDetails = {
        name: name,
        username: username,
        password: hashedPassword,
    };

    const userInserted = await collectionOfUsers.insertOne(userDetails);

    if (userInserted.insertedCount === 0) {
        throw 'User could not be added';
    }
    const user = await this.getUser(username);

    return user;
},

async checkUser(username, password) {
    // Error handling for username
    if (!username || typeof username !== 'string' || username.trim().length === 0)
        throw 'Please provide username';

    username = username.trim().toLowerCase();
    if (username.length < 4)
        throw 'username should be at least 4 characters long';

    for (let i = 0; i < username.length; i++) {
        const element = username[i];
        if (/\s+/g.test(element)) throw 'spaces not allowed in username';
        if (!element.match(/([a-z0-9])/))
            throw 'only alphanumeric characters allowed';
    }

    // Error handling for password
    if ( !password || typeof password !== 'string' || password.trim().length === 0
    )
        throw 'Please provide password';

    if (password.length < 6)
        throw 'password should be at least 6 characters long';

    for (let i = 0; i < password.length; i++) {
        const element = password[i];
        if (/\s+/g.test(element)) throw 'spaces not allowed in password';
    }

    const collectionOfUsers = await users();
    const oldUsers = await collectionOfUsers.findOne({ username: username });
    if (oldUsers === null) throw 'Either the username or password is invalid';
    let compareToMatch = false;

    //try {
        compareToMatch = await bcrypt.compare(password, oldUsers.password);
    // } catch (e) {
    //     //no op
    // }

    if (compareToMatch) {
        return oldUsers;
    } else {
        throw 'Either the username or password is invalid';
    }
},

async getUser(username) {
    if ( !username || typeof username !== 'string' || username.trim().length === 0)
        throw 'Please provide username';

    username = username.trim().toLowerCase();
    if (username.length < 4)
        throw 'username should be at least 4 characters long';

    for (let i = 0; i < username.length; i++) {
        const element = username[i];
        if (/\s+/g.test(element)) throw 'spaces not allowed in username';
        if (!element.match(/([a-z0-9])/))
            throw 'only alphanumeric characters allowed';
    }
    const collectionOfUsers = await users();
    const user = await collectionOfUsers.findOne({ username: username });
    user._id = user._id.toString();
    return user;
},
};

module.exports = exportedMethods;