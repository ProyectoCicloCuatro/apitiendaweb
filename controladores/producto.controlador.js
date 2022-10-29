//cargar el modelo de productos
const producto = require('../modelos/producto.modelo');

//metodo web para obtener la lista de productos
exports.listar = (req, res) => {
    producto.listar((err, datos) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de productos' });
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
        res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del producto' });
    }

    producto.agregar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando el producto' });
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
        res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del producto' });
    }

    producto.modificar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error modificando el producto' });
            }
            else {
                res.send(datos);
            }
        }
    );
}

//metodo web para eliminar un país
exports.eliminar = (req, res) => {
    producto.eliminar(req.params.id,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando el producto' });
            }
            else {
                res.send({ mensaje: `Se eliminó el producto con id=${req.params.id}` });
            }
        }
    );
}