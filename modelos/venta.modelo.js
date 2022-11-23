//cargar la libreria con la conexion a la bd
var bd = require('./bd');
const cliente = require('./cliente.modelo');
const producto = require('./producto.modelo');

//constructor
const Venta = function () { }

Venta.obtenerValor = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para totalizar el valor una venta
    const totalVenta = basedatos.collection('ventas')
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project:
                {
                    valorTotal:
                    {
                        $map:
                        {
                            input: "$detalle",
                            as: "detalle",
                            in: { $multiply: ["$$detalle.cantidad", "$$detalle.valorunitario"] }
                        }
                    }
                }
            },
            {
                $project:
                {
                    valorTotalVenta: { $sum: "$valorTotal" }
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error consultando total de venta ', error);
                    respuesta(error, -1);
                }
                else {
                    if (resultado) {
                        console.log(resultado);
                        respuesta(null, resultado[0].valorTotalVenta);
                    }
                    else {
                        respuesta(null, -1);
                    }
                }
            });
}

Venta.obtener = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para listar los ventas
    const ventas = basedatos.collection('ventas')
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project: {
                    id: 1,
                    cliente: 1,
                    fecha: 1,
                    confirmado: 1,
                    valor: 1,
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los ventas ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado) {
                        respuesta(null, resultado[0]);
                    }
                    else {
                        respuesta(null, null);
                    }
                }
            });

}

//metodo que obtiene la lista de ventas
Venta.listar = function (respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para listar los ventas
    basedatos.collection('ventas')
        .find()
        .project(
            {
                id: 1,
                cliente: 1,
                fecha: 1,
                confirmado: 1,
                valor: 1,
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los ventas ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}


//metodo que agrega un registro
Venta.agregar = function (venta, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //Verificar que el cliente exista
    cliente.obtener(venta.cliente.id,
        function (error, resultado) {
            venta.cliente = resultado;
            //***** codigo MONGO para agregar un Documento venta
            basedatos.collection('ventas')
                .insertOne({
                    id: venta.id,
                    cliente: venta.cliente,
                    fecha: venta.fecha,
                    confirmado: false,
                    valor: 0,
                }
                    //*****
                    , function (error, resultado) {
                        if (error) {
                            console.log('Error agregando venta ', error);
                            respuesta(error, null);
                        }
                        else {
                            respuesta(null, venta);
                        }
                    }

                );

        });
}

Venta.modificarValor = function (idVenta, respuesta)  {
    const basedatos = bd.obtenerBaseDatos();

    this.obtenerValor(idVenta,
         function (error, resultado) {
            console.log(resultado);
            //***** codigo MONGO para modificar el estado de la venta
            basedatos.collection('ventas')
                .updateOne(
                    { id: eval(idVenta) },
                    {
                        $set: {
                            valor: resultado,
                        }
                    }
                    //*****
                    , function (error, resultado) {
                        if (error) {
                            console.log('Error totalizando venta ', error);
                            respuesta(error, null);
                        }
                        else {
                            respuesta(null, "Venta fue totalizada");
                        }
                    }

                );
        });
}

Venta.pagar = function (idVenta, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para modificar el estado de la venta
    basedatos.collection('ventas')
        .updateOne(
            { id: eval(idVenta) },
            {
                $set: {
                    confirmado: true,
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error pagando venta ', error);
                    respuesta(error, null);
                    return
                }

                Venta.actualizarInventario(eval(idVenta),
                    function (err, res) {
                        console.log(res);
                    });
                respuesta(null, "La venta ha sido pagada");

            }

        );
}

/*
//metodo que modifique un registro
Venta.modificar = (venta, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .updateOne(
            { id: venta.id },
            {
                $set: {
                    cliente: venta.cliente,
                    fecha: venta.fecha,
                    confirmado: venta.confirmado,
                    valor: venta.valor,
                }
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error modificando venta", err);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la venta ", venta);
                    return;
                }
                console.log("La venta ", venta, " se modificó con éxito: ");
                resultado(null, venta);

            }
        );
}
*/


//metodo que elimina un registro
Venta.eliminar = function (idventa, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para eliminar un Documento venta
    basedatos.collection('ventas')
        .deleteOne(
            { id: eval(idventa) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando venta ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el venta por no encontrarse');
                        respuesta({ mensaje: "venta no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el venta con id:${idventa}`);
                        respuesta(null, { mensaje: `Se eliminó el venta con id:${idventa}` });
                    }
                }
            }
        );
}

//metodo que obtiene la lista de ventas
Venta.listarDetalle = function (idVenta, resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .aggregate([
            { $match: { id: eval(idVenta) } },
            {
                $project: {
                    'detalle.producto': 1,
                    'detalle.cantidad': 1,
                    'detalle.valorunitario': 1,
                }
            }]
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando detalles de la compra", err);
                resultado(err, null);
            }
            else {
                resultado(null, res.length > 0 ? res[0].detalle : []);
            }
        });
}


Venta.actualizarInventario = (idVenta, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    //Consultar el detalle de la venta
    Venta.listarDetalle(idVenta, async (error, detalles) => {
        //Verificar si hubo error ejecutando la consulta
        if (error) {
            console.log("Error actualizando inventario:", error);
            resultado(error, null);
            return;
        }
        await detalles.map((detalle) => {
            producto.actualizarExistencia(detalle.producto.id, detalle.cantidad,
                (err, res) => {
                    if (error) {
                        console.log("Error actualizando existencia:", err);
                        return;
                    }
                    console.log(res);
                });
        });

        resultado(null, { mensaje: `actualizada existencias de la venta ${idVenta}` });

    });
}


module.exports = Venta;