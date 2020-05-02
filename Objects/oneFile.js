const fetchApi = new FetchApi("https://games-app-siit.herokuapp.com");

//fct to render the (list of) games in DOM
async function displayAllGames(){
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
displayAllGames();

//adding the submit event on SUBMIT button in create new game form
document.querySelector('.submit-btn').addEventListener('click', createNewGame); 

//fct to create new game - to add on CREATE GAME button in creationForm
async function createNewGame(event){
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
//fct for rendering new created game in Dom 
async function displayNewGame(game){

    const newGameResponse = await fetchApi.createNewGameRequest(game);
    const newGame = new Game(newGameResponse._id, newGameResponse.title, newGameResponse.imageUrl, newGameResponse.description);
    
    const newGameNode = newGame.displayGame();
   // console.log(newGameNode);
    document.querySelector('.container').appendChild(newGameNode);
}
//fct to delete a game - to add on DELETE btn
async function deleteGame(event){
    //removing game from DOM
    event.target.parentElement.remove();
    //deleting on server
    await fetchApi.deleteGameOnServer(event.target.parentElement.getAttribute("id"));
}
//fct to render editForm - to add on EDIT btn
function editGame(event){
    const gameToEditDiv = event.target.parentElement;
    const editForm = createEditForm(gameToEditDiv);
    gameToEditDiv.appendChild(editForm);
}
//fct to create the edit form, based on the game (HTMLobject) to edit
function createEditForm(gameToEdit){
    //collecting data from the game to edit HTML div
    const id = gameToEdit.getAttribute("id")
    const title = gameToEdit.querySelector('h1').innerHTML;
    const image = gameToEdit.querySelector('img').getAttribute("src");
    const description = gameToEdit.querySelector('p').innerHTML;
    
    //creating the Save Changes (update) button
    const updateBtn = createButton("update-btn", "Save Changes");
    updateBtn.setAttribute("id", `update${id}`);

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
    
    //adding (update game) event on SAVE CHANGES button
    updateBtn.addEventListener('click', page.updateGame );

    //returning editForm
    return editForm;
}
//fct to update a game - to add on SAVE CHANGES button in editForm
async function updateGame(event){
    event.preventDefault();
            //sending the encoded editForm input data to the server and saving the response
            const inputArr = validateEditFormInput();
            const isInputValid = inputArr.every(isValid);

            if(isInputValid){
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
//the buttons factory
function createButton(styleClass, btnText) {
    const button = document.createElement('button');
    button.classList.add(styleClass);
    button.innerHTML= btnText;

    return button;
}
//fct to encode valid input from forms, based on returned arrays of input elements
function encodeValidInput(inputArr){
    const urlencoded = new URLSearchParams();
 
    urlencoded.append("title", inputArr[0]);
    urlencoded.append("imageUrl", inputArr[1]);
    urlencoded.append("description", inputArr[2]);
    
    return urlencoded
 }
 //fct to collect creationForm input/ display error message
 //it returns an array of creationForm input data elements
 function validateCreationFormInput(){
     // 1 colecting the  data from the form input fields
    const gTitle = document.getElementById('gameTitle');
    const gDescription = document.getElementById('gameDescription');
    const gGenre = document.getElementById('gameGenre');
    const gPublisher = document.getElementById('gamePublisher');
    const gImageUrl = document.getElementById('gameImageUrl');
    const gReleaseDate = document.getElementById('gameRelease');
 
    //2 validating input / display error message if error  (validation for user)
    validateFormTextInput(gTitle, "title");
    validateFormTextInput(gDescription, "description");
    validateFormTextInput(gGenre, "genre");
    validateFormTextInput(gPublisher, "publiser"); 
    validateFormTextInput(gImageUrl, "imageUrl");
    validateFormDateInput(gReleaseDate, "release date");
 
     //3 saving input data in an array and returning it
    inputArr = [gTitle.value, gImageUrl.value, gDescription.value, gGenre.value, gPublisher.value, gReleaseDate.value]
    return inputArr
 }
 //fct to collect editForm input/ display error message
 //it returns an array of editForm input data elements
 function validateEditFormInput(){
     //1 collecting data from the updateForm
      const title = document.getElementById('updateTitle');
      const description = document.getElementById('updateDescription');
      const imageUrl = document.getElementById('updateImageUrl');
     
      //2 check input data / display err msg    - validation for user
      validateFormTextInput(title, "title");
      validateFormTextInput(imageUrl, "imageUrl");
      validateFormTextInput(description, "description");
 
     inputArr = [title.value, imageUrl.value, description.value]
     return inputArr;
 }
 //fct to check if (arr) element is empty string
 function isValid(element){
      return element !== ""? true : false ;
 }
 //functions to check input data and display error message
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
     if(isNaN(input.value) || input.value == ""){
          displayErrorMsg(input, errMsg);
     }
 }
 function displayErrorMsg(element, msg) {
     element.classList.add ('inputError');
     const errorMessage = document.createElement('span');
     errorMessage.setAttribute("rel", element.id); 
     errorMessage.classList.add('errorMsg');
     errorMessage.innerText = `A valid ${msg} is required!`;
     element.after(errorMessage);
 }
 



