//cargar el modelo de paises
const venta = require('../modelos/detalleCompra.modelo');

//metodo web para obtener la lista de regiones
exports.listar = (req, res) => {
    detalleCompra.listar(req.params.id, (err, datos) => {
        //Verificar si hubo error
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de detalle de compra' });
        }
        else {
            //devolver los registros obtenidos
            res.send(datos);
        }
    }
    );
}

//Metodo web para agregar un region
exports.agregar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener información con la región' });
    }

    detalleCompra.agregar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando el detalleCompra' });
            }
            else {
                //Se devuelve el registro actualizado
                res.send(data);
            }
        }
    );
}


//Metodo web para actualizar un region
exports.modificar = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener información con el detalle de la compra' });
    }

    detalleCompra.modificar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error actualizando detalle de la compra ' });
            }
            else {
                //Se devuelve el registro actualizado
                res.send(data);
            }
        });
}


//Metodo web para eliminar una region
exports.eliminar = (req, res) => {
    detalleCompra.eliminar(req.params.id, req.params.nombre,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando el detalle de la compra ' });
            }
            else {
                //Se devuelve mensaje
                res.send({ mensaje: `La región con nombre:${req.params.nombre} fue eliminada` });
            }
        });
}
