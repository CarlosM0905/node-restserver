const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoriaModel');

// ===================================================================
//	           Mostrar todas las categorias                                                    
// ===================================================================
app.get('/categoria', verificaToken,  (req, res)=>{

    Categoria.find({})
    .populate('usuario', 'nombre email')
    .sort('descripcion')
    .exec((err, categorias)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        Categoria.count({} , (err, conteo)=>{
            res.json({
                ok: true,
                categorias,
                conteo
            })
        })
    });
});

// ===================================================================
//	           Mostrar una categoria por id                                              
// ===================================================================
app.get('/categoria/:id', (req, res)=>{
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID es incorrecto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// ===================================================================
//	           Crear una nueva categoria                                                    
// ===================================================================
app.post('/categoria', verificaToken,  (req, res)=>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ===================================================================
//	           Actualizar una categoria por id                                                    
// ===================================================================
app.put('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = {descripcion: req.body.descripcion};

    Categoria.findByIdAndUpdate(id, body , {new: true, runValidators:true}, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(202).json({
            ok: true,
            categoria: categoriaDB
        });
    });
})

// ===================================================================
//	           Borrar una categoria por id                                                   
// ===================================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })

    })
})

module.exports = app;