module.exports = (app) => {

    const controlVenta = require('../controladores/venta.controlador');

    //metodo de la API que obtiene la lista de productos
    app.get("/ventas", controlVenta.listar);

    //metodo de la API que agrega un producto
    app.post("/ventas/agregar", controlVenta.agregar);

    //metodo de la API que modifica un producto
    app.post("/ventas/modificar", controlVenta.modificar);

    //metodo de la API que elimina un producto
    app.delete("/ventas/:id", controlVenta.eliminar);

}

