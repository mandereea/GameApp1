let gamesUrl = "https://games-world.herokuapp.com";

// pentru a cere lista de jocuri
function getGamesList(afiseazaJocuri){
    fetch(gamesUrl + "/games", {
        method:"GET"
    }).then(function(raspuns){
        console.log("primul GET",raspuns)
        return raspuns.json();
    }).then(function(raspunsJson){
        console.log("rez final primit la GET games list", raspunsJson);
        afiseazaJocuri(raspunsJson);
    });
}

//pentru a cere sa facem un nou joc nou

function createGameRequest(jocNou, creeazaJocul) {
    fetch(gamesUrl + "/games", {
        method: "POST",
        headers: {
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: jocNou
    }).then(function(jocNou){
        return jocNou.json();
    }).then(function(jocJson){
        creeazaJocul(jocJson);
        console.log("jocul nou creat cu POST, primit json",jocJson);
    });
}

//pentru a cere sa stergem un joc
function createDeleteRequest(IdJocDeSters, stergeJocul) {
    fetch(gamesUrl + "/games/" + IdJocDeSters, {
        method:"DELETE"
    }).then(function(raspuns){
        console.log("raspunsul de deleteRequest este", raspuns);
        return raspuns.text();
    }).then(function(raspunsJson){
        console.log("rspunsul json de delete este", raspunsJson);
        stergeJocul(IdJocDeSters);
    });
}

//pentru a cere sa modificam un joc
function createUpdateRequest(IdJocDeEditat, jocDeEditat, editeazaJocul) {
    fetch(gamesUrl + "/games/" + IdJocDeEditat.substr(1), {
        method:"PUT",
        headers:{
            "Content-type":"application/x-www-form-urlencoded"
        },
        body: jocDeEditat
    }).then(function(raspuns){
        return raspuns.json();
    }).then(function(raspunsJson){
        editeazaJocul(raspunsJson);
    });
}