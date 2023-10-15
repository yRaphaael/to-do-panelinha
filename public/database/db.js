//Caso for utilizar o mongoose para desenvolver o projeto

/*const mongoose = require('mongoose');

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
 */


const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://victorcode:Vrf0911!@jalacluster.weoaxor.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'; // URL do servidor MongoDB

const connectToDb = () =>{
    const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Conexão bem-sucedida com o MongoDB');
  })
  .catch((error) => {
    console.error('Erro na conexão com o MongoDB:', error);
  });
}

module.exports = connectToDb;