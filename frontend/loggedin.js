// GLOBAL VARIABLES
let currentUser = localStorage.getItem("user");
let token = sessionStorage.getItem("token"); // Spara & koppla böcker till en JWT
// ADD RELATION BETWEEN LIKED BOOKS & USER
let loggedIn = true; 

console.log("Current user:", currentUser); 
// -------------------------------------------------- // 

// GET DATA FUNCTION
let getData = async (url) => {
    let response = await axios.get(url); 
    console.log(response); 
    return response; 
}

let currentTheme = async () => {

    let data = await getData("http://localhost:1337/api/theme?populate=*"); 
    let newData = data.data.data;
    let bg = document.getElementById("book-wrapper");
  
    if(newData.attributes.theme === "summer-theme") { 
      bg.style.backgroundImage = "url('Images/summer-theme.jpg')";
      document.body.style.background = "#fddc95";
  
    } else if (newData.attributes.theme === "sea-theme") {
      bg.style.backgroundImage = "url('Images/sea-theme.jpg')"; 
      document.body.style.background = "#C7EAEE"; 
    
    } else {
      bg.style.backgoundImage = "url('Images/paper-bg.jpg')";
      document.body.style.background = "#FFE3E3"; 
    }; 
  
  }
  
  currentTheme(); 


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
        <button style="font-size:16px" class="heart-icon" id="save-book-btn" onclick="saveBook(${book.id})">
        Save to read list <i class="fa fa-heart"></i>
        <br>
        <button id="submit-grading">Submit grading</button>
        </h2>
        </div>`
        bookGradingWrapper.append(div);
    }); 
}

renderBooks(); 

let connectBook = async (bookId) => {

    let userId = localStorage.getItem("user_id"); 
    let payload = {books: {
        connect: [bookId]
    }}; 
    await axios.put(`http://localhost:1337/api/users/${userId}`, payload);

}


let saveBook = async (id) => {

    await connectBook(id); 

}

let saveBookBtn = document.getElementById("save-book-btn"); 

// saveBookBtn.addEventListener("click", async () => {

    // GÖR EN POST PÅ POPULATE DEEP MED ETT DYNAMISKT NUMMER PÅ BOKEN - ALLA BÖCKER HAR VISSA NUMMER...! 
    // Books.id. hittas på http://localhost:1337/api/books?populate=*
    // EN RELATION SKAPAS PÅ http://localhost:1337/api/users?populate=deep,2 .... 
// }); 

let inputRating = document.getElementById("book-rating"); 
let submitBookGrading = document.getElementById("submit-grading"); 

// POST MED AXIOS..! http://localhost:1337/api/books?populate=*
// MÅSTE HA RÄTT ID PÅ BOKEN ....! 



let checkBookGrading = async (id) => {

    let newBookValue = inputRating.value; 
    let response = await axios.post(`http://localhost:1337/api/books/${id}`);

}


// submitBookGrading.addEventListener("click", async () => {

//     await checkBookGrading(); 

// }); 


// VG-KRAV: 
// LÄSA UT ALLA ANVÄNDARDATA + DERAS BÖCKER + LÄSA BETYGET ... + RÄKNA UT SNITTBETYG PÅ SÅ VIS
// POST-REQUEST + HÄMTA BÖCKERNA OCH HÄMTA OBJEKTET OCH LÄGG IN DET NYA SNITTBETYGET 
