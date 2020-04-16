let gamesUrl = "https://games-world.herokuapp.com";


// pentru a cere lista de jocuri
function getGamesList(){
    return fetch(gamesUrl + "/games", {
        method:"GET"
    }).then(raspuns => raspuns.json());
}

//pentru a cere sa facem un nou joc nou
function createGameRequest(newGame) {
    return fetch(gamesUrl + "/games", {
            method: "POST",
            headers: {
                "Content-type":"application/x-www-form-urlencoded"
            },
            body: newGame
    }).then(newGame => newGame.json());
}    
    

//pentru a cere sa stergem un joc
function createDeleteRequest(IdJocDeSters) {
    return fetch(gamesUrl + "/games/" + IdJocDeSters, {
            method:"DELETE"
    }).then(raspuns => raspuns.text());
}

//pentru a cere sa modificam un joc
function createUpdateRequest(IdJocDeEditat, jocDeEditat) {
    return fetch(gamesUrl + "/games/" + IdJocDeEditat.substr(1), {
                method:"PUT",
                headers:{
                    "Content-type":"application/x-www-form-urlencoded"
                },
                body: jocDeEditat
    }).then(raspuns => raspuns.json());
}    
    
