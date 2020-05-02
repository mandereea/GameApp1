class Game{
    constructor(id, title, imageUrl, description){
        this._id= id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
    }
    displayGame(){
        const gameDiv = document.createElement('div');

        const deleteBtn = createButton("deleteBtn","Delete Game");
        const editBtn = createButton("editBtn", "Edit Game");
        
        gameDiv.innerHTML = `<h1>${this.title}</h1>
                            <img src="${this.imageUrl}"/>
                            <p>${this.description}</p>`
        
        gameDiv.setAttribute("id",`${this._id}`);
       //adding buttons
        gameDiv.appendChild(deleteBtn);
        gameDiv.appendChild(editBtn);
    
        //adding events on the buttons
        deleteBtn.addEventListener('click', page.deleteGame);    //DELETE
        editBtn.addEventListener('click', page.editGame);        //EDIT
        return gameDiv;
    }
}
 

