// Requires
require('./config/config')
const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(require('./routes/usuarioRoutes'))

// Conectarnos a la base de datos
mongoose.connect(process.env.URLDB,
{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
,(err, res)=>{
    if(err){
        throw err;
    }
    console.log('Base de datos Online')
});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando el puerto 3000')
});