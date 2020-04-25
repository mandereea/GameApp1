const gamesUrl = "https://games-app-siit.herokuapp.com";

// to request the games list
function getGamesList(displayGames){
    fetch(gamesUrl + "/games", {
        method:"GET"
    }).then(function(response){
        console.log("primul GET",response)
        return response.json();
    }).then(function(responseJson){
        console.log("rez final primit la GET games list", responseJson);
        displayGames(responseJson);
    });
}

//to request creating a new game

function createGameRequest(newGame, createGame) {
    fetch(gamesUrl + "/games", {
        method: "POST",
        headers: {
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: newGame
    }).then(function(newGame){
        return newGame.json();
    }).then(function(gameJson){
        createGame(gameJson);
        console.log("jocul nou creat cu POST, primit json",gameJson);
    });
}

//to request deleting a game
function createDeleteRequest(idGameToDelete, deleteGame) {
    fetch(gamesUrl + "/games/" + idGameToDelete, {
        method:"DELETE"
    }).then(function(response){
        console.log("responseul de deleteRequest este", response);
        return response.text();
    }).then(function(responseJson){
        console.log("rspunsul json de delete este", responseJson);
        deleteGame(idGameToDelete);
    });
}

//requesting to update a game
function createUpdateRequest(idGameToEit, gameToEit, editGame) {
    fetch(gamesUrl + "/games/" + idGameToEit.substr(6), {
        method:"PUT",
        headers:{
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: gameToEit
    }).then(function(response){
        return response.json();
    }).then(function(responseJson){
        editGame(responseJson);
    });
}