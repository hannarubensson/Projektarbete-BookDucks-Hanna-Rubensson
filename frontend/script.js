let userName = document.getElementById("login-username"); 
let userEmail = document.getElementById("login-email"); 
let password = document.getElementById("login-psw");
let registerBtn = document.getElementById("register-user-btn"); 
let loginUserBtn = document.getElementById("login-user-btn"); 
let loggedIn = false; 

//------------------------------------------------------//
const register = async () => {

    let response = await axios.post(
      "http://localhost:1337/api/auth/local/register",

      {
        username: userName.value,
        email: userEmail.value, 
        password: password.value,
      }
    );
    
    let span = document.getElementById("register-message"); 
    let p = document.createElement("p"); 
    p.innerHTML = `${response.data.user.username} is now a BookDuck!`;

    span.append(p); 
  };
  

let logIn = async () => {

    let response = await axios.post("http://localhost:1337/api/auth/local", 
      {
        identifier: userName.value, 
        password: password.value, 
      }
    );


    if (response.data.jwt) {

        console.log("Response data: ", response.data); 

        loggedIn = true; 
        localStorage.setItem("user", userName.value);
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("user_id", response.data.user.id);
        window.location.href = "loggedin.html";

    } else {

        let p = document.createElement("p");
        let div = document.getElementById("login-wrapper"); 
        p.innerText = "Invalid password or username";

        div.append(p);
    }
};

registerBtn.addEventListener("click", register); 
loginUserBtn.addEventListener("click", logIn); 

// ----------------------------------------------------- // 

async function getData (url) {
    let response = await axios.get(url); 
    console.log(response); 
    return response; 
}


async function renderBooks() {
    
    let response = await getData("http://localhost:1337/api/books?populate=*");
    let books = response.data.data;

    books.forEach(book => {
 
        let bookWrapper = document.getElementById("photo-gallery"); 
        let div = document.createElement("div"); 
        div.innerHTML = `
        <img src="http://localhost:1337${book.attributes.img.data.attributes.url}" width="auto" height="300px">
        <h2 class="book-info">
        Title: ${book.attributes.title}<br>
        Author: ${book.attributes.author}<br>
        Pages: ${book.attributes.pages}<br>
        Published: ${book.attributes.published}<br>
        Grade: ${book.attributes.grade}<br>
        </h2>
        `
        bookWrapper.append(div);
        
    });
}

renderBooks(); 

// ~~~~~~~~~~~~ THEME ~~~~~~~~~~~~~~~~ //

let currentTheme = async () => {

  let data = await getData("http://localhost:1337/api/theme?populate=*"); 
  let newData = data.data.data;
  let bg = document.getElementById("wrapper");

  if(newData.attributes.theme === "summer-theme") { 
    bg.style.backgroundImage = "url('Images/summer-theme.jpg')";
    document.body.style.background = "#fddc95";

  } else if (newData.attributes.theme === "sea-theme") {
    bg.style.backgroundImage = "url('Images/sea-theme.jpg')"; 
    document.body.style.background = "#C7EAEE"; 
  
  } else {
    bg.style.backgoundImage = "url('Images/paper-bg.jpg')";
  }

}

currentTheme(); 