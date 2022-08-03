const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = "clave_maestra_confidencial";

exports.crearToken = function (VS) {
    let payload = {
        sub: VS._id,
        usuario: VS.usuario,
        rol: VS.rol,
        iat: moment().unix(),
        exp: moment().day(7,'days').unix()
    }
    return jwt_simple.encode(payload, secret);
}