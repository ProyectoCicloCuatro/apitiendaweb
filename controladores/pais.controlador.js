//cargar el modelo de paises
const pais = require('../modelos/pais.modelo');

//metodo web para obtener la lista de paises
exports.listar = (req, res) => {
    pais.listar((err, datos) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de paises' });
        }
        else {
            //devolver los registros obtenidos
            res.send(datos);
        }
    }
    );
}

//metodo web para agregar un país
exports.agregar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del país' });
    }

    pais.agregar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando el país' });
            }
            else {
                res.send(datos);
            }
        }
    );
}

//metodo web para modificar un país
exports.modificar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del país' });
    }

    pais.modificar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error modificando el país' });
            }
            else {
                res.send(datos);
            }
        }
    );
}

//metodo web para eliminar un país
exports.eliminar = (req, res) => {
    pais.eliminar(req.params.id,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando el país' });
            }
            else {
                res.send({ mensaje: `Se eliminó el país con id=${req.params.id}` });
            }
        }
    );
}