const express = require('express');
const cors = require('cors');
var app = express();

const HotelesRutas = require('./src/rutas/cursos.routes')
const chatRutas = require('./src/rutas/chat.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
    
app.use('/api', HotelesRutas, chatRutas);


module.exports = app;