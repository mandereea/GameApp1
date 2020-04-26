const fetchApi = new FetchApi("https://games-app-siit.herokuapp.com");

// fct to render the (list of) games in DOM
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
    //iterating through games list array and
    for(let i=0; i < gamesList.length; i++){
        //rendering each game and adding it to the DOM
        const gameNode = gamesList[i].displayGame();
        
        const container = document.querySelector('.container');
        container.appendChild(gameNode);
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

//Validate form helper functions
function validateFormTextInput(input, errorMsg){
    //console.log(document.querySelector(`[rel="${input.id}]"`));
    if(input.value === "") {
        if(!document.querySelector('[rel="' +input.id + '"]')){
            displayErrorMsg(input, errorMsg);
        }
    }else{
        if(document.querySelector('[rel="' +input.id + '"]')){
            document.querySelector('[rel="' +input.id + '"]').remove();
            input.classList.remove('inputError');
            console.log('the error is erased'); 
        }
    }
}

function validateFormDateInput(input, errMsg){
    if(isNaN(input.value) && input.value !== ""){
        displayErrorMsg(input, errMsg);
    }
}

function displayErrorMsg(element, msg) {
    element.classList.add ('inputError');
    const errorMessage = document.createElement('span');
    errorMessage.setAttribute("rel", element.id); 
    errorMessage.classList.add('errorMsg');
    errorMessage.innerText = msg;
    element.after(errorMessage);
}

//fct for rendering new created game in Dom 
async function displayNewGame(game){

    const newGameResponse = await fetchApi.createNewGameRequest(game);
    const newGame = new Game(newGameResponse._id, newGameResponse.title, newGameResponse.imageUrl, newGameResponse.description);
    
    const newGameNode = newGame.displayGame();
   // console.log(newGameNode);
    document.querySelector('.container').appendChild(newGameNode);
}

//fct for deleting game from dom
function deleteDomElement(element){
    element.remove();
}

//fct to create the edit form, based on the game (HTMLobject) to edit
//it includes the fct that adds event on SAVE CHANGES (update) button
function createEditForm(gameToEdit){
    //collecting data from the game to edit HTML div
    const id = gameToEdit.getAttribute("id")
    const title = gameToEdit.querySelector('h1').innerHTML;
    const image = gameToEdit.querySelector('img').getAttribute("src");
    const description = gameToEdit.querySelector('p').innerHTML;
    
    //saving the SAVE CHANGES (update) button in a constant, to later add event on it
    const updateBtn = document.createElement('button');
    updateBtn.classList.add("update-btn");
    updateBtn.setAttribute("id", `update${id}`);
    updateBtn.innerHTML="Save Changes";
    
    //creating the editForm,styling it and populating it with data from the game to edit div
    const editForm = document.createElement('form');
    editForm.classList.add('updateForm');
    editForm.innerHTML = `<form class="updateForm" action="" method="POST">
                    <div class="element-wrapper">
                    <label for="updateTitle">Edit Title</label>
                    <input type="text" id="updateTitle" value="${title}"/>
                    </div>
                    <div class="element-wrapper">
                    <label for="updateImageUrl">Edit Image URL</label>
                    <input type="text" id="updateImageUrl" value="${image}"/>
                    </div>
                    <div class="element-wrapper">
                    <label for="updateDescription">Edit Description</label>
                    <textarea id="updateDescription" rows="5">${description}</textarea>
                    </div>
                    <div class="buttons-wrapper">
                    <button class="cancel-btn">Cancel</button>
                    </div>
                    </form>`;
    //appending the button to the editForm
    editForm.lastElementChild.appendChild(updateBtn);
    
    //adding event on SAVE CHANGES button
        updateBtn.addEventListener('click', async function(eventClickSaveChanges){
            
            eventClickSaveChanges.preventDefault();
            //sending the encoded editForm input data to the server and saving the response
            const updatedGame = encodeUpdateFormInput();
            const apiResponse = await fetchApi.requestGameUpdate(eventClickSaveChanges.target.getAttribute("id"), updatedGame);
            
            //updating the selected game to edit div, based on the server response
            const gameDivContainer = eventClickSaveChanges.target.parentElement.parentElement.parentElement;
                
            gameDivContainer.querySelector('h1').innerHTML = apiResponse.title;
            gameDivContainer.querySelector('img').setAttribute("src", apiResponse.imageUrl);
            gameDivContainer.querySelector("p").innerHTML = apiResponse.description;

            const formElement = eventClickSaveChanges.target.parentElement.parentElement;
            //removing the form from DOM
            formElement.remove();
        });
    
    return editForm;
}
//function to colect and encode updated data from editForm
function encodeUpdateFormInput(){
    //1 collecting data from the updateForm
    const title = document.getElementById('updateTitle');
    const description = document.getElementById('updateDescription');
    const imageUrl = document.getElementById('updateImageUrl');

    //2 encoding it to send to server
    const urlencoded = new URLSearchParams();
    
    urlencoded.append("title", title.value);
    urlencoded.append("description", description.value);
    urlencoded.append("imageUrl", imageUrl.value);
    
    return urlencoded;
}



