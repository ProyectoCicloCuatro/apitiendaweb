//cargar el modelo de paises
const region = require('../modelos/region.modelo');

//metodo web para obtener la lista de regiones
exports.listar = (req, res) => {
    region.listar(req.params.id, (err, datos) => {
        //Verificar si hubo error
        if (err) {
            res.status(500).send({ mensaje: 'Error obteniendo la lista de regiones' });
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

    region.agregar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error agregando la región' });
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
        res.status(400).send({ message: 'El contenido del mensaje debe tener información con la región' });
    }

    region.modificar(req.params.id, req.body,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error actualizando la región ' });
            }
            else {
                //Se devuelve el registro actualizado
                res.send(data);
            }
        });
}


//Metodo web para eliminar una region
exports.eliminar = (req, res) => {
    region.eliminar(req.params.id, req.params.nombre,
        (err, data) => {
            //Verificar si hubo error
            if (err) {
                res.status(500).send({ mensaje: 'Error eliminando la región ' });
            }
            else {
                //Se devuelve mensaje
                res.send({ mensaje: `La región con nombre:${req.params.nombre} fue eliminada` });
            }
        });
}
