const fetchApi = new FetchApi("https://games-app-siit.herokuapp.com");


async function displayAllGames(){
    //getting games from server
    const gamesFromServer = await fetchApi.getGamesList();
    //creating an array for storing the game objects
    const gamesList = [];
    //iterating through games from server, creating game objects and sending them to the games list array 
    for(let i=0; i < gamesFromServer.length; i++){
        const gameServer = gamesFromServer[i];
        const game = new Game(gameServer._id,
                              gameServer.title,
                              gameServer.imageUrl,
                              gameServer.description
        );
        gamesList.push(game);
    }
    //iterating through games list array and:
    for(let i=0; i < gamesList.length; i++){
        //rendering each game and adding it to the DOM
        const gameNode = gamesList[i].displayGame();
        
        const container = document.querySelector('.container');
        container.appendChild(gameNode);
        
        //adding functionality on buttons:
        //1.DELETE
        document.getElementById(`delete${gameNode.id}`).addEventListener('click', async function(eventClickDelete){
            //selecting the game to delete in DOM
            const gameDiv = eventClickDelete.target.parentElement;
            //removing game from DOM
            gameDiv.remove();
            //deleting on server
            await fetchApi.deleteGameOnServer(eventClickDelete.target.parentElement.getAttribute("id"));
        });

        //2.EDIT
        document.getElementById(`edit${gameNode.id}`).addEventListener('click', function(eventClickEdit){
            //selecting the game to edit - HTML obj
            const gameToEditDiv = eventClickEdit.target.parentElement;
            
            //creating the updateForm, adding stye, populating imput fields with data from gameToEditDiv
            const updateForm = document.createElement('form');
            updateForm.classList.add('updateForm');
            updateForm.innerHTML = createEditForm(gameToEditDiv);
           
            //appending it to the selected game div
            eventClickEdit.target.parentElement.appendChild(updateForm);
            
            //3 SAVE CHANGES in updateForm
            document.getElementById(`update${gameToEditDiv.id}`).addEventListener('click', async function(eventClickSaveChanges){
                
                eventClickSaveChanges.preventDefault();

                const updatedGame = encodeUpdateFormInput();
                const apiResponse = await fetchApi.requestGameUpdate(eventClickSaveChanges.target.getAttribute("id"), updatedGame);
                
                const gameDivContainer = eventClickSaveChanges.target.parentElement.parentElement.parentElement;
                    
                gameDivContainer.querySelector('h1').innerHTML = apiResponse.title;
                gameDivContainer.querySelector('img').setAttribute("src", apiResponse.imageUrl);
                gameDivContainer.querySelector("p").innerHTML = apiResponse.description;
    
                const formElement = eventClickSaveChanges.target.parentElement.parentElement;
                
                formElement.remove();
            });
        });
    }
}
displayAllGames();

//adding the submit event on SUBMIT button in create new game form
document.querySelector('.submit-btn').addEventListener('click', function(event) {
   
    // 1 preventing reload
    event.preventDefault();

    // 2 colecting the  data from the form input fields
    const gTitle = document.getElementById('gameTitle');
    const gDescription = document.getElementById('gameDescription');
    const gGenre = document.getElementById('gameGenre');
    const gPublisher = document.getElementById('gamePublisher');
    const gImageUrl = document.getElementById('gameImageUrl');
    const gReleaseDate = document.getElementById('gameRelease');

    //3 validating input / display error message if error
   validateFormTextInput(gTitle, "The title is required!");
   validateFormTextInput(gDescription, "The description is required!");
   validateFormTextInput(gGenre, "The genre is required!");
   validateFormTextInput(gPublisher, "The publiser is required!"); 
   validateFormTextInput(gImageUrl, "The imageUrl is required!");
   validateFormDateInput(gReleaseDate, "The release date must be valid");

   //4 validating input for sending to server
   if( gTitle.value !== "" && gDescription.value !== "" && gGenre.value !== "" && gPublisher.value !== "" && gImageUrl.value !== "" && gReleaseDate.value !== "" && !isNaN(gReleaseDate.value)){

        //preparing the encoded game to send to the server
        const urlencoded = new URLSearchParams();

        urlencoded.append("title", gTitle.value);
        urlencoded.append("releaseDate", gReleaseDate.value);
        urlencoded.append("genre", gGenre.value);
        urlencoded.append("publisher", gPublisher.value);
        urlencoded.append("imageUrl", gImageUrl.value);
        urlencoded.append("description", gDescription.value);
        
        //rendering new game in Dom
        displayNewGame(urlencoded);
       
        //c reset the form, after successful submit
        document.querySelector('.creationForm').reset();    
   }
});




