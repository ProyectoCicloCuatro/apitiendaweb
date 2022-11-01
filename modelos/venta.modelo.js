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
                id: 1,
                fecha: 2,
                idCliente: 3,
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
                fecha: venta.fecha,
                idcliente: parseInt(venta.idCliente),
                valor: venta.valor,
                confirmado: venta.confirmado,
                detalleCompra: detalleCompra,
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
            { id: venta.id },
            {
                $set: {
                    fecha: venta.fecha,
                    idcliente: parseInt(venta.idCliente),
                    valor: venta.valor,
                    confirmado: venta.confirmado,
                    detalleCompra: detalleCompra,
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
                console.log("La venta ",venta," se modificó con éxito: ");
                resultado(null, venta);

            }
        );
}


//metodo que elimina un registro
Venta.eliminar = (id, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('ventas')
        //***** Código Mongo *****
        .deleteOne(
            { id: eval(id) }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error eliminando venta", err);
                    return;
                }

                //La consulta no afectó registros
                if (res.deletedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la venta con id=", id);
                    return;
                }
                console.log("Se eliminó con éxito la venta con id=", id);
                resultado(null, res);

            }
        );

}
module.exports = Venta;