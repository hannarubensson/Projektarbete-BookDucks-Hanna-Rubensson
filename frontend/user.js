const sortByTitleBtn = document.getElementById("sort-by-title-btn"); 
const sortByAuthorBtn = document.getElementById("sort-by-author-btn");
const currentUserId = localStorage.getItem("user_id"); 
const currentUser = localStorage.getItem("user"); 

// GET DATA FUNCTION
let getData = async (url) => {
  let response = await axios.get(url); 
  return response; 
}

const renderLikedBooks = async (id) => {

    let response = await axios.get("http://localhost:1337/api/users?populate=deep,2");
    let index = id-1; 
    let user = response.data[index];

      user.books.forEach(book => {
        
        let ul = document.getElementById("my-reading-list"); 
        let li = document.createElement("li");
        li.innerHTML = `
        ${book.author}, "${book.title}". Published: ${book.published}. Pages: ${book.pages}. Grade: ${book.grade}
        <br>
        <button style="font-size:16px" class="archive-btn">Archive book <i class="fa fa-archive"></i></button>
        <button style="font-size:16px" class="trash-btn" onclick="trashBook(${book.id})">Remove book <i class="fa fa-trash"></i></button>
        `;
        ul.append(li); 
      });

      return user.books; 
}; 

renderLikedBooks(currentUserId); 

const sortBookListByTitle = async () => {

  let books = await renderLikedBooks(currentUserId);
  let arr = []; 

  books.forEach(book => {

    arr.push({
      id: book.id, 
      author: book.author,
      grade: book.grade, 
      pages: book.pages,
      published: book.published, 
      title: book.title, 
    });

  });

  let sortedArr = arr.sort((a,b) => (a.title > b.title) ? 1 : -1); 
  updateBookList(sortedArr); 

};

const sortBookListByAuthor = async () => {

  let books = await renderLikedBooks(currentUserId);
  let arr = []; 


  books.forEach(book => {

    arr.push({
      id: book.id,
      author: book.author,
      grade: book.grade, 
      pages: book.pages,
      published: book.published, 
      title: book.title, 
    });

  });

  let sortedArr = arr.sort((a,b) => (a.author > b.author) ? 1 : -1); 
  updateBookList(sortedArr); 
};

const updateBookList = async (arr) => {

  let ul = document.getElementById("my-reading-list"); 
  ul.innerHTML = ""; 

  arr.forEach(obj => {
    let li = document.createElement("li");
    li.innerHTML = `
    ${obj.author}, "${obj.title}". Published: ${obj.published}. Pages: ${obj.pages}. Grade: ${obj.grade}
    <br>
    <button style="font-size:16px" class="archive-btn">Archive book <i class="fa fa-archive"></i></button>
    <button style="font-size:16px" class="trash-btn" onclick="trashBook(${obj.id})">Remove book <i class="fa fa-trash"></i></button>
    `;
    ul.append(li); 
}); 

}; 


sortByTitleBtn.addEventListener("click", async () => {

  sortBookListByTitle(); 

});

sortByAuthorBtn.addEventListener("click", async () => {
  
  sortBookListByAuthor();

});

//REMOVE DATA FUNCTION ---------------------------------
const trashBook = async (bookId) => {

  console.log("TrashBOok körs"); 
  console.log("BookID", bookId); 

  let payload = { 
      books: {
        disconnect: [bookId],
    }
  }
  let response = await axios.put(`http://localhost:1337/api/users/${currentUserId}?populate=deep,2`, payload); 

  console.log("Response from delete: ", response); 

}

// ARCHIVED BOOKS FUNCTION -----------------------------------

let archiveBtn = document.querySelectorAll(".archive-btn"); 

archiveBtn.addEventListener("click", async () => {

  let data = await getData(`http://localhost:1337/api/users/${currentUserId}?populate=deep,2`);
  let newData = data.data.data; 

  archiveBook(newData); 

}); 



const archiveBook = (obj) => {

  obj.forEach(book => {
    let archivedBookList = document.getElementById("my-archived-books-list"); 
    let li = document.createElement("li");
    li.innerHTML = `
    ${book.author}, "${book.title}". Published: ${book.published}. Pages: ${book.pages}. Grade: ${book.grade}
    `
    archivedBookList.append(li); 
  }); 
}

// THEME UPDATER ----------------------------------------------------------

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