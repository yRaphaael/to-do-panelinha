const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Importe o módulo 'cors'
const { db } = require("../database/db");


// Use o middleware 'cors' para permitir solicitações de origens diferentes
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.post('/addTodo', async (req, res) => {
  try {
    const todo = req.body.todo;
    const collection = db.collection("tasks");
    const result = await collection.insertOne({ todo });
    res.status(200).json({ message: 'Tarefa adicionada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar a tarefa' });
  }
});

app.get('/getTodos', async (req, res) => {
  try {
    const collection = db.collection("tasks");
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar as tarefas' });
  }
});

app.delete('/delete-todo/:id', async (req, res) => {
  const todoId = req.params.id;
  console.log("ID da tarefa a ser excluída:", todoId);

  try {
    const collection = db.collection("tasks");
    const result = await collection.deleteOne({ _id: new ObjectId(todoId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Tarefa removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover a tarefa' });
  }
});


app.put('/addTodo/:id', async (req, res) => {
  const todoId = req.params.id;
  console.log("ID da tarefa a ser excluída:", todoId);
  const todo = req.body.todo;
  try {
    const collection = db.collection("tasks");
    const result = await collection.updateOne({ _id: new ObjectId(todoId) }, {
      $set: {
        todo
      }
    });

    console.log(result)
if (result.modifiedCount === 1) {
  res.status(200).json({ message: 'Tarefa removida com sucesso' });
} else {
  res.status(404).json({ error: 'Tarefa não encontrada' });
}
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Erro ao remover a tarefa' });
}
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
