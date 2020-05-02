class FetchApi{
    constructor(baseUrl){
    this.baseUrl = baseUrl;
    }
    
    getGamesList = async function(){
        const responseServer = await fetch(`${this.baseUrl}/games`);
        const gamesArray = await responseServer.json();
        return gamesArray;
    }

    createNewGameRequest = async function(game){
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

    deleteGameOnServer = async function(gameId){
        await fetch(`${this.baseUrl}/games/${gameId}`, {
            method:"DELETE"
        });
    }

    requestGameUpdate  = async function(gameId, game){
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
}