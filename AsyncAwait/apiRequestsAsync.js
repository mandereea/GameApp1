const gamesUrl = "https://games-app-siit.herokuapp.com";

async function getGamesList(){
    const response = await fetch(gamesUrl+"/games");
    const arrayGames = response.json();
    return arrayGames;
}

async function createGameRequest(newGame) {
    const gameResponse = await fetch(gamesUrl + "/games", {
        method: "POST",
        headers: {
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: newGame
    });
    const newGameJson = gameResponse.json();

    return newGameJson;
}

//pentru a cere sa stergem un joc
async function createDeleteRequest(idGameToDelete) {
    const deleteResponse = await fetch(gamesUrl + "/games/" + idGameToDelete, {
        method:"DELETE"
    })
    //console.log(deleteResponse);
    //console.log(deleteResponse.text());
}    

//pentru a cere sa modificam un joc
async function createUpdateRequest(idGameToEdit, gameToEdit) {
    const updateResponse = await fetch(gamesUrl + "/games/" + idGameToEdit.substr(6), {
        method:"PUT",
        headers:{
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: gameToEdit
    })
    return updateResponse.json();
}
    