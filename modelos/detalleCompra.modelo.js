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

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                idVenta: eval(idVenta),
                detalleCompra: { $elemMatch: { nombre: detalleCompra.nombre } }
            },
            {
                $set:
                {
                    'regiones.$.area': region.area,
                    'regiones.$.poblacion': region.poblacion
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
DetalleCompra.eliminar = (idPais, nombreRegion, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais)
            },
            {
                $pull: {
                    regiones:
                    {
                        nombre: nombreRegion
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error eliminando región:", err);
                    resultado(err, null);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la región", err);
                    return;
                }
                console.log("Región eliminada con nombre :", nombreRegion);
                resultado(null, res);
            }
        );
}


module.exports = DetalleCompra;