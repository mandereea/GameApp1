// for displaying all games in DOM
getGamesList(function(raspunsJson){
    for(let i=0; i<raspunsJson.length; i++){
        createDomGameObject(raspunsJson[i]);
    }
})

//fct for creating/rendering game in DOM
function createDomGameObject(object){
    
    const container = document.querySelector('.container');
    const gameDiv = document.createElement('div');

    gameDiv.innerHTML += `<h1>${object.title}</h1>
                        <img src="${object.imageUrl}"/>
                        <p>${object.description}</p>
                        <button class="deleteBtn" id="delete${object._id}">Delete Game</button>
                        <button class = "editBtn" id="edit${object._id}" >Edit Game</button>`;
    gameDiv.setAttribute("id", object._id)
    container.appendChild(gameDiv);

    //adding fct on buttons:
    //1 DELETE
    document.getElementById(`delete${object._id}`).addEventListener('click', function(eventClickDelete){
        //event.preventDefault();
        //console.log('delete button found');
        createDeleteRequest(eventClickDelete.target.parentElement.getAttribute("id"), function(apiR){
            console.log("raspunsul Api pt delete", apiR);
            deleteElementFromDom(eventClickDelete.target.parentElement);
        });
    });

    //2 EDIT
    document.getElementById(`edit${object._id}`).addEventListener('click', function(eventClickOnEdit){
        
        const gameToEdit = eventClickOnEdit.target.parentElement;
        //console.log(gameToEdit);
        //console.log(object);
        const updateForm = document.createElement('form');
        updateForm.classList.add("updateForm");
        updateForm.innerHTML = createEditForm(gameToEdit);

        eventClickOnEdit.target.parentElement.appendChild(updateForm);

        //3 UPDATE in updateForm
        document.getElementById(`update${gameToEdit.id}`).addEventListener('click', function(eventClickOnSaveChanges){
            
            eventClickOnSaveChanges.preventDefault();
            
            const updatedGame = updateGame(updateForm);

            createUpdateRequest(eventClickOnSaveChanges.target.getAttribute("id"), updatedGame, function(apiResponse) {
                const gameDivContainer = eventClickOnSaveChanges.target.parentElement.parentElement.parentElement;
                
                gameDivContainer.querySelector('h1').innerHTML = apiResponse.title;
                gameDivContainer.querySelector('img').setAttribute("src", apiResponse.imageUrl);
                gameDivContainer.querySelector("p").innerHTML = apiResponse.description;

                const formElement = eventClickOnSaveChanges.target.parentElement.parentElement;
                formElement.remove();
            });
        });
    });

}

//fct to colect and encode data from updateForm
function updateGame(){
        //colecting data
        const title = document.getElementById('updateTitle');
        const description = document.getElementById('updateDescription');
        const imageUrl = document.getElementById('updateImageUrl');
    
        //encoding it to send to server
        const urlencoded = new URLSearchParams();
        
        urlencoded.append("title", title.value);
        urlencoded.append("description", description.value);
        urlencoded.append("imageUrl", imageUrl.value);
        
        return urlencoded;
}
//fct to validate text input
function validateFormTextInput(input, errorMsg){
    console.log(document.querySelector(`[rel="${input.id}]"`));
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

//fct to validate release date
function validateFormDateInput(input, errMsg){
    if(isNaN(input.value) && input.value !== ""){
        displayErrorMsg(input, errMsg);
    }
}

//fct for building and displaying error message in DOM
function displayErrorMsg(element, msg) {
    element.classList.add ('inputError');
    const errorMessage = document.createElement('span');
    errorMessage.setAttribute("rel", element.id); 
    errorMessage.classList.add('errorMsg');
    errorMessage.innerText = msg;
    element.after(errorMessage);
}

//adding submit event on SUBMIT button
document.querySelector('.submit-btn').addEventListener('click', function(event) {
   
    // 1 previn reload
    event.preventDefault();

    // 2 collecting data from form
    let gTitle = document.getElementById('gameTitle');
    let gDescription = document.getElementById('gameDescription');
    let gGenre = document.getElementById('gameGenre');
    let gPublisher = document.getElementById('gamePublisher');
    let gImageUrl = document.getElementById('gameImageUrl');
    let gReleaseDate = document.getElementById('gameRelease');

    //3 validate input/display error message if error
   validateFormTextInput(gTitle, "The title is required!");
   validateFormTextInput(gDescription, "The description is required!");
   validateFormTextInput(gGenre, "The genre is required!");
   validateFormTextInput(gPublisher, "The publiser is required!"); 
   validateFormTextInput(gImageUrl, "The imageUrl is required!");
   validateFormDateInput(gReleaseDate, "The release date must be valid");

   //4 validating input for sending new game request to server
   if( gTitle.value !== "" && gDescription.value !== "" && gGenre.value !== "" && gPublisher.value !== "" && gImageUrl.value !== "" && gReleaseDate.value !== "" && !isNaN(gReleaseDate.value)){

        //encode data to send to server
        const urlencoded = new URLSearchParams();

        urlencoded.append("title", gTitle.value);
        urlencoded.append("releaseDate", gReleaseDate.value);
        urlencoded.append("genre", gGenre.value);
        urlencoded.append("publisher", gPublisher.value);
        urlencoded.append("imageUrl", gImageUrl.value);
        urlencoded.append("description", gDescription.value);
        
        //b request creating new game , create HTML object and add it to DOM
        createGameRequest(urlencoded, createDomGameObject);
        
        //c reset form after succes submit
        document.querySelector('.creationForm').reset();
   }
});
// fct for deleting el from DOM
function deleteElementFromDom(element){
    element.remove();
}
//fct to create updateForm and populate it with gameToEdit data
function createEditForm(gameToEdit){

    const title = gameToEdit.querySelector('h1').innerHTML;
    const image = gameToEdit.querySelector('img').getAttribute("src");
    const description = gameToEdit.querySelector('p').innerHTML;
    const id = gameToEdit.getAttribute("id")
    
    const editForm = `<form class="updateForm" action="" method="POST">
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
                    <button type="submit" class="update-btn" id="update${id}">Save changes</button>
                    </div>
                    </form>`;
    return editForm;
}




