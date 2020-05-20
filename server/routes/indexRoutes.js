const express = require('express');

const app = express();

app.use(require('./usuarioRoutes'))
app.use(require('./loginRoutes'))


module.exports = app;