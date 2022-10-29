//cargar la libreria con la conexion a la bd
var bd = require('./bd');

//constructor
const Region = function () { }

//metodo que obtiene la lista de paises
Region.listar = function (idPais, resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .aggregate([
            { $match: { id: eval(idPais) } },
            {
                $project: {
                    'regiones.nombre': 1,
                    'regiones.area': 2,
                    'regiones.poblacion': 3,
                }
            }]
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando regiones", err);
                resultado(err, null);
            }
            else {
                resultado(null, res[0].regiones);
            }
        });
}

//Metodo que agrega un registro 
Region.agregar = (idPais, region, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais)
            },
            {
                $push: {
                    regiones:
                    {
                        nombre: region.nombre,
                        area: region.area,
                        poblacion: region.poblacion
                    }

                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error agregando región:", err);
                    resultado(err, null);
                }
                else {
                    console.log("Región agregada :", region);
                    resultado(null, region);
                }
                //cerrar la consulta
                //basedatos.close();
            }
        )
}

//Metodo que modifica un registro 
Region.modificar = (idPais, region, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais),
                regiones: { $elemMatch: { nombre: region.nombre } }
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
Region.eliminar = (idPais, nombreRegion, resultado) => {
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


module.exports = Region;