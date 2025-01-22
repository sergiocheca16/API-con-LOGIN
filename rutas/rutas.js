const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require("../data/users");
const axios = require('axios');

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
        <form action="/characters" method="post"> 
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
router.post('/characters', verifyToken, async (req, res) => {
    const name = req.body.character;
    //console.log(name)
    const url = `https://rickandmortyapi.com/api/character/?name=${name}`

    try {
        const response = await axios.get(url)
        const characters = response.data.results

        const characterData = characters.map(character => ({
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            gender: character.gender,
            origin: character.origin.name,
            image: character.image
        }));
        
        res.json(characterData)
    } catch {
        res.status(404).json({error: 'personaje no encontrado'})
    }
});

module.exports = router;
