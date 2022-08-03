const Usuario = require('../modelos/usuarios.model');
const Tema = require('../modelos/temas.model');
const Idioma = require("../modelos/idiomas.model");
const Categoria = require("../modelos/categorias.model");

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt.tokens');

////////////////////////////////////////////////////////////////
// UNIVERSAL
////////////////////////////////////////////////////////////////
function Login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ usuario: parametros.usuario }, (error, usuarioEncontrado) => {
        if (error) return res.status(500).send({ mensaje: "Error en la petición" });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password, (error, verificacionPassword) => {

                if (verificacionPassword) {

                    if (parametros.Token === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }
                } else {
                    return res.status(500).send({ mensaje: "algo no cuadra" })

                }
            })

        } else {
            return res.status(500).send({ mensaje: "Error, este usuario no se encuentra registrado" })
        }
    })
}


function Admin() {
    var adminModelo = new Usuario();
    adminModelo.email = "nintendo@gmail.com";
    adminModelo.usuario = "Masterchief";
    adminModelo.rol = "Admin";

    Usuario.find({ rol: adminModelo.rol }, (error, adminEncontrado) => {
        if (adminEncontrado.length == 0)

            bcrypt.hash('kratos', null, null, (error, passwordEncriptada) => {
                adminModelo.password = passwordEncriptada;

                adminModelo.save((error, adminGuardado) => {
                });
            });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////
function verCategorias(req, res) {
    Categoria.find((error, categoriasEncontradas) => {
        if (error) return res.send({ mensaje: "error:" + error })

        return res.send({ categorias: categoriasEncontradas })
    })
}

function CategoriaId(req, res) {
    var idCategoria = req.params.idCategoria;

    Categoria.findById(idCategoria, (error, categoriaEncontrada) => {
        if (error) return res.send({ mensaje: "error:" + error })

        return res.send({ categoria: categoriaEncontrada })
    })
}

function crearCategoria(req, res) {
    var parametros = req.body;
    var categoriaModelo = new Categoria();

    if (parametros.nombreCategoria) {

        Categoria.findOne({ nombreCategoria: parametros.nombreCategoria }, (error, categoriaBuscada) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (categoriaBuscada) return res.status(500).send({ mensaje: "No se puede volver a agregar la misma categoria" });

            categoriaModelo.nombreCategoria = parametros.nombreCategoria;

            categoriaModelo.save((error, categoriaGuardada) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                if (!categoriaGuardada) return res.status(500).send({ mensaje: "Error, no se agrego ninguna categoria" });

                return res.status(200).send({
                    categoria: categoriaGuardada, nota: "Categoria agregada exitosamente"
                });
            });
        })
    } else {
        return res.status(500).send({ mensaje: "Envie los parametros obligatorios" });
    }
}

function editarCategoria(req, res) {
    var idCate = req.params.idCate;
    var parametros = req.body;

    Categoria.findById(idCate, (error, categoriaEncontrada) => {
        if (categoriaEncontrada) {

            Categoria.findByIdAndUpdate(idCate, parametros, { new: true }, (error, categoriaActualizada) => {
                if (error) return res.status(500).send({ mesaje: "Error de la petición" });
                if (!categoriaActualizada) return res.status(500).send({ mensaje: "Error al editar la categoria" });

                Tema.updateMany({ categoria: categoriaEncontrada.nombreCategoria },
                    { categoria: parametros.nombreCategoria }, (error, updateCategoria) => {
                        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
                        if (!updateCategoria) return res.status(500).send({ mensaje: "Error al actualizar la categoria de Temas" });

                        return res.status(200).send({
                            categoria: categoriaActualizada, nota: "Categoria actualizada exitosamente"
                        });
                    })
            });

        } else {
            return res.status(500).send({ mensaje: "No existe esta categoria" });
        }
    });
}

function eliminarCategoria(req, res) {
    var idCate = req.params.idCate;

    Categoria.findById(idCate, (error, categoriaEncontrada) => {
        if (categoriaEncontrada) {

            Categoria.findOne({ nombreCategoria: "Sin Categoria" }, (error, PorDefectoEncontrado) => {
                if (error) return res.status(500).send({ mesaje: "Error de la petición" });

                if (!PorDefectoEncontrado) {
                    const modeloCategoria = new Categorias();
                    modeloCategoria.nombreCategoria = "Sin Categoria";

                    modeloCategoria.save((error, categoriaDefectoGuardada) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!categoriaDefectoGuardada) return res.status(500).send({ mensaje: "Error, no se agrego la categoria Por Defecto" });

                        Tema.updateMany({ categoria: categoriaEncontrada.nombreCategoria },
                            { categoria: categoriaDefectoGuardada.nombreCategoria }, (error) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                                Categoria.findByIdAndDelete(idCate, (error, categoriaEliminada) => {
                                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                    if (!categoriaEliminada) return res.status(404).send({ mensaje: "Error al eliminar la Categoria" });

                                    return res.status(200).send({ categoria: categoriaEliminada })
                                })

                            })
                    })
                } else {
                    Tema.updateMany({ categoria: categoriaEncontrada.nombreCategoria },
                        { categoria: PorDefectoEncontrado.nombreCategoria }, (error) => {
                            if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                            Categoria.findByIdAndDelete(idCate, (error, categoriaEliminada) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                if (!categoriaEliminada) return res.status(404).send({ mensaje: "Error al eliminar la categoria" });

                                return res.status(200).send({
                                    categoria: categoriaEliminada, nota: "Eliminada con exito"
                                });
                            });
                        });
                }
            });
        } else {
            return res.status(500).send({ mensaje: "No existe esta categoria" });
        }

    });
}
/////////////////////////////////////
function verIdiomas(req, res) {
    Idioma.find((error, idiomasEncontrados) => {
        if (error) return res.send({ mensaje: "error:" + error })

        return res.send({ idiomas: idiomasEncontrados })
    })
}

