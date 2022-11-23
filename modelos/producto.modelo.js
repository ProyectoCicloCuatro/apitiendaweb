//cargar la libreria con la conexion a la bd
var bd = require('./bd');


//constructor
const Producto = function () { }

Producto.obtener = function (idProducto, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para listar los productos
    const productos = basedatos.collection('productos')
        .aggregate([
            { $match: { id: eval(idProducto) } },
            {
                $project: {
                    id: 1,
                    urlImagen: 1,
                    nombre: 1,
                    descripcion: 1,
                    caracteristicas: 1,
                    precio: 1,
                    cantidad: 1
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los productos ', error);
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

//metodo que obtiene la lista de paises
Producto.listar = function (respuesta) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //console.log(basedatos.collection('productos'));
    //Ejecutar la consulta
    basedatos.collection('productos')
        //***** Código Mongo *****
        .find({})
        .project(
            {
                id: 1,
                urlImagen: 2,
                nombre: 3,
                descripcion: 4,
                caracteristicas: 5,
                precio: 6,
                cantidad: 7
            }
        )
        //************************
        .toArray(function (error, resultado) {
            if (error) {
                //window.alert("Error listando productos", error),
                console.log("Error listando productos", error)
                respuesta(err, null)
            }
            else {
                respuesta(null, resultado)
            }
        });
}

//metodo que agrega un registro
Producto.agregar = function (producto, respuesta) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('productos')
        //***** Código Mongo *****
        .insertOne(
            {
                id: parseInt(producto.id),
                urlImagen: producto.urlImagen,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                caracteristicas: producto.caracteristicas,
                precio: parseFloat(producto.precio),
                cantidad: parseInt(producto.cantidad),
            }
            //************************
            , function (error, resultado) {
                if (error) {
                   console.log("Error agregando producto", error);
                   respuesta(error, null);
                }
                else {
                    console.log("Se agregó el producto: ", producto);
                    respuesta(null, producto);
                }
            }
        );
}


//metodo que modifique un registro
Producto.modificar = function (producto, respuesta) {
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
                    cantidad: producto.cantidad,
                }
            }
            //************************
            , function (error, resultado) {
                if (error) {
                    respuesta(error, null);
                    console.log("Error modificando producto", error);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el producto ", producto);
                    return;
                }
                console.log("Se modificó con éxito el producto: ", producto);
                respuesta(null, producto);

            }
        );
}

Producto.actualizarExistencia = function (id, unidades, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    this.obtener(id,
        function (error, resultado) {
            if (resultado) {
                //***** codigo MONGO para moidifcar un Documento producto
                basedatos.collection('productos')
                    .updateOne(
                        { id: id },
                        {
                            $set: {
                                cantidad: resultado.cantidad-unidades,
                            }
                        }
                        //*****
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error actualizando existencia ', error);
                                respuesta(error, null);
                                return;
                            }
                            //La consulta no afectó registros
                            if (resultado.modifiedCount == 0) {
                                //No se encontraron registros
                                respuesta({ mensaje: `Existencia no actualizada del producto ${resultado.nombre}` }, null);
                                console.log(`Existencia no actualizada del producto ${resultado.nombre}`);
                                return;
                            }

                            respuesta(null, `El inventario del producto ${resultado.nombre} fue actualizado`);

                        }

                    );
            }
        });
}

//metodo que elimina un registro
Producto.eliminar = function (idProducto, respuesta) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('productos')
        //***** Código Mongo *****
        .deleteOne(
            { id: eval(idProducto) }
            //************************
            , function (error, resultado) {
                if (error) {
                    respuesta(err, null);
                    console.log("Error eliminando producto", error);
                    return;
                }

                //La consulta no afectó registros
                if (resultado.deletedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el producto con id=", idProducto);
                    return;
                }
                console.log("Se eliminó con éxito el producto con id=", idProducto);
                respuesta(null, resultado);

            }
        );

}
module.exports = Producto;