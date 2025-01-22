function getCharacterInfo() {
    const characterInput = document.getElementById('characterName')
    const characterInfo = document.getElementById('characterInfo')

    const characterName = characterInput.value.toLowerCase()

    fetch (`http://localhost:3000/characters/${characterName}`)
        .then (response => response.json())
        .then (data => {
            const character = data[0]

            characterInfo.innerHTML = `
            <h2>${character.name}</h2>
            <p>${character.status}</p>
            <p>${character.species}</p>
            <p>${character.gender}</p>
            <p>${character.origin.name}</p>
            <img src="${character.image}" alt="${character.name}" />
            `
        })
        .catch (error => characterInfo.innerHTML = `<p>Imposible encontrar este personaje</p>`)
}