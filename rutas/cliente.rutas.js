module.exports = (app) => {

    const controlador = require("../controladores/cliente.controlador");
    const autenticacion = require("../controladores/autenticacion.controlador");

    app.get("/clientes", autenticacion.autenticarToken, controlador.listar);
    app.get("/clientes/:id", controlador.obtener);
    app.post("/clientes", controlador.agregar);
    app.put("/clientes", controlador.modificar);
    app.delete("/clientes/:id", controlador.eliminar);

}