const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/productoModel');

// ===================================================================
//	           Obtener todos los productos                                                    
// ===================================================================
app.get('/productos', verificaToken, (req,res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productos
        })
    })

});

// ===================================================================
//	           Obtener un producto por ID                                                    
// ===================================================================
app.get('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto con ese ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

// ===================================================================
//	           Buscar productos                                                    
// ===================================================================
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex, disponible: true})
    .populate('categoria', 'descripcion')
    .exec((err, productos)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        })
    })
});

// ===================================================================
//	           Crear un nuevo producto                                                    
// ===================================================================
app.post('/productos', verificaToken, (req, res)=>{
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

})

// ===================================================================
//	           Actualizar un nuevo producto                                                    
// ===================================================================
app.put('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;


    let productoAct = {
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, productoAct, {new: true, runValidators: true}, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto con ese ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===================================================================
//	           Borrar un producto                                                    
// ===================================================================
app.delete('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    
    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto con ese ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    })
})


module.exports = app;
