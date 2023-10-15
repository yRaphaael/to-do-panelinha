const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Importe o módulo 'cors'

const uri = 'mongodb+srv://victorcode:Vrf0911!@jalacluster.weoaxor.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';
const client = new MongoClient(uri, { useNewUrlParser: true });

// Use o middleware 'cors' para permitir solicitações de origens diferentes
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/addTodo', async (req, res) => {
  try {
    const todo = req.body.todo;
    await client.connect();
    const collection = client.db("db_todolist").collection("tasks");
    const result = await collection.insertOne({ todo });
    res.status(200).json({ message: 'Tarefa adicionada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar a tarefa' });
  } finally {
    await client.close();
  }
});

app.get('/getTodos', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("db_todolist").collection("tasks");
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar as tarefas' });
  } finally {
    await client.close();
  }
});

app.delete('/deleteTodo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const collection = client.db("db_todolist").collection("tasks");
        const result = await collection.deleteOne({ _id: new ObjectID(id) });
        res.status(200).json({ message: 'Tarefa removida com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao remover a tarefa' });
    } finally {
        await client.close();
    }
});





app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
