const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Config = require('./assets/config.json');
const cors = require('cors');
const fs = require('fs');

// var fileupload = require("express-fileupload");
// app.use(fileupload());
// app.use('/multimedia', express.static('./Inspeccion'));

app.use('/node_modules', express.static('./node_modules'));
app.use('/views', express.static('./views'));
app.use('/controllers', express.static('./controllers'));
app.use('/css', express.static('./css'));
app.use('/directives', express.static('./directives'));
app.use('/filters', express.static('./filters'));
app.use('/fonts', express.static('./fonts'));
app.use('/images', express.static('./images'));
app.use('/js', express.static('./js'));
app.use('/services', express.static('./services'));
app.use('/assets', express.static('./assets'));


const path = require('path');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors());

app.get('/actaAprobada', (req, res, next) => {
    // res.send('hola')
    res.render('./aprobacion/actaAprobada.html');
});
app.get('/default', (req, res, next) => {
    res.render('./aprobacion/default.html');
});
app.get('/aprobacion', (req, res, next) => {
    res.render('./aprobacion/aprobacion.html');
});

app.listen(Config.portApplication, function() {
    console.info(`Server listening on port ${Config.portApplication}!`);
});