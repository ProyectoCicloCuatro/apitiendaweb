//cargar la libreria con la conexion a la bd
//const ventaRutas = require('../rutas/venta.rutas');
var bd = require('./bd');
const producto = require('./producto.modelo');
const venta = require('./venta.modelo');

//constructor
const Detalle = function () { }

//metodo que obtiene la lista de ventas
Detalle.listar = function (idVenta, resultado) {
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

//Metodo que agrega un registro 
Detalle.agregar = (idVenta, detalle, respuesta) => {
    const basedatos = bd.obtenerBaseDatos();

    //Verificar que el producto exista
    producto.obtener(detalle.producto.id,
        function (error, resultado) {
            //Verificar que haya existencia
            if (resultado.cantidad > 0) {

                detalle.producto = resultado;
                detalle.valorunitario = resultado.precio;

                basedatos.collection('ventas')
                    //***** Código MongoDB *****
                    .updateOne(
                        {
                            id: eval(idVenta)
                        },
                        {
                            $push: {
                                detalle:
                                {
                                    producto: detalle.producto,
                                    cantidad: detalle.cantidad,
                                    valorunitario: detalle.valorunitario
                                }

                            }
                        },
                        //**************************
                        function (err, res) {
                            //Verificar si hubo error ejecutando la consulta
                            if (err) {
                                console.log("Error agregando detalle de la venta:", err);
                                respuesta(err, null);
                                return;
                            }
                            //La consulta no afectó registros
                            if (res.modifiedCount == 0) {
                                //No se encontraron registros
                                respuesta({ mensaje: "No encontrado" }, null);
                                console.log("No se encontró la venta", err);
                                return;
                            }
                            console.log("Detalle de la venta agregado :", detalle);
                            respuesta(null, detalle);

                            venta.modificarValor(idVenta,
                                function (err, res) {
                                    console.log(res);
                                });
                        }
                    )
            }
            else {
                console.log("Error agregando detalle de la venta: No hay existencia para vender");
                respuesta({ mensaje: "Error agregando detalle de la venta: No hay existencia para vender" }, null);
            }
        });
}

//Metodo que modifica un registro 
Detalle.modificar = (idVenta, detalle, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idVenta),
                detalle: { $elemMatch: { nombre: detalle.nombre } }
            },
            {
                $set:
                {
                    'detalle.$.producto': detalle.producto,
                    'detalle.$.cantidad': detalle.cantidad,
                    'detalle.$.valorunitario': detalle.valorunitario
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error actualizando detalle de la venta:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la detalle de la venta", err);
                    return;
                }
                console.log("Detalle de Venta actualizada :", detalle);
                resultado(null, detalle);
            }

        );
}

//Metodo que actualiza las existencias de los productos vendidos
Detalle.actualizarInventario = (idVenta, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    //Consultar el detalle de la venta
    Detalle.listar(idVenta, async (error, detalles) => {
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


//Metodo que elimina un registro 
Detalle.eliminar = (idVenta, nombreDetalle, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idVenta)
            },
            {
                $pull: {
                    detalles:
                    {
                        nombre: nombreDetalle
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error eliminando detalle de la venta:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la detalle de la venta", err);
                    return;
                }
                console.log("Detalle de la venta eliminada con nombre :", nombreDetalle);
                resultado(null, res);
            }
        );
}


module.exports = Detalle;