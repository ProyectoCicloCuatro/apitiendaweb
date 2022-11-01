const cors = require('cors');
const express=require('express');
const app=express();
app.use(cors());



//realizar la conexion a la BD
const bd = require('./modelos/bd');
bd.conectar();

const puerto = 3020;

//Cargar librería para 'parseo' de contenido JSON
var bodyParser = require('body-parser');
app.use(express.json());

//Dejar disponibles las rutas a los métodos web
require('./rutas/pais.rutas')(app);
require('./rutas/region.rutas')(app);
require('./rutas/producto.rutas')(app);
require('./rutas/ciudad.rutas')(app);
require('./rutas/detallecompra.rutas')(app);
require('./rutas/venta.rutas')(app);

app.listen(puerto, ()=> {
    console.log(`Servicio iniciado a través de la url http://localhost:${puerto}`)
})


