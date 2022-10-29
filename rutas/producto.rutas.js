module.exports = (app) => {

    const controlProducto = require('../controladores/producto.controlador');

    //metodo de la API que obtiene la lista de productos
    app.get("/productos", controlProducto.listar);

    //metodo de la API que agrega un producto
    app.post("/productos/agregar", controlProducto.agregar);

    //metodo de la API que modifica un producto
    app.post("/productos/modificar", controlProducto.modificar);

    //metodo de la API que elimina un producto
    app.delete("/productos/:id", controlProducto.eliminar);

}

