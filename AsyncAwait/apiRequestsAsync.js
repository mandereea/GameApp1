let gamesUrl = "https://games-world.herokuapp.com";

async function getGamesList(){
    const response = await fetch(gamesUrl+"/games");
    const arrayGames = response.json();
    return arrayGames;
}

async function createGameRequest(jocNou) {
    const gameResponse = await fetch(gamesUrl + "/games", {
        method: "POST",
        headers: {
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: jocNou
    });
    const newGameJson = gameResponse.json();

    return newGameJson;
}

//pentru a cere sa stergem un joc
async function createDeleteRequest(IdJocDeSters) {
    const deleteResponse = await fetch(gamesUrl + "/games/" + IdJocDeSters, {
        method:"DELETE"
    })
    console.log(deleteResponse);
    console.log(deleteResponse.text());
    
}    

//pentru a cere sa modificam un joc
async function createUpdateRequest(IdJocDeEditat, jocDeEditat) {
    const updateResponse = await fetch(gamesUrl + "/games/" + IdJocDeEditat.substr(1), {
        method:"PUT",
        headers:{
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: jocDeEditat
    })

    return updateResponse.json();
}
    
    
    
//     .then(function(raspuns){
//         return raspuns.json();
//     }).then(function(raspunsJson){
//         editeazaJocul(raspunsJson);
//     });
// }