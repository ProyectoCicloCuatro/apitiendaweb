module.exports = (app) => {

    const detalleCompra = require('../controladores/detalleCompra.controlador');

    //metodo de la API que obtiene la lista de paises
    app.get("/detallecompra/:id", detalleCompra.listar);

    //metodo de la API que agrega (INSERT) una región
    app.post("/detallecompra/agregar/:id", detalleCompra.agregar);

    //metodo de la API que modifica (UPDATE) una región
    app.post("/detallecompra/modificar/:id", detalleCompra.modificar);

    //metodo de la API que elimina (DELETE) una región
    app.delete("/detallecompra/:id/:idProducto", detalleCompra.eliminar);

}