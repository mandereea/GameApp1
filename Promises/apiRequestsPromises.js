const gamesUrl = "https://games-app-siit.herokuapp.com";


// requesting games list
function getGamesList(){
    return fetch(gamesUrl + "/games", {
        method:"GET"
    }).then(response => response.json());
}

//requesting to create and post new game
function createGameRequest(newGame) {
    return fetch(gamesUrl + "/games", {
            method: "POST",
            headers: {
                "Content-type":"application/x-www-form-urlencoded"
            },
            body: newGame
    }).then(newGame => newGame.json());
}    
    

//requesting game delete
function createDeleteRequest(idGameToDelete) {
    return fetch(gamesUrl + "/games/" + idGameToDelete, {
            method:"DELETE"
    }).then(response => response.text());
}

//requesting game update
function createUpdateRequest(idGameToEdit, gameToEdit) {
    return fetch(gamesUrl + "/games/" + idGameToEdit.substr(6), {
                method:"PUT",
                headers:{
                    "Content-type":"application/x-www-form-urlencoded"
                },
                body: gameToEdit
    }).then(response => response.json());
}    
    
