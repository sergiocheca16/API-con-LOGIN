const express = require('express');
const axios = require('axios');
//const cors = require('cors');
const session = require('express-session');
const hashedSecret = require('./crypto/config');
const router = require('./rutas/rutas');

const app = express();
const PORT = 3000;

//app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: hashedSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Express esta escuchando en el puerto http://localhost:${PORT}`)
});