function IdiomaId(req, res) {
    var idIdioma = req.params.idIdioma;

    Idioma.findById(idIdioma, (error, idiomaEncontrado) => {
        if (error) return res.send({ mensaje: "error:" + error })

        return res.send({ idioma: idiomaEncontrado })
    })
}

function crearIdioma(req, res) {
    var parametros = req.body;
    var IdiomaModelo = new Idioma();
    let paisSelect;

    if (parametros.nombreIdioma && parametros.pais) {

        Idioma.findOne({ nombreIdioma: parametros.nombreIdioma }, (error, idiomaBuscado) => {
            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
            if (idiomaBuscado) return res.status(500).send({ mensaje: "No se puede volver a agregar el mismo exacto idioma" });

            Idioma.findOne({ pais: { $regex: parametros.pais, $options: 'i' } }, (error, idioma) => {
                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                if (idioma) paisSelect = idioma.pais;
                if (!idioma) paisSelect = parametros.pais;

                IdiomaModelo.nombreIdioma = parametros.nombreIdioma;
                IdiomaModelo.pais = paisSelect;

                IdiomaModelo.save((error, idiomaGuardado) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!idiomaGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun idioma" });

                    return res.status(200).send({
                        idioma: idiomaGuardado, nota: "Idioma agregado exitosamente"
                    });
                });
            })
        })
    } else {
        return res.status(500).send({ mensaje: "Envie los parametros obligatorios" });
    }
}

function editarIdioma(req, res) {
    var idIdi = req.params.idIdi;
    var parametros = req.body;

    Idioma.findById(idIdi, (error, idiomaEncontrado) => {
        if (idiomaEncontrado) {

            Idioma.findByIdAndUpdate(idIdi, parametros, { new: true }, (error, idiomaActualizado) => {
                if (error) return res.status(500).send({ mesaje: "Error de la petición" });
                if (!idiomaActualizado) return res.status(500).send({ mensaje: "Error al editar el idioma" });

                Tema.updateMany({ idioma: idiomaEncontrado.nombreIdioma },
                    { idioma: parametros.nombreIdioma }, (error) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                        return res.status(200).send({
                            idioma: idiomaActualizado, nota: "Idioma actualizado exitosamente"
                        });
                    });
            })

        } else {
            return res.status(500).send({ mensaje: "No existe este idioma" });
        }
    });
}

