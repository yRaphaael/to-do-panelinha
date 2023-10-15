const express = require('express');
const app = express();
const path = require('path');

// Defina o diretório de arquivos estáticos (HTML, CSS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Inicie o servidor na porta desejada
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});