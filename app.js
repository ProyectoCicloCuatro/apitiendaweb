const cors = require('cors');
const express=require('express');
const morgan = require('morgan');

const app=express();
app.use(cors());



//realizar la conexion a la BD
const bd = require('./modelos/bd');
bd.conectar();



//Cargar librería para 'parseo' de contenido JSON
var bodyParser = require('body-parser');
app.use(express.json());
app.use(morgan('tiny'));

//Dejar disponibles las rutas a los métodos web
/*
    require('./rutas/pais.rutas')(app);
    require('./rutas/region.rutas')(app);
    require('./rutas/ciudad.rutas')(app);
*/
require('./rutas/cliente.rutas')(app);
require('./rutas/producto.rutas')(app);
require('./rutas/venta.rutas')(app);
require('./rutas/usuario.rutas')(app);


const puerto = 3020;
app.listen(puerto, ()=> {
    console.log(`Servicio iniciado a través de la url http://localhost:${puerto}`)
})


