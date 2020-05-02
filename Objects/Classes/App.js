class App{
    contructor(){
    }
    //fct to display the list of games
    displayAllGames = async function(){
        //getting games from server
        const gamesFromServer = await fetchApi.getGamesList();
        
        //turning the array of games from server in an array of game objects
        const gamesList = gamesFromServer.map(gameServer => new Game(gameServer._id,
                                                                gameServer.title,
                                                                gameServer.imageUrl,
                                                                gameServer.description
                                                                )
        )
        
        //creating an array of DOM objects
        const domGamesArr = gamesList.map(game => game.displayGame());
        //creating the container and appending each game (DOM object) to it
        const container = document.querySelector('.container');
        domGamesArr.forEach((domGame => container.appendChild(domGame)));
    }
    //fct to create new game - to add on CREATE GAME button in creationForm
    createNewGame = async function(event){
        //preventing reload
        event.preventDefault();

        //saving the data from input fields as array elements
        const inputArr = validateCreationFormInput();

        //checking if the data is valid and ready to submit
        const isInputValid = inputArr.every(isValid);                         //returns true if no element is empty string
        const isReleaseDateValid = !isNaN(inputArr[5]) ? true : false;        //retuns true if releaseDate is a number

        //the logic that displays the new created game if all input is valid
        if(isInputValid && isReleaseDateValid){
            //encoding game data for server
            const urlencoded = encodeValidInput(inputArr);
            //rendering new game in DOM
            await displayNewGame(urlencoded);
            //reset form after success submit
            document.querySelector('.creationForm').reset(); 
        }
    }
    //fct to delete a game - to add on DELETE btn
    deleteGame = async function(event){
        //removing game from DOM
        event.target.parentElement.remove();
        //deleting on server
        await fetchApi.deleteGameOnServer(event.target.parentElement.getAttribute("id"));
    }
    //fct to render editForm - to add on EDIT btn
    editGame = function(event){
        const gameToEditDiv = event.target.parentElement;
        const editForm = createEditForm(gameToEditDiv);
        gameToEditDiv.appendChild(editForm);
    }
    //fct to update a game - to add on SAVE CHANGES button in editForm
    updateGame = async function(event){
        event.preventDefault();
        //sending the encoded editForm input data to the server and saving the response
        const inputArr = validateEditFormInput();           //validate for user
        const isInputValid = inputArr.every(isValid);

        if(isInputValid){                                   //validate for submit
        const updatedGame = encodeValidInput(inputArr);
        const apiResponse = await fetchApi.requestGameUpdate(event.target.getAttribute("id"), updatedGame);
        
        //updating the selected game to edit div, based on the server response
        const gameDivContainer = event.target.parentElement.parentElement.parentElement;
            
        gameDivContainer.querySelector('h1').innerHTML = apiResponse.title;
        gameDivContainer.querySelector('img').setAttribute("src", apiResponse.imageUrl);
        gameDivContainer.querySelector("p").innerHTML = apiResponse.description;

        const formElement = event.target.parentElement.parentElement;
        //removing the form from DOM
        formElement.remove();
        }
                
    }
}

const page = new App();
page.displayAllGames();
document.querySelector('.submit-btn').addEventListener('click', page.createNewGame); 