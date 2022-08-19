const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const initializeMongoServer = async () => {
    const server = await MongoMemoryServer.create();
    const uri = server.getUri();

    const db = mongoose.connect(uri);

    mongoose.connection.on('error', (err) => {
        console.log(`Error connecting to database ${err}`);
    });

    mongoose.connection.once('open', () => {
        console.log('Successfully connected to local memory MongoDB instance')
    });

    return db;
};

module.exports = initializeMongoServer;
