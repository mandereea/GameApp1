async function afiseazaJocuri(){
    const gamesList =  await getGamesList();
    console.log(gamesList);
  
    for(let i=0; i< gamesList.length; i++){
        createDomGameObject(gamesList[i]);
    }
}
afiseazaJocuri();

function createDomGameObject(object){
    
    let container = document.querySelector('.container');
    let gameDiv = document.createElement('div');

    gameDiv.innerHTML += `<h1>${object.title}</h1>
                        <img src="${object.imageUrl}"
                        <p>${object.description}</p>
                        <button class="deleteBtn" id="${object._id}">Delete Game</button>
                        <button class = "editBtn" id="0${object._id}" >Edit Game</button>`;
    
    container.appendChild(gameDiv);

    //pentru a adauga functionalitate pe butonul de:
    //1 DELETE
    document.getElementById(`${object._id}`).addEventListener('click', async function(event){
        //event.preventDefault();
        //console.log('delete button found');
         createDeleteRequest(event.target.getAttribute("id"));
        
            //console.log("raspunsul Api pt delete", apiR);
            deleteElementFromDom(event.target.parentElement);
    
    });

    //2 EDIT
    document.getElementById(`0${object._id}`).addEventListener('click', function(event){
        //event.preventDefault();
        const updateForm = document.createElement('div');
        updateForm.innerHTML += createEditForm(object);
        gameDiv.appendChild(updateForm);
        updateForm.parentElement.classList.add('to-update');
        
        //3 UPDATE in updateForm
        document.getElementById(`1${object._id}`).addEventListener('click', async function(event){
            
            event.preventDefault();
            //console.log('gasit buton update din form, victory!', `1${object._id}`);

            const jocUpdated = updateGame(object);
            const apiResponse = await createUpdateRequest(event.target.getAttribute("id"), jocUpdated);

                document.querySelector('.to-update').innerHTML =  
                `<h1>${apiResponse.title}</h1>
                <img src="${apiResponse.imageUrl}"
                <p>${apiResponse.description}</p>
                <button class="deleteBtn" id="${apiResponse._id}">Delete Game</button>
                <button class = "editBtn" id="0${apiResponse._id}" >Edit Game</button>`;

            
                document.querySelector('.to-update').classList.remove('to-update');
        });
    })

}

//functia ce-mi da jocUpdated de trimis la API
function updateGame(obj){
    
    //1 colectez noile date din editForm in obj
    obj.title = document.getElementById('updateTitle');
    obj.description = document.getElementById('updateDescription');
    obj.imageUrl = document.getElementById('updateImageUrl');

    //2 le encodez in ordine pentru API request
    const urlencoded = new URLSearchParams();
    
    urlencoded.append("title", obj.title.value);
    urlencoded.append("description", obj.description.value);
    urlencoded.append("imageUrl", obj.imageUrl.value);
    
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

// adaug functionalitate pe butonul de submit 
document.querySelector('.submit-btn').addEventListener('click', function(event) {
   
    // 1 previn reload
    event.preventDefault();

    // 2 colectez datele din form
    let gTitle = document.getElementById('gameTitle');
    let gDescription = document.getElementById('gameDescription');
    let gGenre = document.getElementById('gameGenre');
    let gPublisher = document.getElementById('gamePublisher');
    let gImageUrl = document.getElementById('gameImageUrl');
    let gReleaseDate = document.getElementById('gameRelease');

    //3 le validez pt a afisa msg de eroare (sau nu, dupa caz)  folosind functiile create mai sus
   validateFormTextInput(gTitle, "The title is required!");
   validateFormTextInput(gDescription, "The description is required!");
   validateFormTextInput(gGenre, "The genre is required!");
   validateFormTextInput(gPublisher, "The publiser is required!"); 
   validateFormTextInput(gImageUrl, "The imageUrl is required!");
   validateFormDateInput(gReleaseDate, "The release date must be valid");

   //4 le validez pentru a crea noul joc
   if( gTitle.value !== "" && gDescription.value !== "" && gGenre.value !== "" && gPublisher.value !== "" && gImageUrl.value !== "" && gReleaseDate.value !== "" && !isNaN(gReleaseDate.value)){

        //a creez jocNou ce va fi trimis in request la api encodat(append in bucata de query a url)
        const urlencoded = new URLSearchParams();

        urlencoded.append("title", gTitle.value);
        urlencoded.append("releaseDate", gReleaseDate.value);
        urlencoded.append("genre", gGenre.value);
        urlencoded.append("publisher", gPublisher.value);
        urlencoded.append("imageUrl", gImageUrl.value);
        urlencoded.append("description", gDescription.value);
        
        //b fac requestul si folosesc raspunsul sa creez/afisez jocul in Dom 
        async function afiseazaJocNou() {
            const newGameJson = await createGameRequest(urlencoded) 
            createDomGameObject(newGameJson);
        }
        afiseazaJocNou();
        //c fac reset la form, dupa success submit
        document.querySelector('.creationForm').reset();
   }
});



// functia pentru sters element din Dom
function deleteElementFromDom(element){
    element.remove();
}

//functia de creat editForm pentru a fi adaugata apoi in Dom
function createEditForm(gameToEdit){
    
    const editForm = `<form class="updateForm" action="" method="POST">
                    <div class="element-wrapper">
                    <label for="updateTitle">Edit Title</label>
                    <input type="text" id="updateTitle" value="${gameToEdit.title}" />
                    </div>
                    <div class="element-wrapper">
                    <label for="updateImageUrl">Edit Image URL</label>
                    <input type="text" id="updateImageUrl" value="${gameToEdit.imageUrl}"/>
                    </div>
                    <div class="element-wrapper">
                    <label for="updateDescription">Edit Description</label>
                    <textarea id="updateDescription" rows="5">${gameToEdit.description}</textarea>
                    </div>
                    <div class="buttons-wrapper">
                    <button class="cancel-btn">Cancel</button>
                    <button type="submit" class="update-btn" id="1${gameToEdit._id}">Save changes</button>
                    </div>
                    </form>`;
    return editForm;
}


