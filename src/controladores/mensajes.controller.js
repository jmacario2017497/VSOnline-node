const Mensaje = require('../modelos/mensajes.model');


function getMesajes(req, res) {
    Mensaje.find((err, mensajesObtenidos) => {
        if ( err) return res.status(500).send({mensaje: 'Error interno'});
        if (!mensajesObtenidos) return res.status({mensaje: 'No hay mensajes'});

        return res.status(200).send({mensajes: mensajesObtenidos})
    }).populate('usuario', 'nombre apellido');
}


function mandarMenssaje(req, res) {
    var params = req.body;
    // const user = req.params.id;
    var mensajeModelo = new Mensaje();
    var hoy = new Date();
    var fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();	
    var hora = hoy.getHours() + ':' + hoy.getMinutes();

    if(params.message) {
        mensajeModelo.message = params.message;
        mensajeModelo.fecha = fecha + " " + hora;
        mensajeModelo.usuario = req.user.sub;

        mensajeModelo.save((err, mensajeGuardado) => {
            if (err) return res.status(500).send({mensaje : 'Error interno del servidor'});
            if (!mensajeGuardado) return res.status(500).send({ mensaje: 'Error al momemnto de mandar el mensaje' });
            //console.log(err);
            return res.status(200).send({mensaje: mensajeGuardado})
        })
    } else {
        return res.status(500).send({ mensaje: 'No se puede enviar un mensaje vacio' });
        //console.log(err);
    }
}


module.exports = {
    getMesajes,
    mandarMenssaje
}