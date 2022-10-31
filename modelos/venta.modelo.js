//cargar la libreria con la conexion a la bd
var bd = require('./bd');

//constructor
const Venta = function () { }

//metodo que obtiene la lista de paises
Venta.listar = function (resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //console.log(basedatos.collection('productos'));
    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .find({})
        .project(
            {
                fecha: 1,
                idCliente: 2,
                idVenta: 3,
                valor: 4,
                confirmado: 5,
                detalleCompra: 6
            }
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                //window.alert("Error listando productos", err),
                console.log("Error listando ventas", err)
                resultado(err, null)
            }
            else {
                resultado(null, res)
            }
        });
}

//metodo que agrega un registro
Venta.agregar = (venta, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .insertOne(
            {
                id: parseInt(venta.idVenta),
                urlImagen: venta.urlImagen,
                nombre: venta.nombre,
                descripcion: venta.descripcion,
                caracteristicas: venta.caracteristicas,
                precio: parseFloat(venta.precio),
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error agregando ventas", err);
                }
                else {
                    console.log("Se agregó la venta: ", venta);
                    resultado(null, venta);
                }
            }
        );
}


//metodo que modifique un registro
Venta.modificar = (venta, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .updateOne(
            { idVenta: venta.idVenta },
            {
                $set: {
                    urlImagen: producto.urlImagen,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    caracteristicas: producto.caracteristicas,
                    precio: producto.precio,
                }
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error modificando producto", err);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el producto ", producto);
                    return;
                }
                console.log("Se modificó con éxito el producto: ", producto);
                resultado(null, producto);

            }
        );
}


//metodo que elimina un registro
Venta.eliminar = (idVenta, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .deleteOne(
            { idVenta: eval(idVenta) }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error eliminando producto", err);
                    return;
                }

                //La consulta no afectó registros
                if (res.deletedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la venta con id=", idVenta);
                    return;
                }
                console.log("Se eliminó con éxito la venta con id=", idVenta);
                resultado(null, res);

            }
        );

}
module.exports = Venta;