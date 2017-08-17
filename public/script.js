// /// INITIALIZATION FUNCTIONS /// //

// Define a function that returns the page’s introduction’s text.
const composeIntro = texts => {
  const pieces = [];
  pieces[0] = texts.intro_main;
  pieces[1] = '<li class="collection-header">'
    + texts.options_intro
    + '</li>';
  const options = [
    'option_see_all',
    'option_see_1',
    'option_amend',
    'option_add',
    'option_remove'
  ];
  pieces[2] = options.map(value =>
    '<li class="collection-item"><span class="material-icons tiny">check</span>'
    + texts[value]
    + '</li>'
  ).join('');
  return pieces[0]
    + '<ul class="collection with-header">'
    + pieces[1]
    + pieces[2]
    + '</ul>';
};

// Define a function that initializes the generic controls.
const composeGenericControls = texts => {
  const actions = ['see_all', 'add'];
  const target = document.getElementById('generic').lastElementChild;
  target.textContent = '';
  for (const action of actions) {
    const newControl
      = document.getElementById('template-0').firstElementChild.cloneNode(true);
    newControl.id = 'controller-' + action;
    newControl.firstElementChild.textContent = texts['button_' + action];
    newControl.lastElementChild.textContent = texts['legend_' + action];
    target.appendChild(newControl);
  }
};

// Define a function that summarizes a book.
const summary = record =>
  '[' + record._id + '] '
  + (record.author.replace(/^.* /, '') || '') + ', '
  + record.title;

// Define a function that initializes the list.
const composeList = (texts, data) => {
  const actions = ['see_1'];
  const target = document.getElementById('list');
  target.textContent = '';
  const requiredProperties = [
    '_id', 'title', 'author', 'image', 'releaseDate', '__v'
  ];
  for (const record of data.books) {
    if (requiredProperties.every(value => record.hasOwnProperty(value))) {
      const newListItem = document
        .getElementById('template-1')
        .firstElementChild
        .cloneNode(true);
      newListItem.id = 'record-' + record._id;
      const buttonTemplate
        = newListItem.removeChild(newListItem.firstElementChild);
      for (const action of actions) {
        const newItemButton = buttonTemplate.cloneNode(true);
        newItemButton.id = action + '-' + record._id;
        newItemButton.textContent = texts['button_' + action];
        newListItem.insertBefore(newItemButton, newListItem.lastElementChild);
      }
      newListItem.lastElementChild.textContent = summary(record);
      target.appendChild(newListItem);
    }
  }
};

// Define a function that initializes the generic section.
const genericInit = texts => {
  document.getElementById('title').textContent = texts.title;
  document.getElementById('intro').innerHTML = composeIntro(texts);
  composeGenericControls(texts);
};

// Define a function that initializes the list section.
const listInit = texts => {
  $.ajax('http://mutably.herokuapp.com/books')
  .done(data => {
    composeList(texts, data);
    return '';
  })
  .fail(err => {
    console.error(
      'ERROR:\n'
      + err.status + '\n'
      + err.statusText + '\n'
      + err.responseText
    );
  });
};

// Define a function that initializes the add-record section.
const addInit = texts => {
  document.getElementById('add').firstElementChild.textContent
    = texts.instructions_add;
};

// /// EVENT HANDLERS /// //

let currentBook;

// Define a function that displays a specified error.
const showError = err => {
  console.error(
    'ERROR:\n'
    + err.status + '\n'
    + err.statusText + '\n'
    + err.responseText
  );
};

// Define a function that adds a specified book to the list.
const addOne = function(title, author, image, date) {
  $.ajax({
    url: 'http://mutably.herokuapp.com/books',
    method: 'post',
    data: {
      title: title,
      author: author,
      image: image,
      releaseDate: date
    }
  })
  .done(data => {
    // append this one to the bottom of the list of books
    console.log(JSON.stringify(data.title) + ' has been added');
  })
  .fail(showError);
};

/*
  Define a function that retrieves and displays the details of a specified
  book.
*/
const getOne = function(id) {
  $.ajax(`http://mutably.herokuapp.com/books/${id}`)
  .done(bookObject => {
    currentBook = bookObject;
    // show this one (with the button for editing+)
  })
  .fail(showError);
};

/*
  Define a function that amends the record of a specified book in the list,
  unless the record when last retrieved is no longer identical to the
  record now in the list.
*/
const updateOne = function(id, thingToUpdate, replacementValue) {
  $.ajax({
    url: `http://mutably.herokuapp.com/books/${id}`,
    method: 'get',
  })
  .done(bookFromServerAsObject => {
    // Object.entries is an array of arrays of keys and values for that obj
    const currentBookAsArrayToCompare = Object.entries(currentBook);
    const bookFromServerAsArrayToCompare = Object.entries(bookFromServerAsObject);
    if(currentBookAsArrayToCompare.toString() === bookFromServerAsArrayToCompare.toString()) {
      currentBook[thingToUpdate] = replacementValue;
      $.ajax({
        url: `http://mutably.herokuapp.com/books/${id}`,
        method: 'put',
        data: currentBook
      });
      console.log(thingToUpdate + ' was updated');
    }
    else {
      $('#revalert').html('Uh-oh, looks like someone else changed something already. Take a look at what it says now.');
      console.log('something’s wrong');
    }
  })
  .fail(showError);
};

// Define a function that removes the record of a specified book from the list.
const deleteOne = function(id) {
  $.ajax({
    url: `http://mutably.herokuapp.com/books/${id}`,
    method: 'delete'
  })
  .done(() => {console.log('book #' + id + ' was successfully deleted');})
  .fail(showError);
};

// /// EVENT LISTENERS /// //

// Listener for record creation request.
$('.createButton').click(function() {
  // get info from form, instead of hardcoded
  addOne('Nexus', 'Ramez Naam', 'http://modernmrsdarcy.com/wp-content/uploads/2013/07/best-book.png', 'April 25, 2020');
});

// Listener for record editing request.
// $('.specific').click(function() {
//   //placeholder
// });
$('.editButton').click(function() {
  // item text gets replaced with the pre-populated, editable form.
  // get specific id from the button click
  getOne('599362ca5113cf0011283334');
  // edit button becomes a save button
});

// Listener for amendment submission request.
$('.saveButton').click(function() {
  // make this function get filled in by what I get from the form
  updateOne('599362ca5113cf0011283334', 'title', 'Les Superhappy');
  // once success message comes back from the server, input gets replaced with the updated text
});

// Listener for removal request.
$('.deleteButton').click(function() {
  // get specific id
  deleteOne('599236cdbc824300112668b3');
});

// Listener for page load.
$(document).ready(function() {
  const texts = window.texts;
  genericInit(texts);
  listInit(texts);
  addInit(texts);
});

// using jquery to change the DOM
//   var p = $('<p>');
//   p.html(book.title + ' by ' + book.author);
//   $('body').append(p);
