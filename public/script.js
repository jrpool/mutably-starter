'use strict';


$(document).ready(function(){

  $.ajax('http://mutably.herokuapp.com/books')
  .done(data=> {
    data.books.forEach(el=> {console.log(el);});
    //console.log(data);
  })
  .fail(err => {console.error(err);});
});
