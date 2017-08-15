$(document).ready(function(){
  let currentBook;
  $("button").click(function() {


    updateOne("5992484ebc82430011266917", 'title', 'Les SuperHappy');

    //deleteOne("599236cdbc824300112668b3");

    //getOne("599236cdbc824300112668b3");

     //addOne("Nexus", "Ramez Naam", "http://modernmrsdarcy.com/wp-content/uploads/2013/07/best-book.png", "April 25, 2020");

    //getAll();
  });
});

let getAll = function() {
  $.ajax('http://mutably.herokuapp.com/books')
  .done(data=> {
    data.books.forEach(el=> {console.log(el);});
    //console.log(data);
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
    console.log(JSON.stringify(data.title) + " has been added");
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

let getOne = function(id) {
  $.ajax(`http://mutably.herokuapp.com/books/${id}`)
  .done(data => {
//TODO: make currentBook the correct thing
    currentBook = data.dfadfd
    console.log(data);
  })
  .fail(err => {
    console.error("ERROR: \n" + err.status + "  " + err.statusText + " : " + err.responseText);
  });
};

let updateOne = function(id, thingToUpdate, replacementValue) {
//do an ajax call to get what's currentBook
  //check to see if it's the same as what we have
  //if so, submit it
  //if not, a message to the user
  $.ajax({
    url: `http://mutably.herokuapp.com/books/${id}`,
    method: 'get',
  })
  .done(data => {
      //TODO: make currentBook the correct thing
      const currentBook = data.dfadfd
    if(data === currentBook) {

    }
    // $.ajax({
    //   url: `http://mutably.herokuapp.com/books/${id}`,
    //   method: 'put',
    //   data: {thingToUpdate: replacementValue}
    // })
    console.log(thingToUpdate + " was updated");
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