function eliminarIdioma(req, res) {
    var idIdi = req.params.idIdi;

    Idioma.findById(idIdi, (error, idiomaEncontrado) => {
        if (idiomaEncontrado) {

            Idioma.findOne({ nombreIdioma: "Indefinido" }, (error, indefinidoEncontrado) => {
                if (error) return res.status(500).send({ mesaje: "Error de la petición" });

                if (!indefinidoEncontrado) {
                    const modeloI = new Idioma();
                    modeloI.nombreIdioma = "Indefinido";
                    modeloI.pais = "Indefinido";

                    modeloI.save((error, idiomaPorDefectoGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!idiomaPorDefectoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego el idioma Indefinido" });

                        Tema.updateMany({ idioma: idiomaEncontrado.nombreIdioma },
                            { idioma: idiomaPorDefectoGuardado.nombreIdioma }, (error) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                                Idioma.findByIdAndDelete(idIdi, (error, idiomaEliminado) => {
                                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                    if (!idiomaEliminado) return res.status(404).send({ mensaje: "Error al eliminar el idioma" });

                                    return res.status(200).send({
                                        idioma: idiomaEliminado, nota: "Eliminado con exito"
                                    });
                                })
                            })
                    });

                } else {
                    Tema.updateMany({ idioma: idiomaEncontrado.nombreIdioma },
                        { idioma: indefinidoEncontrado.nombreIdioma }, (error) => {
                            if (error) return res.status(500).send({ mensaje: "Error de la petición" });

                            Idioma.findByIdAndDelete(idIdi, (error, idiomaEliminado) => {
                                if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                                if (!idiomaEliminado) return res.status(404).send({ mensaje: "Error al eliminar el idioma" });

                                return res.status(200).send({
                                    idioma: idiomaEliminado, nota: "Eliminado con exito"
                                });
                            })
                        })
                }
            });
        } else {
            return res.status(500).send({ mensaje: "No existe este idioma" });
        }
    })
}

////////////////////////////////////////////////////////////////

function contratarProfesor(req, res) {
    var idCliente = req.params.idCliente;
    let info = Usuario;

    Usuario.findById(idCliente, (error, clienteEn) => {
        if (error) res.status(500).send({ error: "error en la petición" });
        if (!clienteEn) res.status(500).send({ error: "No existe este Cliente" })

        info.rol = "Profesor";
        info.calificacion = 0;
        info.ventasHechas = 0;
        info.clasesImpartidas = 0;

        Usuario.findByIdAndUpdate(idCliente, info, { new: true }, (error, clienteUp) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!clienteUp) return res.status(500).send({ mensaje: "Error al contratar" });

            return res.status(200).send({ profesor: clienteUp });
        })

    })
}

function despedirProfesor(req, res) {
    var idPro = req.params.idPro;
    let info = Usuario();

    Usuario.findById(idPro, (error, profeEn) => {
        if (error) res.status(500).send({ error: "error en la petición" });
        if (!profeEn) res.status(500).send({ error: "No existe este Profesor" })

        info.rol = "Cliente";
        info.calificacion = null;
        info.ventasHechas = null;
        info.clasesImpartidas = null;

        Usuario.findByIdAndUpdate(idPro, info, { new: true }, (error, profeUp) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!profeUp) return res.status(500).send({ mensaje: "Error al despedir" });

            return res.status(200).send({ cliente: profeUp });
        })

    })
}

////////////////////////////////////////////////////////////////

function verUsuarios(req, res) {
    Usuario.find({ rol: "Cliente" }, (error, usuariosEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!usuariosEn) return res.status(500).send({ mensaje: "No se encontron usuario" });

        return res.status(200).send({ usuarios: usuariosEn });
    })
}

function verProfesores(req, res) {
    Usuario.find({ rol: "Profesor" }, (error, profesoresEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profesoresEn) return res.status(500).send({ mensaje: "No se encontron profesores" });

        return res.status(200).send({ profesores: profesoresEn });
    })
}

function verProfesoresNombre(req, res) {
    var info = req.params.info;
    Usuario.find({ rol: "Profesor", nombre: { $regex: info, $options: 'i' } }, (error, profesoresEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profesoresEn) return res.status(500).send({ mensaje: "No se encontron profesores" });

        return res.status(200).send({ profesores1: profesoresEn });
    })
}

function verProfesoresUsuario(req, res) {
    var info = req.params.info;
    Usuario.find({ rol: "Profesor", usuario: { $regex: info, $options: 'i' } }, (error, profesoresEn) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!profesoresEn) return res.status(500).send({ mensaje: "No se encontron profesores" });

        return res.status(200).send({ profesores2: profesoresEn });
    })
}


module.exports = {
    Login,
    Admin,
    contratarProfesor,
    despedirProfesor,
    verCategorias,
    CategoriaId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    verIdiomas,
    IdiomaId,
    crearIdioma,
    editarIdioma,
    eliminarIdioma,

    verUsuarios,
    verProfesores,

    verProfesoresNombre,
    verProfesoresUsuario
}