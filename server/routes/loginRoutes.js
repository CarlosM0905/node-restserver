// Requires
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Requires Google SignIn
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// Models
const Usuario = require('../models/usuarioModel')

const app = express();

//===============================
// Login Normal
//===============================

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'USUARIO o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o CONTRASEÑA incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

//================================
// Login Google
//================================

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
    .catch(err => {
        res.status(403).json({
            ok: true,
            err
        })
    });

    Usuario.findOne({email: googleUser.email} , (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( usuarioDB) {
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                })
            }
            else{
                let token = jwt.sign({
                    usuario: usuarioDB,
                    
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }
        else{
            // Si el usuario no existe en nuestra base de datos
            // Creamos el objeto del usuario
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':(';


            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                // Creamos un token
                let token = jwt.sign({
                    usuario: usuarioDB,
                    
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
                // Retornamos el usuario creado asi como el token
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }

    });

    // res.json({
    //     usuario: googleUser
    // })
})

module.exports = app;