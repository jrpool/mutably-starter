//fix update so that it works with form input

const textInit = () => {
  document.getElementById('title').textContent = texts.text_title;
  document.getElementById('intro').innerHTML = texts.text_intro;
};
let currentBook;

const hideAllSections = () => {
  $("#listOfItemsFromAPI").hide();
  $("#make").hide();
  $("#detail").hide();
  $("#form_for_edit").hide();
};

// the AJAX call functions
const getAll = function() {
  $("#listOfItemsFromAPI").empty();
  hideAllSections();
  $.ajax('https://mutably.herokuapp.com/books')
  .done(data=> {
    let bookID;
    data.books.forEach(el=> {
      bookID = el._id;
      $('#listOfItemsFromAPI').append(
        //TODO: get+ID, delete+id
        `<li>
          <button class=".controller-see_1 ${bookID}" id="get${bookID}"> See Book Details </button>
          <span class= "info_about_item_from_API"> ${el.title} by ${el.author} with id of ${bookID}
        </li>`);
        $("#get" + bookID).click(function(event) {
          getOne(event.target.classList[1]);
        });
    });
    $("#listOfItemsFromAPI").show();
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

const addOne = function(title, author, image, date) {
  $.ajax({
    url: 'https://mutably.herokuapp.com/books',
    method: 'post',
    data: {
      title: title,
      author: author,
      image: image,
      releaseDate: date
    }
  })
  .done(data=> {
    $("#flash_messages").append(
      `<p style="background-color:green; color:white;"> ${title} was successfully added</p>`
    );
    setTimeout(() => {$("#flash_messages").empty();}, 5000);
    getAll();
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

const getOne = function(id) {
  $("#detail").empty();
  $.ajax(`https://mutably.herokuapp.com/books/${id}`)
  .done(bookObject => {
    currentBook = bookObject;
    $("#listOfItemsFromAPI").hide();
    $("#detail").append(
      `<p>
      <img src="${bookObject.image}" height=200px> <br>
      Title: ${bookObject.title} <br>
      Author: ${bookObject.author} <br>
      Date: ${bookObject.releaseDate}
      </p>
      <button id="controller-show_amend_form">Edit</button>
      <button id="controller-remove">Delete</button>
      `
    );
    $("#detail").show();
    $("#controller-show_amend_form").click(function() {
      hideAllSections();
      $("#title_to_update").val(currentBook.title);
      $("#author_to_update").val(currentBook.author);
      $("#image_to_update").val(currentBook.image);
      $("#date_to_update").val(currentBook.releaseDate);
      $("#form_for_edit").show();
      //edit button becomes a save button

    });
    $("#controller-remove").click(function() {
      deleteOne(currentBook._id, currentBook.title);
      getAll();
    });
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

const updateOne = function(id, thingToUpdate, replacementValue) {
  $.ajax({
    url: `https://mutably.herokuapp.com/books/${id}`,
    method: 'get',
  })
  .done(bookFromServerAsObject => {
    //Object.entries is an array of arrays of keys and values for that obj
    let currentBookAsArrayToCompare = Object.entries(currentBook);
    let bookFromServerAsArrayToCompare = Object.entries(bookFromServerAsObject);
    if(currentBookAsArrayToCompare.toString() === bookFromServerAsArrayToCompare.toString()) {
      currentBook[thingToUpdate] = replacementValue;
      $.ajax({
        url: `https://mutably.herokuapp.com/books/${id}`,
        method: 'put',
        data: currentBook
      }).done(data => {
        $("#flash_messages").append(
          //TODO:fix this to have the correct info for this book in the flash
          `<p style="background-color:green; color:white;"> ${thingToUpdate} was successfully updated</p>`
        );
        setTimeout(() => {$("#flash_messages").empty();}, 5000);
        getAll();
      });
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

const deleteOne = function(id, title) {
  $.ajax({
    url: `https://mutably.herokuapp.com/books/${id}`,
    method: 'delete'
  })
  .done(data => {
    $("#flash_messages").append(
      `<p style="background-color:green; color:white;"> ${title} was successfully deleted</p>`
    );
    setTimeout(() => {$("#flash_messages").empty();}, 5000);
    getAll();
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

$(document).ready(function(){
  textInit();

  $("#controller-see_all").click(function() {
    getAll();
  });

  $("#controller-show_add_form").click(function() {
    hideAllSections();
    $("#make").show();
  });

  $("form").submit(function(event) {
    event.preventDefault();
    let $form = $(this);
    if(this.id === "make") {
      let title = $form.find('input[name="title"]').val();
      let author = $form.find('input[name="author"]').val();
      let image = $form.find('input[name="image"]').val();
      let date = $form.find('input[name="date"]').val();
      addOne(title, author, image, date);
   }
  });

  $("#controller-amend").click(function() {
    event.preventDefault();
    updateOne(currentBook._id, 'title', 'Les Superhappy');
    //make this function get filled in by what I get from the form
      //have to decide if I rewrite the function to just put all the info or if I only do stuff that changed.
  });
});

//stretch: add hashes in the url when change states
//deploy to heroku
//react

// example for creating an element with stuff on it
// $(document).ready(function() {
//   var ss = {
//     id: "foo",
//     class: "attack",
//     dataa: "hhh",
//     style: 'color: red'
//   };
//   var $div = $("<div>", ss);
//   $div.html("dfg");
//   $("body").append($div);
// });

// also, this
// $(linkId).css({
//     padding: ".4em 1em .4em 20px",
//     "text-decoration": "none",
//     position: "relative"
// });
