module.exports = (app) => {

    const controlPais = require('../controladores/pais.controlador');

    //metodo de la API que obtiene la lista de paises
    app.get("/paises", controlPais.listar);

    //metodo de la API que agrega un país
    app.post("/paises/agregar", controlPais.agregar);

    //metodo de la API que modifica un país
    app.post("/paises/modificar", controlPais.modificar);

    //metodo de la API que elimina un país
    app.delete("/paises/:id", controlPais.eliminar);

}