const express = require('express');
const app = express();
const path = require('path');
let isLoggedIn = false;

app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        isLoggedIn = true;
        res.redirect('/');
    } else {
        res.send('Credenciais inválidas. <a href="/login">Tente novamente</a>');
    }
});

app.get('/', (req, res) => {
    if (isLoggedIn) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.redirect('/login');
    }
});

// Inicie o servidor na porta desejada
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});