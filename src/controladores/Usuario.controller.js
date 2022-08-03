const Usuario = require('../modelos/usuarios.model');
const Tema = require('../modelos/temas.model')
const Reserva = require('../modelos/reunion_reservada.model');
const Compra = require('../modelos/compra_realizada.model');

const bcrypt = require('bcrypt-nodejs');

function registrarse(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuario();

    if (parametros.nombre && parametros.email && parametros.usuario && parametros.password) {

        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.apellido = parametros.apellido;
        usuarioModelo.rol = "Cliente";

        Usuario.find({ email: parametros.email }, (error, usuario1Encontrado) => {
            if (usuario1Encontrado.length == 0) {

                Usuario.find({ usuario: parametros.usuario }, (error, usuario2Encontrado) => {
                    if (usuario2Encontrado.length == 0) {

                        usuarioModelo.email = parametros.email;
                        usuarioModelo.usuario = parametros.usuario;

                        bcrypt.hash(parametros.password, null, null, (error, passwordEncriptada) => {
                            usuarioModelo.password = passwordEncriptada;

                            usuarioModelo.save((error, usuarioGuardado) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error, no se registro ningun Usuario" });

                                return res.status(200).send({ Usuario: usuarioGuardado, nota: "Usuario registrado exitosamente" });
                            });
                        });

                    } else {
                        return res.status(500).send({ mensaje: "Este usuario ya se encuentra utilizado" });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: "Este correo ya se encuentra utilizado" });
            }
        });
    }
}

function editarCuenta(req, res) {
    var idPerfil = req.params.idPerfil;
    var parametros = req.body;

    parametros.rol = "Cliente"

    Usuario.findByIdAndUpdate(idPerfil, parametros, { new: true }, (error, usuarioActualizado) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!usuarioActualizado) return res.status(500).send({ mensaje: "Error al editar el prefil" });

        usuarioActualizado.password = undefined;
        return res.status(200).send({ perfil: usuarioActualizado });
    });
}

function eliminarCuenta(req, res) {
    var idPerfil = req.params.idPerfil;

    Usuario.findByIdAndDelete(idPerfil, (error, usuarioEliminado) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!usuarioEliminado) return res.status(404).send({ mensaje: "Error al eliminar el perfil" });

        return res.status(200).send({ perfil: usuarioEliminado });
    });
}

////////////////////////////////////////////////////////////////

function verTemas(req, res) {
    Tema.find((error, temasEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!temasEn) return res.status(500).send({ mensaje: "No se encontro ningun Tema" });

        return res.status(200).send({ temas: temasEn });
    }).sort({ categoria: -1 })
}

function ComprarTemaReservarReunion(req, res) {
    var parametros = req.body;
    var fechaHoy = new Date("<YYYY-mm-dd>");
    var reservaModelo = new Reserva();
    var compraModelo = new Compra();

    if (parametros.idUsua && parametros.nombreTema)

        Usuario.findById(parametros.idUsua, (error, usuarioEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!usuarioEn) return res.status(500).send({ mensaje: "Error, no se encontro al cliente" });

            Tema.findOne({ nombreTema: parametros.nombreTema }, (error, temaEn) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                if (!temaEn) return res.status(500).send({ mensaje: "Error, no se encontro el tema" });

                if (parametros.tipoInformacion == "reunion") {
                    reservaModelo.nombreCliente = usuarioEn.nombre;
                    reservaModelo.usuarioCliente = usuarioEn.usuario;
                    reservaModelo.usuarioProfesor = temaEn.profesorSolicitado;
                    reservaModelo.tema = temaEn.nombreTema;
                    reservaModelo.fechaReunion = parametros.fecha;
                    reservaModelo.precio = temaEn.precio;
                    reservaModelo.estado = "Pendiente";

                    reservaModelo.save((err, reservaOK) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!reservaOK) return res.status(500).send({ mensaje: "Error, no se reservo ningun tema" });

                        return res.status(200).send({ reserva: reservaOK });
                    })

                } else {
                    compraModelo.nombreCliente = usuarioEn.nombre;
                    compraModelo.usuarioCliente = usuarioEn.usuario;
                    compraModelo.usuarioProfesor = temaEn.profesorSolicitado;
                    compraModelo.tema = temaEn.nombreTema;
                    compraModelo.tipo = temaEn.tipoInformacion;
                    compraModelo.fechaCompra = fechaHoy;
                    compraModelo.precio = temaEn.precio;

                    Usuario.findOneAndUpdate({ usuario: profeEn.profesorSolicitado }, { $inc: { ventasHechas: 1 } },
                        { new: true }, (error, ventaUp) => {
                            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                            if (!ventaUp) return res.status(500).send({ mensaje: "Error, no se aztulizo la compra" });

                            compraModelo.save((error, compraOK) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                if (!compraOK) return res.status(500).send({ mensaje: "Error, no se compro ningun tema" });

                                return res.status(200).send({ compra: compraOK });
                            })
                        })
                }
            })
        })
}

