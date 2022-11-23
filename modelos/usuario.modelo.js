const bd = require('./bd')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configSeguridad = require('../configuracion/seguridad.config');

const Usuario = function () { }

Usuario.obtener = function (correo, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para listar los usuarios
    const usuarios = basedatos.collection('usuarios')
        .aggregate([
            { $match: { correo: correo } },
            {
                $project: {
                    nombre: 1,
                    correo: 1,
                    clave: 1,
                    token: 1,
                }
            }
        ]).toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error buscando usuario ', error);
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

Usuario.listar = function (respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para listar los usuarios
    basedatos.collection('usuarios')
        .find()
        .project(
            {
                id: 1,
                identificacion: 1,
                nombre: 1,
                apellido: 1,
                correo: 1,
                clave: 1,
                token: 1,
            }
        )
        //*****
        .toArray(
            function (error, resultado) {
                if (error) {
                    console.log('Error listando los usuarios ', error);
                    respuesta(error, null);
                }
                else {
                    respuesta(null, resultado);
                }
            }
        );
    ;
}

Usuario.agregar = function (usuario, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //verificar que el usuario existe
    this.obtener(usuario.correo,
        async function (error, resultado) {
            if (!resultado) {
                //***** codigo MONGO para agregar un Documento usuario
                basedatos.collection('usuarios')
                    .insertOne({
                        id: usuario.id,
                        identificacion: usuario.identificacion,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo,
                        clave: await bcrypt.hash(usuario.clave, 10)
                    }
                        //*****
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error agregando usuario ', error);
                                respuesta(error, null);
                            }
                            else {
                                respuesta(null, usuario);
                            }
                        }

                    );
            }
        });
}

Usuario.modificar = function (usuario, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para moidifcar un Documento usuario
    basedatos.collection('usuarios')
        .updateOne(
            { correo: correo },
            {
                $set: {
                    identificacion: usuario.identificacion,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo,
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error modificando usuario ', error);
                    respuesta(error, null);
                    return;
                }
                //La consulta no afectó registros
                if (resultado.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "Usuario no actualizado" }, null);
                    console.log("No se actualizó el usuario ", pais);
                    return;
                }
                respuesta(null, usuario);

            }

        );
}

Usuario.cambiarClave = async function (correo, clave, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para moidifcar un Documento usuario
    basedatos.collection('usuarios')
        .updateOne(
            { correo: correo },
            {
                $set: {
                    clave: await bcrypt.hash(clave, 10)
                }
            }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error cambiando clave de usuario ', error);
                    respuesta(error, null);
                    return;
                }
                //La consulta no afectó registros
                if (resultado.modifiedCount == 0) {
                    //No se encontraron registros
                    respuesta({ mensaje: "Clave no cambiada" }, null);
                    console.log("No se cambió la clave del usuario");
                    return;
                }
                respuesta(null, { mensaje: `Clave cambiada al usuario ${correo}` });
            }

        );
}

Usuario.login = async function (correo, clave, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //verificar que el usuario existe
    this.obtener(correo,
        async function (error, usuarioEncontrado) {
            if (usuarioEncontrado &&
                await bcrypt.compare(clave, usuarioEncontrado.clave)) {
                //crear token
                const token = jwt.sign(
                    { user_id: correo },
                    configSeguridad.LLAVE_TOKEN,
                    {
                        expiresIn: "8h"
                    }
                );
                usuarioEncontrado.token = token;

                //***** codigo MONGO para cambiar token del usuario
                basedatos.collection('usuarios')
                    .updateOne(
                        { correo: correo },
                        {
                            $set: {
                                token: token,
                            }
                        }
                        //*****
                        , function (error, resultado) {
                            if (error) {
                                console.log('Error en Login de usuario ', error);
                                respuesta(error, null);
                            }
                            else {
                                respuesta(null, usuarioEncontrado);
                            }
                        }

                    );
            }
            else {
                respuesta({ mensaje: "no se puede loguear" }, null);
            }
        });
}


Usuario.eliminar = function (idusuario, respuesta) {
    const basedatos = bd.obtenerBaseDatos();

    //***** codigo MONGO para eliminar un Documento usuario
    basedatos.collection('usuarios')
        .deleteOne(
            { id: eval(idusuario) }
            //*****
            , function (error, resultado) {
                if (error) {
                    console.log('Error eliminando usuario ', error);
                    respuesta(error, null);
                }
                else {
                    if (resultado.deleteCount == 0) {
                        console.log('No se eliminó el usuario por no encontrarse');
                        respuesta({ mensaje: "usuario no encontrado" }, null);
                    }
                    else {
                        console.log(`Se eliminó el usuario con id:${idusuario}`);
                        respuesta(null, { mensaje: `Se eliminó el usuario con id:${idusuario}` });
                    }
                }
            }
        );
}

module.exports = Usuario;