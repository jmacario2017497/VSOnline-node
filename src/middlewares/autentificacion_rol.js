exports.Adm = function (req, res, next) {
    if (req.user.rol !== "Admin") {
        return res.status(500).send({ message: "Solo para usuarios rol: Admin"})
    }
    next()
}

exports.Pro = function (req, res, next) {
    if (req.user.rol !== "Profesor") {
        return res.status(500).send({ message: "Solo para usuarios rol: Profesor"})
    }
    next()
}

exports.Usu = function (req, res, next) {
    if (req.user.rol !== "Cliente") {
        return res.status(500).send({ message: "Solo para usuarios rol: Cliente"})
    }
    next()
}