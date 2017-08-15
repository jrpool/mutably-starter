let currentBook;
$(document).ready(function(){
  $(".1").click(function() {

    //deleteOne("599236cdbc824300112668b3");

    getOne("599362ca5113cf0011283334");

     //addOne("Nexus", "Ramez Naam", "http://modernmrsdarcy.com/wp-content/uploads/2013/07/best-book.png", "April 25, 2020");

    //getAll();
  });
  $(".2").click(function() {
    updateOne("599362ca5113cf0011283334", 'title', 'Les Superhappy');
  });
  $(".3").click(function() {
    getAll();
  });


// the AJAX call functions
  let getAll = function() {
    $.ajax('http://mutably.herokuapp.com/books')
    .done(data=> {
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
      //Object.entries is an array of arrays of keys and values for that obj
      try {
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
      } catch (error) {
        console.error(error.message +"\n"+ error.stack);
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
