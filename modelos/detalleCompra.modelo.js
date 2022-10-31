//cargar la libreria con la conexion a la bd
var bd = require('./bd');

//constructor
const DetalleCompra = function () { }

//metodo que obtiene la lista de paises
DetalleCompra.listar = function (idVenta, resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .aggregate([
            { $match: { idVenta: eval(idVenta) } },
            {
                $project: {
                    'detalleCompra.idProducto': 1,
                    'detalleCompra.cantidad': 2
                }
            }]
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando detalle de compras", err);
                resultado(err, null);
            }
            else {
                resultado(null, res[0].detalleCompra);
            }
        });
}

//Metodo que agrega un registro 
DetalleCompra.agregar = (idVenta, venta, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idVenta)
            },
            {
                $push: {
                    detalleCompra:
                    {
                        idProducto: venta.idProducto,
                        cantidad: venta.cantidad
                    }

                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error agregando detalle de Compra:", err);
                    resultado(err, null);
                }
                else {
                    console.log("Detalle Compra agregada :", venta);
                    resultado(null, venta);
                }
                //cerrar la consulta
                //basedatos.close();
            }
        )
}

//Metodo que modifica un registro 
DetalleCompra.modificar = (idVenta, detalleCompra, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                idVenta: eval(idVenta),
                detalleCompra: { $elemMatch: { idProducto: detalleCompra.idProducto } }
            },
            {
                $set:
                {
                    'detalleCompra.$.idProducto': detalleCompra.idproducto,
                    'detalleCompra.$.cantidad': detalleCompra.cantidad
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error actualizando región:", err);
                    resultado(err, null);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la región", err);
                    return;
                }
                console.log("Región actualizada :", region);
                resultado(null, region);
            }

        );
}

//Metodo que elimina un registro 
DetalleCompra.eliminar = (idVenta, idProducto, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('ventas')
        //***** Código MongoDB *****
        .updateOne(
            {
                idVenta: eval(idVenta)
            },
            {
                $pull: {
                    detalleCompra:
                    {
                        idProducto: idProducto
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error eliminando detalle compra:", err);
                    resultado(err, null);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el detalle de la compra", err);
                    return;
                }
                console.log("Producto eliminado con id :", idProducto);
                resultado(null, res);
            }
        );
}


module.exports = DetalleCompra;