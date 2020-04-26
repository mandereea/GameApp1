// fct ffor constructing the game objects
function Game(id, title, imageUrl, description){
    this._id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
}

//adding on the game prototype a function that gives the DOM representation of the game object
//it includes the functions that add events on DELETE and EDIT buttons
Game.prototype.displayGame =   function() {
    
    const gameDiv = document.createElement('div');
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML="Delete Game";
    
    const editBtn = document.createElement('button');
    editBtn.classList.add("editBtn");
    editBtn.innerHTML="Edit Game";
    
    gameDiv.innerHTML = `<h1>${this.title}</h1>
                        <img src="${this.imageUrl}"/>
                        <p>${this.description}</p>`
    
    gameDiv.setAttribute("id",`${this._id}`);
    gameDiv.appendChild(deleteBtn);
    gameDiv.appendChild(editBtn);

    //adding events on the div's buttons
    //1.DELETE
    deleteBtn.addEventListener('click', async function(eventClickDelete){
        //removing game from DOM
        gameDiv.remove();
        //deleting on server
        await fetchApi.deleteGameOnServer(eventClickDelete.target.parentElement.getAttribute("id"));
    });

    //2.EDIT
    editBtn.addEventListener('click', function(eventClickEdit){
        //creating the editForm and adding it to the game to edit div
        const gameToEditDiv = eventClickEdit.target.parentElement;
        const editForm = createEditForm(gameToEditDiv);
        gameToEditDiv.appendChild(editForm);
        
    });
    return gameDiv;
}
