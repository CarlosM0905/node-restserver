// Requires
require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion global de rutas 
app.use(require('./routes/indexRoutes'))

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