const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(bodyParser.json());

app.get('/teste', (req, res) => {
  res.status(200)
  .send({ mensagem: 'boas vindas à API' });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

module.exports = app;
