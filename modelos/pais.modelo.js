//cargar la libreria con la conexion a la bd
var bd = require('./bd');

//constructor
const Pais = function () { }

//metodo que obtiene la lista de paises
Pais.listar = function (resultado) {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .find({})
        .project(
            {
                id: 1,
                nombre: 2,
                continente: 3,
                tipoRegion: 4,
                codigoAlfa2: 5,
                codigoAlfa3: 6
            }
        )
        //************************
        .toArray(function (err, res) {
            if (err) {
                console.log("Error listando paises", err)
                resultado(err, null)
            }
            else {
                resultado(null, res)
            }
        });
}

//metodo que agrega un registro
Pais.agregar = (pais, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .insertOne(
            {
                id: pais.id,
                nombre: pais.nombre,
                continente: pais.continente,
                tipoRegion: pais.tipoRegion,
                codigoAlfa2: pais.codigoAlfa2,
                codigoAlfa3: pais.codigoAlfa3,
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error agregando país", err);
                }
                else {
                    console.log("Se agregó el país: ", pais);
                    resultado(null, pais);
                }
            }
        );
}


//metodo que modifique un registro
Pais.modificar = (pais, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .updateOne(
            { id: pais.id },
            {
                $set: {
                    nombre: pais.nombre,
                    continente: pais.continente,
                    tipoRegion: pais.tipoRegion,
                    codigoAlfa2: pais.codigoAlfa2,
                    codigoAlfa3: pais.codigoAlfa3,
                }
            }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error modificando país", err);
                }
                //La consulta no afectó registros
                if (res.modifiedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el país ", pais);
                    return;
                }
                console.log("Se modificó con éxito el país: ", pais);
                resultado(null, pais);

            }
        );
}


//metodo que elimina un registro
Pais.eliminar = (idPais, resultado) => {
    //obtener objeto de conexion a la base de datos
    const basedatos = bd.obtenerBaseDatos();

    //Ejecutar la consulta
    basedatos.collection('paises')
        //***** Código Mongo *****
        .deleteOne(
            { id: eval(idPais) }
            //************************
            , function (err, res) {
                if (err) {
                    resultado(err, null);
                    console.log("Error eliminando país", err);
                    return;
                }

                //La consulta no afectó registros
                if (res.deletedCount == 0) {
                    //No se encontraron registros
                    resultado({ mensaje: "No encontrado" }, null);
                    console.log("No se encontró el país con id=", idPais);
                    return;
                }
                console.log("Se eliminó con éxito el país con id=", idPais);
                resultado(null, res);

            }
        );

}
module.exports = Pais;