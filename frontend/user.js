// RENDERA UT LISTA MED GILLADE BÖCKER FÖR USERN, SAMT BILDER PÅ BOKEN + SOPTUNNA :)

// SORTERA LISTAN FRÅN A-Z PÅ TITEL OCH FRÅN A-Z PÅ FÖRFATTARE.. !

let sortByTitleBtn = document.getElementById("sort-by-title-btn"); 
let sortByAuthorBtn = document.getElementById("sort-by-author-btn");
let currentUserId = localStorage.getItem("user_id"); 
let currentUser = localStorage.getItem("user"); 

const renderLikedBooks = async (id) => {

    let response = await axios.get("http://localhost:1337/api/users?populate=deep,2");
    console.log(response); 

    let index = id-1; 
    let user = response.data[index];

    if (user.role.id === index) {

        user.books.forEach(book => {
            let ul = document.getElementById("my-reading-list"); 
            let li = document.createElement("li");
            li.innerHTML = `
            ${book.author}, ${book.title}. Published: ${book.published}. Pages: ${book.pages}. Grade: ${book.grade}
            `;
            ul.append(li); 
        });
    }
}

renderLikedBooks(currentUserId); 

// sortByTitleBtn.addEventListener("click", async () => {
//     const books = await renderLikedBooks(currentUserId);
//     books.sort((a, b) => (a.title > b.title) ? 1 : -1);
//     renderLikedBooks();
// });

// sortByAuthorBtn.addEventListener("click", async () => {
//     const books = await renderLikedBooks(currentUserId);
//     books.sort((a, b) => (a.author > b.author) ? 1 : -1);
//     renderLikedBooks();
// });


// GET DATA FUNCTION
let getData = async (url) => {
    let response = await axios.get(url); 
    console.log(response); 
    return response; 
}

// THEME 

let currentTheme = async () => {

    let data = await getData("http://localhost:1337/api/theme?populate=*"); 
    let newData = data.data.data;
    let bg = document.getElementById("profile-wrapper");
  
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