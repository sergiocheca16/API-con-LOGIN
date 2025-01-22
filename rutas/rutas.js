const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require("../data/users");
const axios = require('axios');


let characters = [];

//Login
router.get('/', async (req, res) => {
    const loginForm = `
    <form action="/login" method="post">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username" required><br>
  
      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required><br>
  
      <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">dashboard</a>
    `;

    const noLogin = `
    <a href="/search">Buscar</a>
    <form action="/logout" method="post">
        <button type="submit">Cerrar sesión</button>
    </form>
    `;

  if (req.session.token) {
    return res.send(noLogin)
  } else {
    return res.send(loginForm)
  }
})

//Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username && user.password === password);
  
    if (user) {
      const token = generateToken(user);
      req.session.token = token;
      res.redirect('/characters');
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });

//Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

//Obtener todos los personajes
router.get('/characters', verifyToken, async (req, res) => {
    try {
        const { data } = await axios.get('https://rickandmortyapi.com/api/character');
        const characters = data.results.map(({ id, name, status, species, gender, origin, image }) => ({
            id, name, status, species, gender, originName: origin.name, image
        }));
        res.json(characters);
    } catch {
        res.status(404).send('Error al obtener personajes');
    }
});

//search
router.get('/search', (req, res) => {
    res.send(`
        <form action="/characters/:name" method="post"> 
            <label for='character'>Buscar personaje: </label>
            <input type='text' id='character' name='character'>
            <button type="submit">Buscar</button>
        </form>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
        </form>
        `)
});

//Obtener personaje por nombre
router.post('/characters/:name', async (req, res) => {
    const name = req.query
    console.log(name)
    const url = `https://rickandmortyapi.com/api/character/?name=${name}`
   
    try {
        const response = await axios.get(url)
        const character = response.data.results[0]
        
        res.json(character)
    } catch {
        res.status(404).json({error: 'personaje no encontrado'})
    }
});

router.get('/characters/:name', (req, res) => {
    
})

module.exports = router;


/*const express = require('express');
const session = require('express-session');
const axios = require('axios');
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require('../data/users'); // Tu lista de usuarios

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
    if (req.session.token) {
        res.send(`
            <a href="/characters">Ver personajes</a>
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesión</button>
            </form>
        `);
    } else {
        res.send(`
            <form action="/login" method="post">
                <input name="username" placeholder="Usuario" required />
                <input type="password" name="password" placeholder="Contraseña" required />
                <button type="submit">Iniciar sesión</button>
            </form>
        `);
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.token = generateToken(user);
        res.redirect('/characters');
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/characters', verifyToken, async (req, res) => {
    try {
        const { data } = await axios.get('https://rickandmortyapi.com/api/character');
        const characters = data.results.map(({ id, name, status, species, gender, origin, image }) => ({
            id, name, status, species, gender, originName: origin.name, image
        }));
        res.json(characters);
    } catch {
        res.status(404).send('Error al obtener personajes');
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));*/
