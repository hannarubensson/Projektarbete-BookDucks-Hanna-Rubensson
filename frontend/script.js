let userName = document.getElementById("login-username"); 
let userEmail = document.getElementById("login-email"); 
let password = document.getElementById("login-psw");
let registerBtn = document.getElementById("register-user-btn"); 
let loginUserBtn = document.getElementById("login-user-btn"); 
let loggedIn = false; 

//------------------------------------------------------//
const register = async () => {

    console.log("User registrerad!");

    let response = await axios.post(
      "http://localhost:1337/api/auth/local/register",

      {
        username: userName.value,
        email: userEmail.value, 
        password: password.value,
      }
    );
    console.log(response);
  };
  

let logIn = async () => {

    let response = await axios.post("http://localhost:1337/api/auth/local", 
      {
        identifier: userName.value, 
        password: password.value, 
      }
    );

    console.log("User profile:", response.data.user);
    console.log("User token:", response.data.jwt);
    console.log(response);

    // sessionStorage.setItem("user", JSON.stringify(response.data.user));

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
        <img src="http://localhost:1337${book.attributes.img.data.attributes.url}" width="300px" height="auto">
        <h2 class="book-info">
        Title: ${book.attributes.title}<br>
        Author: ${book.attributes.author}<br>
        Pages: ${book.attributes.pages}<br>
        Published: ${book.attributes.published}<br>
        </h2>
        `
        bookWrapper.append(div);
        
    });
}

renderBooks(); 

// ~~~~~~~~~~~~ THEME ~~~~~~~~~~~~~~~~ //

let currentTheme = async () => {

  let data = await getData("http://localhost:1337/api/theme"); 

  console.log("theme:", data); 

  if(data.data.attributes.theme === "summer-theme") {
    let bg = document.getElementById("wrapper"); 
    bg.style.backgroundImage = `url("Images/summer-theme.jpg")`;
  }
}

currentTheme(); 