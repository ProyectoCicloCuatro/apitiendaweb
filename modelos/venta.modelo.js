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
Venta.agregar = (producto, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .insertOne(
            {
                id: parseInt(producto.id),
                urlImagen: producto.urlImagen,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                caracteristicas: producto.caracteristicas,
                precio: parseFloat(producto.precio),
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error agregando ventas", err);
                }
                else {
                    console.log("Se agregó la venta: ", producto);
                    resultado(null, producto);
                }
            }
        );
}


//metodo que modifique un registro
Venta.modificar = (producto, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('productos')
        //***** Código Mongo *****
        .updateOne(
            { id: producto.id },
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
Venta.eliminar = (idProducto, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('productos')
        //***** Código Mongo *****
        .deleteOne(
            { id: eval(idProducto) }
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
                    console.log("No se encontró el producto con id=", idProducto);
                    return;
                }
                console.log("Se eliminó con éxito el producto con id=", idProducto);
                resultado(null, res);

            }
        );

}
module.exports = Venta;