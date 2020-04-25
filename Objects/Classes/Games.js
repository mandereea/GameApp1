// fct ffor constructing the game objects
function Game(id, title, imageUrl, description){
    this._id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
}

//adding on the game prototype a function that gives the DOM representation of the game object
Game.prototype.displayGame =   function() {
    
    const gameDiv = document.createElement('div');
    
    gameDiv.innerHTML = `<h1>${this.title}</h1>
                        <img src="${this.imageUrl}"/>
                        <p>${this.description}</p>
                        <button class="deleteBtn" id="delete${this._id}">Delete Game</button>
                        <button class = "editBtn" id="edit${this._id}" >Edit Game</button>`;
    
    gameDiv.setAttribute("id",`${this._id}`);
    
    return gameDiv;
}
