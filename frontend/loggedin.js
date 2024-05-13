// GLOBAL VARIABLES
let currentUser = localStorage.getItem("user");
let token = sessionStorage.getItem("token"); // Spara & koppla böcker till en JWT
// ADD RELATION BETWEEN LIKED BOOKS & USER
let loggedIn = true; 

// -------------------------------------------------- // 

// GET DATA FUNCTION
let getData = async (url) => {
    let response = await axios.get(url); 
    console.log(response); 
    return response; 
}

let postData = async (url) => {
    let post = await axios.post(url); 
    
}

// GREETING FOR CURRENT USER
let greeting = (user) => {

    if (loggedIn) {
    let welcomeGreeting = document.getElementById("welcome-greeting-text"); 
    welcomeGreeting.innerHTML = `
    Welcome back ${user}! <br>
    Time to grade some books!
    `
    }
}

greeting(currentUser); 

// ----------LOG OUT FUNCTION------------- // 

let logOut = () => {
    localStorage.clear(); 
    window.location.href = "index.html";
    loggedIn = false; 
}


// RENDERA UT BÖCKERNA I APIET + KNAPP FÖR ATT GILLA BÖCKER + BÖCKER SKA KOMMA UPP SOM EN RELATION TILL USER
// http://localhost:1337/api/users?populate=deep,2 för att hitta gillade böcker - post till detta endpoint

let renderBooks = async () => {
    
    let response = await getData("http://localhost:1337/api/books?populate=*"); 
    let books = response.data.data; 

    books.forEach(book => {
 
        let bookGradingWrapper = document.getElementById("book-grading"); 
        let div = document.createElement("div"); 
        div.innerHTML = `
        <div class="book-grading-wrapper">
        <img src="http://localhost:1337${book.attributes.img.data.attributes.url}" width="auto" height="200px">
        <h2 class="book-info">
        Title: ${book.attributes.title}<br>
        Author: ${book.attributes.author}<br>
        Pages: ${book.attributes.pages}<br>
        Published: ${book.attributes.published}<br>
        <br>Grade ${book.attributes.author}'s book:
        <br>
        <br>
        <input type="range" id="book-rating" min="0" max="5">
        <br>
        <br>
        <button style="font-size:16px" class="heart-icon" id="save-book-btn">
        Save to read list <i class="fa fa-heart"></i>
        <br>
        <button id="submit-grading">Submit grading</button>
        </h2>
        </div>`
        bookGradingWrapper.append(div);
    }); 
}

renderBooks(); 


// FORTSÄTT MED ATT LÄGGA IN EVENTLISTERNER PÅ GILLAKNAPPEN + RANGE

let saveBookBtn = document.getElementById("save-book-btn"); 

saveBookBtn.addEventListener("click", async () => {

    // GÖR EN POST PÅ POPULATE DEEP MED ETT DYNAMISKT NUMMER PÅ BOKEN - ALLA BÖCKER HAR VISSA NUMMER...! 
    // Books.id. hittas på http://localhost:1337/api/books?populate=*
    // EN RELATION SKAPAS PÅ http://localhost:1337/api/users?populate=deep,2 .... 
})