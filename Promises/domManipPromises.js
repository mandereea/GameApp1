// pentru a afisa lista de jocuri
getGamesList().then (function(raspunsJson){
    for(let i=0; i<raspunsJson.length; i++){
        createDomGameObject(raspunsJson[i]);
    }
});

//pentru a crea/afisa in dom jocul nou creat
function createDomGameObject(object){
    
    let container = document.querySelector('.container');
    let gameDiv = document.createElement('div');

    gameDiv.innerHTML += `<h1>${object.title}</h1>
                        <img src="${object.imageUrl}"/>
                        <p>${object.description}</p>
                        <button class="deleteBtn" id="delete${object._id}">Delete Game</button>
                        <button class = "editBtn" id="edit${object._id}" >Edit Game</button>`;
    gameDiv.setAttribute("id",object._id);
    container.appendChild(gameDiv);

    //adding events on buttons:
    //1 DELETE
    document.getElementById(`delete${object._id}`).addEventListener('click', function(eventClickDelete){
        
        createDeleteRequest(eventClickDelete.target.parentElement.getAttribute("id")).then(function(){
            //console.log("raspunsul Api pt delete", apiR);
            deleteElementFromDom(eventClickDelete.target.parentElement);
        });
    });

    //2 EDIT
    document.getElementById(`edit${object._id}`).addEventListener('click', function(eventClickEdit){
        
        const gameToEdit = eventClickEdit.target.parentElement;
        
        const updateForm = document.createElement('form');
        updateForm.classList.add('updateForm');
        updateForm.innerHTML = createEditForm(gameToEdit);
        
        eventClickEdit.target.parentElement.appendChild(updateForm);
        

        //3 SAVE CHANGES in updateForm
        document.getElementById(`update${gameToEdit.id}`).addEventListener('click', function(eventClickSaveChanges){
            
            eventClickSaveChanges.preventDefault();
            const updatedGame = updateGame();

            createUpdateRequest(eventClickSaveChanges.target.getAttribute("id"), updatedGame).then (function(apiResponse) {
                
                const gameDivContainer = eventClickSaveChanges.target.parentElement.parentElement.parentElement;
                
                gameDivContainer.querySelector('h1').innerHTML = apiResponse.title;
                gameDivContainer.querySelector('img').setAttribute("src", apiResponse.imageUrl);
                gameDivContainer.querySelector("p").innerHTML = apiResponse.description;

                const formElement = eventClickSaveChanges.target.parentElement.parentElement;
                formElement.remove();
                
            });
        });
    });
}

//fct to collect and encode data from updateForm fields, for sending to server
function updateGame(){
    const title = document.getElementById('updateTitle');
    const description = document.getElementById('updateDescription');
    const imageUrl = document.getElementById('updateImageUrl');

    //2 le encodez in ordine pentru API request
    const urlencoded = new URLSearchParams();
    
    urlencoded.append("title", title.value);
    urlencoded.append("description", description.value);
    urlencoded.append("imageUrl", imageUrl.value);
    
    return urlencoded;
}

//functia pt validare input text
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

//functia pentru a valida release date
function validateFormDateInput(input, errMsg){
    if(isNaN(input.value) && input.value !== ""){
        displayErrorMsg(input, errMsg);
    }
}

//pentru a construi si afisa mesajul de eroare in dom
function displayErrorMsg(element, msg) {
    element.classList.add ('inputError');
    const errorMessage = document.createElement('span');
    errorMessage.setAttribute("rel", element.id); 
    errorMessage.classList.add('errorMsg');
    errorMessage.innerText = msg;
    element.after(errorMessage);
}

// adding event on SUBMIT button in creation form
document.querySelector('.submit-btn').addEventListener('click', function(event) {
   
    // 1 previn reload
    event.preventDefault();

    // 2 colecting data from form
    let gTitle = document.getElementById('gameTitle');
    let gDescription = document.getElementById('gameDescription');
    let gGenre = document.getElementById('gameGenre');
    let gPublisher = document.getElementById('gamePublisher');
    let gImageUrl = document.getElementById('gameImageUrl');
    let gReleaseDate = document.getElementById('gameRelease');

    //3 validating/displaying error msg if error
   validateFormTextInput(gTitle, "The title is required!");
   validateFormTextInput(gDescription, "The description is required!");
   validateFormTextInput(gGenre, "The genre is required!");
   validateFormTextInput(gPublisher, "The publiser is required!"); 
   validateFormTextInput(gImageUrl, "The imageUrl is required!");
   validateFormDateInput(gReleaseDate, "The release date must be valid");

   //4 validating data for/then encoding it to send request to server
   if( gTitle.value !== "" && gDescription.value !== "" && gGenre.value !== "" && gPublisher.value !== "" && gImageUrl.value !== "" && gReleaseDate.value !== "" && !isNaN(gReleaseDate.value)){

        //a encoding
        const urlencoded = new URLSearchParams();

        urlencoded.append("title", gTitle.value);
        urlencoded.append("releaseDate", gReleaseDate.value);
        urlencoded.append("genre", gGenre.value);
        urlencoded.append("publisher", gPublisher.value);
        urlencoded.append("imageUrl", gImageUrl.value);
        urlencoded.append("description", gDescription.value);
        
        //b making server request and rendering new game in DOM
        createGameRequest(urlencoded).then(createDomGameObject);
        
        //c reset form, after success submit
        document.querySelector('.creationForm').reset();
   }
});

// fct for deleting DOM element
function deleteElementFromDom(element){
    element.remove();
}

//fct to create updateForm 
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