function calificarProfe(req, res) {
    var idProfe = req.params.idProfe;
    var infoEx = req.body;
    //infoEx/parametros: idUsuario, puntuacion

    Usuario.findById(idProfe, (error, profeEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profeEn) return res.status(500).send({ mensaje: "Error, no se encontro el profesor" });

        let reseñasTotal = 1;
        reseñasTotal += profeEn.reseñas.length;

        Usuario.findById(infoEx.idUsuario, (error, usuEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!usuEn) return res.status(500).send({ mensaje: "Error, no se encontro al usuario" });

            let sumatoria
            for (let b = 0; b < profeEn.reseñas.length; b++) {
                sumatoria += profeEn.reseñas[b].puntuacion
            }

            let opinado
            for (let p = 0; p < profeEn.reseñas.length; p++) {
                if (profeEn.reseñas[p].usuario == usuEn.usuario) {
                    opinado = true
                }
            }
            if (opinado == true) return res.status(500).send({ mensaje: "No puede reseñar más de una vez por Profesor" })

            Usuario.findByIdAndUpdate(idProfe, { $push: { reseñas: { usuario: usuEn.usuario, puntuacion: parametros.puntuacion } } },
                { new: true }, (error, añadirReseña) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!añadirReseña) return res.status(500).send({ mensaje: "Error, no se añadio la reseña" });

                    let cali = (sumatoria / reseñasTotal);

                    Usuario.findByIdAndUpdate(idProfe, { calificacion: cali }, { new: true }, (error, calificacionFinal) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!calificacionFinal) return res.status(500).send({ mensaje: "Error, no se añadio la reseña" });
                    })

                    return res.status(200).send({ calificacion: calificacionFinal });
                })
        })
    })
}

function historial(req, res) {
    idCli = req.params.idCli;

    Usuario.findById(idCli, (error, cliEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!cliEn) return res.status(500).send({ mensaje: "Error, no se encontrado al Cliente" });

        Compra.find({ usuarioCliente: cliEn.usuario }, (error, comprasEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!comprasEn) return res.status(500).send({ mensaje: "Error, no se encontradon Compras" });

            Reserva.find({ usuarioCliente: cliEn.usuario, estado: "Concluido" }, (error, reunionesEn) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                if (!reunionesEn) return res.status(500).send({ mensaje: "Error, no se encontradon Reuniones" });

                return res.status(200).send({ historial: comprasEn, reunionesEn });
            })
        })
    })
}

function verTemasC(req, res) {
    var categori = req.params.categoria;
    Tema.find({ categoria: categori }, (error, temasEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!temasEn) return res.status(500).send({ mensaje: "No se encontro ningun Tema de esta categoria" });

        return res.status(200).send({ temasC: temasEn });
    }).sort({ categoria: -1 })
}

function TemaId(req, res) {
    var idTema = req.params.idTema;

    Tema.findById(idTema, (error, temaEncontrado) => {
        if (error) return res.send({ mensaje: "error:" + error })

        return res.send({ tema: temaEncontrado })
    })
}


module.exports = {
    registrarse,
    editarCuenta,
    eliminarCuenta,
    verTemas,

    ComprarTemaReservarReunion,
    calificarProfe,
    historial,

    verTemasC,
    TemaId
}