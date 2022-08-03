const Usuario = require('../modelos/usuarios.model');
const Tema = require('../modelos/temas.model')
const Reunion_Reservada = require('../modelos/reunion_reservada.model');


function renunciar(req, res) {
    idPro = req.params.idPro;
    let info = Usuario;

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) res.status(500).send({ error: "error en la petición" });
        if (!profeEn) res.status(500).send({ error: "No existe este Profesor" })

        info.rol = "Cliente";
        info.calificacion = null;
        info.ventasHechas = null;
        info.clasesImpartidas = null;

        Usuario.findByIdAndUpdate(idPro, info, { new: true }, (error, profeUp) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!profeUp) return res.status(500).send({ mensaje: "Error al renunciar" });

            return res.status(200).send({ cliente: profeUp });
        })

    })
}

function editarCuenta(req, res) {
    var idPro = req.params.idPro;
    var parametros = req.body;

    Usuario.findById(idPro, (error, cliEn) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!cliEn) return res.status(500).send({ mensaje: "Error al encontrar al Profesor" });

        parametros.rol = "Profesor";
        parametros.calificacion = cliEn.calificacion;
        parametros.ventasHechas = cliEn.ventasHechas;
        parametros.clasesImpartidas = cliEn.clasesImpartidas;

        Usuario.findByIdAndUpdate(idPro, parametros, { new: true }, (error, usuarioActualizado) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!usuarioActualizado) return res.status(500).send({ mensaje: "Error al editar el Profesor" });

            usuarioActualizado.password = undefined;
            return res.status(200).send({ profesor: usuarioActualizado });
        });
    });
}

function eliminarCuenta(req, res) {
    var idPro = req.params.idPro;

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profeEn) return res.status(404).send({ mensaje: "Error al buscar al profe" });

        Usuario.findByIdAndDelete(idPro, (error, usuarioEliminado) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!usuarioEliminado) return res.status(404).send({ mensaje: "Error al eliminar la cuenta" });

            Tema.deleteMany({ profesorSolicitado: profeEn.usuario }, (error) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                Reunion_Reservada.updateMany({ estado: "Pendiente" }, { estado: "Cancelado" }, (error) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                    return res.status(200).send({ profesor: usuarioEliminado });
                })
            })
        })
    })
}

function verTemasPropios(req, res) {
    var idPro = req.params.idPro;

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profeEn) return res.status(500).send({ mensaje: "No se encontro este Profesor" });

        Tema.find({ profesorSolicitado: profeEn.usuario }, (error, temasPropiosEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!temasPropiosEn) return res.status(500).send({ mensaje: "No se encontraron temas de este profesor" });

            return res.status(200).send({ temas: temasPropiosEn });
        })
    })
}

////////////////////////////////

function verReunionesPendientes(req, res) {
    var idPro = req.params.idPro;

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profeEn) return res.status(500).send({ mensaje: "No se encontro este Profesor" });

        Reunion_Reservada.find({ usuarioProfesor: profeEn.usuario, estado: "Pendiente" }, (error, reuniPenEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!reuniPenEn) return res.status(500).send({ mensaje: "No se encontraron temas de este profesor" });

            return res.status(200).send({ reuniones1: reuniPenEn });
        })
    })
}

function verReunionesConcluidas(req, res) {
    var idPro = req.params.idPro;

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profeEn) return res.status(500).send({ mensaje: "No se encontro este Profesor" });

        Reunion_Reservada.find({ usuarioProfesor: profeEn.usuario, estado: "Concluido" }, (error, reuniConEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!reuniConEn) return res.status(500).send({ mensaje: "No se encontraron temas de este profesor" });

            return res.status(200).send({ reuniones2: reuniConEn });
        })
    })
}
////////////////////////////////

function crearTema(req, res) {
    var parametros = req.body;
    var temaModelo = new Tema();

    if (parametros.usuario)

        Usuario.findOne({ usuario: parametros.usuario }, (profesorEn) => {
            if (!profesorEn) return res.status(500).send({ mensaje: "No existe el profesor" });

            Tema.findOne({ nombreTema: parametros.nombreTema, profesorSolicitado: profesorEn.usuario }, (error, temeEn) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                if (temeEn) return res.status(500).send({ mensaje: "No se puede volver a agregar el mismo exacto tema" });

                temaModelo.nombreTema = parametros.nombreTema;
                temaModelo.profesorSolicitado = parametros.usuario;
                temaModelo.categoria = parametros.categoria;
                temaModelo.idioma = parametros.idioma;
                temaModelo.tipoInformacion = parametros.tipoInformacion;
                temaModelo.precio = parametros.precio;

                temaModelo.save((error, temaGuardado) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!temaGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun tema" });

                    return res.status(200).send({ tema: temaGuardado });
                });
            })
        })
}

function editarTema(req, res) {
    var idTe = req.params.idTe;
    var parametros = req.body;

    //TIPO_INFORMACION => NO
    //PROFESOR_SOLICITADO => NO

    Tema.findByIdAndUpdate(idTe, parametros, { new: true }, (error, temaActualizado) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!temaActualizado) return res.status(500).send({ mensaje: "Error al editar el Tema" });

        return res.status(200).send({ tema: temaActualizado });
    });
}

function eliminarTema(req, res) {
    var idTe = req.params.idTe;

    Tema.findByIdAndDelete(idTe, (error, temaEliminado) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!temaEliminado) return res.status(404).send({ mensaje: "Error al eliminar el tema" });

        return res.status(200).send({ tema: temaEliminado });
    })
}

////////////////////////////////

function estadoReunion(req, res) {
    var idReu = req.params.idReu;
    var confirmacion = req.body;

    Reunion_Reservada.findById(idReu, (error, reunionEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!reunionEn) return res.status(500).send({ mensaje: "Error, no se encontro la reunion" });

        Usuario.findOne({ usuario: reunionEn.usuarioProfesor }, (error, profeEn) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (!profeEn) return res.status(500).send({ mensaje: "Error, no se encontro al profe" });

            if (confirmacion.estado == "Concluido") {
                Reunion_Reservada.findByIdAndUpdate(idReu, { estado: confirmacion.estado }, { new: true }, (error, estadoAct) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!estadoAct) return res.status(500).send({ mensaje: "Error, no se concluyo el estado" });

                    Usuario.findByIdAndUpdate(profeEn._id, { $inc: { clasesImpartidas: 1 } }, { new: true }, (error, ventasUp) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!ventasUp) return res.status(500).send({ mensaje: "Error, no se aumentaron las ventas" });


                        return res.status(200).send({ estado: estadoAct });
                    })
                })

            } else if (confirmacion.estado == "Cancelado") {
                Reunion_Reservada.findByIdAndUpdate(idReu, { estado: confirmacion.estado }, { new: true }, (error, estadoAct) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!estadoAct) return res.status(500).send({ mensaje: "Error, no se cancelo el estado" });

                    return res.status(200).send({ estado: estadoAct });
                })
            }
        })
    })
}


module.exports = {
    renunciar,
    editarCuenta,
    eliminarCuenta,
    verTemasPropios,
    verReunionesPendientes,
    verReunionesConcluidas,
    crearTema,
    editarTema,
    eliminarTema,
    estadoReunion
}