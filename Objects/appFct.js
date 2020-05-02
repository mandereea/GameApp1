const fetchApi = new FetchApi("https://games-app-siit.herokuapp.com");
 

//fct for rendering new created game in Dom 
async function displayNewGame(game){

    const newGameResponse = await fetchApi.createNewGameRequest(game);
    const newGame = new Game(newGameResponse._id, newGameResponse.title, newGameResponse.imageUrl, newGameResponse.description);
    
    const newGameNode = newGame.displayGame();
   // console.log(newGameNode);
    document.querySelector('.container').appendChild(newGameNode);
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
 



