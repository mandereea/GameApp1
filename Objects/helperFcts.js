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
    console.log(newGameNode);
    document.querySelector('.container').appendChild(newGameNode);
}

//fct for deleting game from dom
function deleteDomElement(element){
    element.remove();
}

//fct to create the edit form, based on the game (HTMLobject) to edit.
function createEditForm(gameToEdit){

    const id = gameToEdit.getAttribute("id")
    const title = gameToEdit.querySelector('h1').innerHTML;
    const image = gameToEdit.querySelector('img').getAttribute("src");
    const description = gameToEdit.querySelector('p').innerHTML;
    
    
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
//function to colect and encode data from updateForm
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

