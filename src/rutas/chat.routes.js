const express = require('express');

const chatController = require('../controladores/mensajes.controller');
const md_autentificacion = require('../middlewares/autentificacion');
var api = express.Router();

//Chat general
api.get('/obtnerMensajes', md_autentificacion.Auth, chatController.getMesajes);
api.post('/enviarMensajes', md_autentificacion.Auth, chatController.mandarMenssaje);

module.exports = api;
