function FetchApi(baseUrl){
    this.baseUrl = baseUrl;
}

FetchApi.prototype.getGamesList = async function(){
    const responseServer = await fetch(`${this.baseUrl}/games`);
    const gamesArray = await responseServer.json();
    return gamesArray;
}

FetchApi.prototype.createNewGameRequest = async function(game){
    const response = await fetch(`${this.baseUrl}/games`,{
                method: "POST",
                headers:{
                    "Content-type":"application/x-www-form-urlencoded"
                },
                body:game
    });
    const newGameJson = await response.json();
    return newGameJson;
}

FetchApi.prototype.deleteGameOnServer = async function(gameId){
     await fetch(`${this.baseUrl}/games/${gameId}`, {
        method:"DELETE"
    });
}

FetchApi.prototype.requestGameUpdate  = async function(gameId, game){
    const response = await fetch(`${this.baseUrl}/games/${gameId.substr(6)}`, {
        method:"PUT",
        headers:{
            "Content-type":"application/x-www-form-urlencoded"
        },
        body:game
    });

    const gameUpdatedJson = await response.json();
    return gameUpdatedJson;
}