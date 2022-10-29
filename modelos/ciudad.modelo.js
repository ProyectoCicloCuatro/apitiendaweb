//cargar la libreria con la conexion a la bd
var bd = require('./bd');

//constructor
const Ciudad = function () { }

//metodo que obtiene la lista de ciudades
Ciudad.listar = function (idPais, nombreRegion, resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();
    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .aggregate([
            {
                $match: { id: eval(idPais), 'regiones.nombre': nombreRegion }
            },
            {
                $project: {
                    regiones: {
                        $filter: {
                            input: '$regiones',
                            as: 'region',
                            cond: { $eq: ['$$region.nombre', nombreRegion] }
                        }
                    }
                }
            }
        ]
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando ciudades", err);
                resultado(err, null);
            }
            else {
                var ciudades = [];
                console.log(res[0]);
                if (res[0]) {
                    ciudades = res[0].regiones[0].ciudades
                }
                resultado(null, ciudades);
            }
        });
}

//Metodo que agrega un registro 
Ciudad.agregar = (idPais, nombreRegion, ciudad, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais),
                regiones: { $elemMatch: { nombre: nombreRegion } }
            },
            {
                $push: {
                    'regiones.$.ciudades':
                    {
                        nombre: ciudad.nombre,
                        capitalRegion: ciudad.capitalRegion,
                        capitalPais: ciudad.capitalPais
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error agregando ciudad:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la región", err);
                    return;
                }
                resultado(null, ciudad);
                console.log("Ciudad agregada :", ciudad);

            }
        )
}

//Metodo que modifica un registro 
Ciudad.modificar = (idPais, nombreRegion, ciudad, resultado) => {
    const basedatos = bd.obtenerBaseDatos();
    console.log(idPais);
console.log(ciudad);
console.log(nombreRegion);
    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais)
            },
            {
                $set:
                {
                    'regiones.$[region].ciudades.$[ciudad].capitalRegion': ciudad.capitalRegion,
                    'regiones.$[region].ciudades.$[ciudad].capitalPais': ciudad.capitalPais
                }
            },
            {
                arrayFilters: [{ 'region.nombre': nombreRegion }, { 'ciudad.nombre': ciudad.nombre }],
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error actualizando ciudad:", err);
                    resultado(err, null);
                    return;
                }
                console.log("Ciudad actualizada :", ciudad);
                resultado(null, ciudad);
            }

        );
}

//Metodo que elimina un registro 
Ciudad.eliminar = (idPais, nombreRegion, nombreCiudad, resultado) => {
    const basedatos = bd.obtenerBaseDatos();

    basedatos.collection('paises')
        //***** Código MongoDB *****
        .updateOne(
            {
                id: eval(idPais),
                regiones: { $elemMatch: { nombre: nombreRegion } }
            },
            {
                $pull: {
                    'regiones.$.ciudades':
                    {
                        nombre: nombreCiudad
                    }
                }
            },
            //**************************
            function (err, res) {
                //Verificar si hubo error ejecutando la consulta
                if (err) {
                    console.log("Error eliminando Ciudad:", err);
                    resultado(err, null);
                    return;
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró la Ciudad", nombreCiudad);
                    return;
                }
                console.log("Ciudad eliminada con nombre :", nombreCiudad);
                resultado(null, res);
            }
        );
}


module.exports = Ciudad;