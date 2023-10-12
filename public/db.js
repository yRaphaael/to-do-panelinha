const mongoose = require('mongoose');

const connectToDb = () => {
    mongoose.connect(
        "mongodb+srv://victorcode:Vrf0911!@jalacluster.weoaxor.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then(() => {
        console.log("mongodb atlas conectado!")
    }).catch((err) => console.log(err))
};

module.exports = connectToDb;