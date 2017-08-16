// Define a function that returns the page’s introduction’s text.
const composeIntro = texts => {
  const pieces = [];
  pieces[0] = texts.text_intro_main;
  pieces[1] = '<li class="collection-header">'
    + texts.text_intro_options_intro
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

// Define a function that initializes the page text.
const textInit = texts => {
  document.getElementById('title').textContent = texts.text_title;
  document.getElementById('intro').innerHTML = composeIntro(texts);
};

$(document).ready(function() {
  // getAll();
  // put all the Ajax functions somewhere awesome- maybe above this and maybe in a separate file
  // figure out how getAll interacts with textInit
  textInit(texts);
  let currentBook;
  $(".createButton").click(function() {
    //get info from form, instead of hardcoded
     addOne("Nexus", "Ramez Naam", "http://modernmrsdarcy.com/wp-content/uploads/2013/07/best-book.png", "April 25, 2020");
  });
  // $(".specific").click(function() {
  //   //placeholder
  // });
  $(".editButton").click(function() {
    // item text gets replaced with the pre-populated, editable form.
    // get specific id from the button click
    getOne("599362ca5113cf0011283334");
    // edit button becomes a save button
  });
  $(".saveButton").click(function() {
    // make this function get filled in by what I get from the form
    updateOne("599362ca5113cf0011283334", 'title', 'Les Superhappy');
    // once success message comes back from the server, input gets replaced with the updated text
  });
  $(".deleteButton").click(function() {
    // get specific id
    deleteOne("599236cdbc824300112668b3");
  });


// the AJAX call functions
  let getAll = function() {
    $.ajax('http://mutably.herokuapp.com/books')
    .done(data=> {
      // show all of them
      data.books.forEach(el=> {console.log(el);});
    })
    .fail(err => {
      console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
    });
  };

  let addOne = function(title, author, image, date) {
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
    .done(data=> {
      // append this one to the bottom of the list of books
      console.log(JSON.stringify(data.title) + " has been added");
    })
    .fail(err => {
      console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
    });
  };

  let getOne = function(id) {
    $.ajax(`http://mutably.herokuapp.com/books/${id}`)
    .done(bookObject => {
      currentBook = bookObject;
      // show this one (with the button for editing+)
    })
    .fail(err => {
      console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
    });
  };

  let updateOne = function(id, thingToUpdate, replacementValue) {
    $.ajax({
      url: `http://mutably.herokuapp.com/books/${id}`,
      method: 'get',
    })
    .done(bookFromServerAsObject => {
      // Object.entries is an array of arrays of keys and values for that obj
      let currentBookAsArrayToCompare = Object.entries(currentBook);
      let bookFromServerAsArrayToCompare = Object.entries(bookFromServerAsObject);
      if(currentBookAsArrayToCompare.toString() === bookFromServerAsArrayToCompare.toString()) {
        currentBook[thingToUpdate] = replacementValue;
        $.ajax({
          url: `http://mutably.herokuapp.com/books/${id}`,
          method: 'put',
          data: currentBook
        });
        console.log(thingToUpdate + " was updated");
      }
      else {
        $("#revalert").html("Uh-oh, looks like someone else changed something already. Take a look at what it says now.");
        console.log("something's wrong");
      }
    })
    .fail(err => {
      console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
    });
  };

  let deleteOne = function(id) {
    $.ajax({
      url: `http://mutably.herokuapp.com/books/${id}`,
      method: 'delete'
    })
    .done(data => {console.log("book #" + id + " was successfully deleted");})
    .fail(err => {
      console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
    });
  };
});

// using jquery to change the DOM
//   var p = $('<p>');
//   p.html(book.title + ' by ' + book.author);
//   $('body').append(p);
