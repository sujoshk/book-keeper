const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];


// Show modal, focus on input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}


// Validate Form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const regex = new RegExp(expression);


  if(!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }

  if(!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }

  // Valid
  return true;  
}





// Build Bookmarks DOM
function buildBookmarks() {

  // Remove all previous bookmarks
  bookmarksContainer.textContent = '';



  // Build items
  bookmarks.forEach((bookmark) => {
    const {name, url} = bookmark;
    

    // Item
    const item = document.createElement('div');
    item.classList.add('item');

    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);


    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'favicon');

    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    // Append to bookmarks container
    // Order of appending is very important. Start with the smallest and progress to the biggest container.
    // append can put multiple elements in the container while append child only makes a single element the child of the parent element calling this function.
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}



// Fetch bookmarks
function fetchBookmarks() {

  // Get bookmarks from local storage if available
  if(localStorage.getItem('bookmarks')) {
    
    bookmarks = JSON.parse(localStorage.getItem('bookmarks')); 

  } else {
    // Create bookmarks array in local storage
    bookmarks = [
      {
        name: 'Sujosh',
        url: 'sujosh.com',
      },
    ];

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
  }  

  buildBookmarks();
}



// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));


// window.addEventListener('click', (e) => console.log(e.target)); 
// This shows the click event anywhere on the application
// By console logging the target, we see the element that is being targetted whenever a particular event is fired.
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Ternary operator  {condition ? ifTrue : ifFalse ;}





// Delete Bookmarks
function deleteBookmark(url) {

  bookmarks.forEach((bookmark, i) => {
    if(bookmark.url === url) {

      // removes items from the original array. Read more.
      bookmarks.splice(i, 1);
    }
  });

  //Update bookmarks array in localStorage, repopulate the DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();


}











// Handle Data from Form
function storeBookmark(e) {
  
  e.preventDefault();
  
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if(!urlValue.includes('https://', 'http://')) {
    urlValue = `https://${urlValue}`;
  }

  if(!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);

  // Use JSON.stringigy method always when storing in local storage. Local storage can only hold text.
  
  // Do the opposite when retreiving data from local storage. If you want to retreive objects from a string, use JSON.parse
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));


  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();

}





// Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();