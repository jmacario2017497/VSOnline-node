const express = require('express');
const adminController = require('../controladores/ADMIN.controller');
const profesorController = require('../controladores/Profesor.controller');
const clienteController = require('../controladores/Usuario.controller')

const md_autentificacion = require('../middlewares/autentificacion');


var api = express.Router();

api.post('/login', adminController.Login); //
api.post('/registro', clienteController.registrarse); //

//ADMIN
api.get('/categorias', adminController.verCategorias);
api.get('/categoriaId/:idCategoria', md_autentificacion.Auth, adminController.CategoriaId);
api.post('/crearCategoria', md_autentificacion.Auth, adminController.crearCategoria);
api.put('/editarCategoria/:idCate', md_autentificacion.Auth, adminController.editarCategoria);
api.delete('/eliminarCategoria/:idCate', md_autentificacion.Auth, adminController.eliminarCategoria);
api.get('/idiomas', md_autentificacion.Auth, adminController.verIdiomas);
api.get('/idiomaId/:idIdioma', md_autentificacion.Auth, adminController.IdiomaId);
api.post('/crearIdioma', md_autentificacion.Auth, adminController.crearIdioma);
api.put('/editarIdiom/:idIdi', md_autentificacion.Auth, adminController.editarIdioma);
api.delete('/eliminarIdioma/:idIdi', md_autentificacion.Auth, adminController.eliminarIdioma);

api.put('/contratar/:idCliente', md_autentificacion.Auth, adminController.contratarProfesor);
api.put('/despedir/:idPro', md_autentificacion.Auth, adminController.despedirProfesor);

api.get('/usuarios', md_autentificacion.Auth, adminController.verUsuarios);
api.get('/profesores', adminController.verProfesores);
api.get('/profesoresNombre/:info', adminController.verProfesoresNombre);
api.get('/profesoresUsuario/:info', adminController.verProfesoresUsuario);



//PROFESOR
api.put('/renunciar/:idPro', md_autentificacion.Auth, profesorController.renunciar);
api.put('/editarCuenta/:idPro', md_autentificacion.Auth, profesorController.editarCuenta);
api.delete('/eliminarCuenta/:idPro', md_autentificacion.Auth, profesorController.eliminarCuenta);

api.get('/temas/:idPro', md_autentificacion.Auth, profesorController.verTemasPropios);
api.get('/pendientes/:idPro', profesorController.verReunionesPendientes);
api.get('/concluidas/:idPro', md_autentificacion.Auth, profesorController.verReunionesConcluidas);

api.post('/crearTema', md_autentificacion.Auth, profesorController.crearTema);
api.put('/editarTema/:idTe', md_autentificacion.Auth, profesorController.editarTema);
api.delete('/eliminarTema/:idTe', md_autentificacion.Auth, profesorController.eliminarTema);

api.put('/estadoReunion/:idReu', md_autentificacion.Auth, profesorController.estadoReunion);

//CLIENTE
api.put('/editarCuenta/:idPerfil', md_autentificacion.Auth, clienteController.editarCuenta);
api.delete('/eliminarCuenta/:idPerfil', md_autentificacion.Auth, clienteController.eliminarCuenta);

api.get('/temas',
    //md_autentificacion.Auth, 
    clienteController.verTemas);
api.get('/temasC/:categoria', clienteController.verTemasC);
api.post('/comprarReservar/:idUsua',
    //md_autentificacion.Auth,
    clienteController.ComprarTemaReservarReunion);
api.get('/temaId/:idTema', clienteController.TemaId)
api.put('/calificar/:idProfe', md_autentificacion.Auth, clienteController.calificarProfe);

api.get('/historial/:idCli',
    //md_autentificacion.Auth, 
    clienteController.historial);

module.exports = api;
