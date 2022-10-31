//cargar el modelo de productos
const venta = require('../modelos/venta.modelo');

//metodo web para obtener la lista de productos
exports.listar = (req, res) => {
    venta.listar((err, datos) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de ventas' });
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

    venta.agregar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando la venta' });
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

    venta.modificar(req.body,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error modificando la venta' });
            }
            else {
                res.send(datos);
            }
        }
    );
}

//metodo web para eliminar un país
exports.eliminar = (req, res) => {
    venta.eliminar(req.params.id,
        (err, datos) => {
            //verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando la venta' });
            }
            else {
                res.send({ mensaje: `Se eliminó la venta con id=${req.params.id}` });
            }
        }
    );
}