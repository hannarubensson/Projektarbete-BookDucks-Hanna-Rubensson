// GLOBAL VARIABLES
let currentUser = localStorage.getItem("user");
let token = sessionStorage.getItem("token"); // Spara & koppla böcker till en JWT
let loggedIn = true; 
// -------------------------------------------------- // 

// GET DATA FUNCTION
let getData = async (url) => {
    let response = await axios.get(url); 
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
    Welcome ${user}! <br>
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
        <input type="range" id="book-rating-${book.id}" min="0" max="5">
        <br>
        <br>
        <button style="font-size:16px" class="heart-icon" id="save-book-btn" onclick="saveBook(${book.id})">
        Save to read list <i class="fa fa-heart"></i>
        <br>
        <button id="submit-grading" onclick="connectBookGrading(${book.id})">Submit grading</button>
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

let connectBookGrading = async (bookId) => {

    let inputRating = document.getElementById(`book-rating-${bookId}`); 
    let bookGrade = parseInt(inputRating.value); 

    console.log("Bookgrade", bookGrade); 


    const response = await axios.get(`http://localhost:1337/api/books/${bookId}`);
    const book = response.data.data;

    if(book.grade_count == null) {
        book.grade_count = 0; 
    } 

    if(book.grade_total == null) {
        book.grade_total = 0; 
    }

    book.grade_count ++; 
    book.grade_total += bookGrade; 

    const payload = {
        data: book
    }

    await axios.put(`http://localhost:1337/api/books/${bookId}`, payload);

}

// CONNECTA ANVÄNDARE - BOK - GRADING
let checkBookGrading = async (bookId) => {

    let inputRating = document.getElementById(`book-rating-${bookId}`); 
    let userInput = inputRating.value; 

    let response = await axios.post(`http://localhost:1337/api/books/${bookId}?populate=deep,2`, payload);


    let user = response.data.data.attributes.users_permissions_users; 
    let bookValues = [];
    let sum = 0; 
    
    user.data.forEach(users => {

        let oldBookGrade = users.attributes.bookGrade;

        if (oldBookGrade === null) {
            oldBookGrade = 0; 
            bookValues.push(parseInt(userInput), parseInt(oldBookGrade));

        } else if (oldBookGrade === NaN) {
            oldBookGrade = 0; 
            bookValues.push(parseInt(userInput), parseInt(oldBookGrade));
            
        } else {

            bookValues.push(parseInt(userInput), parseInt(oldBookGrade));
        }

        console.log("Userinput::", userInput, "Old Bookgrade", oldBookGrade); 
    });
     // TODO : AVERAGE GRADING NOT WORKING, WRONG NUMBER OUTPUT
    // FUNCTION FOR SUM OF BOOKGRADES
    for (let i = 0; i < bookValues.length; i++) {
        sum += bookValues[i];
    }

    let averageGrading = sum/bookValues.length; 
    Math.round(averageGrading); 

    console.log("Average grading : ", averageGrading, "BookId:", bookId); 
    await connectBookGrading(bookId, averageGrading);

}