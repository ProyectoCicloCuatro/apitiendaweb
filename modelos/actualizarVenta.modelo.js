//cargar la libreria con la conexion a la bd
var bd = require('./bd');

const producto = require('./producto.modelo');

//constructor
const ActualizarVenta = function () { }

//metodo que obtiene la lista de ventas
ActualizarVenta.listarDetalle = function (idVenta, resultado) {
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


ActualizarVenta.actualizarInventario = (idVenta, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    //Consultar el detalle de la venta
    this.listarDetalle(idVenta, async (error, detalles) => {
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

ActualizarVenta.actualizar = function (idVenta, respuesta) {
    this.actualizarInventario(idVenta,
        function (err, res) {
            console.log(res);
        });
    respuesta(null, "La venta ha sido pagada");
           
}



module.exports = ActualizarVenta;