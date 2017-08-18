// /// DOM MANIPULATION FUNCTIONS /// //

// === Static Generic Content === //

// Define a function that returns the page’s introduction’s text.
const composeIntro = texts => {
  const pieces = [];
  pieces[0] = texts.intro_main;
  pieces[1] = '<li class="collection-header">'
    + texts.options_intro
    + '</li>';
  const options = [
    'option_list',
    'option_detail',
    'option_amend',
    'option_branch',
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

// === Generic Controls === //

// Define a function that initializes the generic controls.
const composeGenericControls = texts => {
  const idActions = ['list-toggle', 'add'];
  const listHidden = document.getElementById('list').className === 'invisible';
  const contentActions = [(listHidden ? 'list_show' : 'list_hide'), 'add'];
  const target = document.getElementById('generic').lastElementChild;
  target.textContent = '';
  for (let actionIndex = 0; actionIndex < idActions.length; actionIndex++) {
    const newControl
      = document.getElementById('template-0').firstElementChild.cloneNode(true);
    newControl.id = 'control-' + idActions[actionIndex];
    const contentAction = contentActions[actionIndex];
    newControl.firstElementChild.textContent = texts['button_' + contentAction];
    newControl.lastElementChild.textContent = texts['legend_' + contentAction];
    target.appendChild(newControl);
  }
};

// Define a function that populates and displays the generic section.
const genericInit = texts => {
  document.getElementById('title').textContent = texts.title;
  document.getElementById('intro').innerHTML = composeIntro(texts);
  composeGenericControls(texts);
};

// === List Section === //

// Define a function that summarizes a book.
const summary = record =>
  '[' + record._id + '] '
  + (record.author.replace(/^.* /, '') || '') + ', '
  + record.title;

// Define a function that creates the list from existing data.
const listCreate = (texts, data) => {
  const actions = ['detail'];
  const target = document.getElementById('list');
  target.removeAttribute('class');
  target.textContent = '';
  const requiredProperties = [
    '_id', 'title', 'author', 'image', 'releaseDate', '__v'
  ];
  for (const record of data.books) {
    if (requiredProperties.every(value => record.hasOwnProperty(value))) {
      const listItem = document
        .getElementById('template-1')
        .firstElementChild
        .cloneNode(true);
      listItem.id.replace(/\[_id\]/, record._id);
      const buttonTemplate
        = listItem.removeChild(listItem.firstElementChild);
      for (const action of actions) {
        const itemButton = buttonTemplate.cloneNode(true);
        itemButton.id = action + '-' + record._id;
        itemButton.textContent = texts['button_' + action];
        listItem.insertBefore(itemButton, listItem.lastElementChild);
      }
      listItem.lastElementChild.textContent = summary(record);
      target.appendChild(listItem);
    }
  }
  // Create a listener for these buttons.
  $('#list').click(event => {
    const id = event.target.id;
    if (id) {
      const selectedRecords = window.data.books.filter(
        record => record._id === id.replace(/^.+-/, '')
      );
      if (selectedRecords.length === 1) {
        detailCreate(texts, selectedRecords[0]);
      }
      else {
        console.log('Error: No record.');
      }
    }
    else {
      console.log('Error: no ID.');
    }
  });
};

// Define a function that destroys the list and hides its section.
const listDestroy = () => {
  const target = document.getElementById('list');
  target.className = 'invisible';
  target.textContent = '[template 1 results]';
};

// Define a function that toggles the existence and display of the list.
const listToggle = texts => {
  const controlDiv = document.getElementById('control-list-toggle');
  if (document.getElementById('list').className === 'invisible') {
    $.ajax('http://mutably.herokuapp.com/books')
    .done(data => {
      window.data = data;
      listCreate(texts, data);
      controlDiv.firstElementChild.textContent = texts.button_list_hide;
      controlDiv.lastElementChild.textContent = texts.legend_list_hide;
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
  }
  else {
    listDestroy();
    controlDiv.firstElementChild.textContent = texts.button_list_show;
    controlDiv.lastElementChild.textContent = texts.legend_list_show;
  }
};

// === Utilities for Specific Sections === //

// Define a function that creates a set of specific controls.
const specificControlsCreate = (targetParent, texts, record, actions) => {
  const target
    = document.getElementById(targetParent).lastElementChild;
  target.textContent = '';
  for (const action of actions) {
    const newControl
      = document.getElementById('template-3').firstElementChild.cloneNode(true);
    newControl.id = 'control-' + action;
    newControl.firstElementChild.textContent = texts['button_' + action];
    newControl.lastElementChild.textContent = texts['legend_' + action];
    target.appendChild(newControl);
  }
};

// === Add-Record Section === //

// Define a function that destroys and hides the add-record section.
const addDestroy = () => {
  const target = document.getElementById('add');
  target.className = 'invisible';
  target.children[0].textContent = '[instructions]';
  target.children[1].textContent = '[template 2 results]';
  target.children[2].textContent = '[template 3 results]';
  document.getElementById('control-add').removeAttribute('class');
};

// Define a function that creates and displays the add-record section.
const addCreate = texts => {
  const target = document.getElementById('add');
  target.removeAttribute('class');
  target.firstElementChild.textContent = texts.instructions_add;
  const itemProperties = [
    ['title', 'text', 80],
    ['author', 'text', 80],
    ['image', 'url', 80],
    ['releaseDate', 'date', 10],
    ['__v', 'number', 2]
  ];
  const propertyTarget = target.children[1];
  propertyTarget.textContent = '';
  for (const itemProperty of itemProperties) {
    const property = document.getElementById('template-2')
      .firstElementChild.cloneNode(true);
    const input = property.firstElementChild;
    input.id = 'add_' + texts['property_name_' + itemProperty[0]];
    input.name = texts['property_name_' + itemProperty[0]];
    input.removeAttribute('readonly');
    input.type = itemProperty[1];
    input.removeAttribute('value');
    input.placeholder = texts['property_placeholder_' + itemProperty[0]];
    input.size = input.maxLength = itemProperty[2];
    const label = property.lastElementChild;
    label.htmlFor = input.id;
    label.textContent = texts['property_label_' + itemProperty[0]];
    propertyTarget.appendChild(property);
  }
  specificControlsCreate('add', texts, null, ['add_submit', 'add_cancel']);
  // Create listeners for the created buttons.
  // $('#control-add_submit').click(event => {
  //   detailAmendSubmit(event);
  //   return '';
  // });
  // $('#control-detail_version').click(event => {
  //   detailVersionSubmit(event);
  //   return '';
  // });
  $('#control-add_cancel').click(() => {
    addDestroy();
    return '';
  });
  document.getElementById('control-add').className = 'invisible';
};

// === Record-Detail Section === //

// Define a function that makes the record-detail section editable.
const detailEditForm = (texts, record) => {
  const detailPropertySection = document.getElementById('detail').children[1];
  const detailPropertyDivs = detailPropertySection.children;
  const editIcon = document.createElement('i');
  editIcon.className = 'material-icons prefix';
  for (const div of detailPropertyDivs) {
    const input = div.firstElementChild;
    input.removeAttribute('readonly');
    input.required = '';
    input.insertAdjacentElement(
      'beforebegin', editIcon.cloneNode()
    ).textContent = 'edit';
  }
  const detailControlSection = document.getElementById('detail').children[2];
  detailControlSection.removeChild(
    document.getElementById('control-detail_edit')
  );
  detailControlSection.removeChild(
    document.getElementById('control-detail_remove')
  );
  specificControlsCreate('detail', texts, record, [
    'detail_submit', 'detail_version', 'detail_cancel'
  ]);
  // Create listeners for the created buttons.
  // $('#control-detail_submit').click(event => {
  //   detailAmendSubmit(event);
  //   return '';
  // });
  // $('#control-detail_version').click(event => {
  //   detailVersionSubmit(event);
  //   return '';
  // });
  $('#control-detail_cancel').click(() => {
    detailDestroy();
    return '';
  });
};

// Define a function that destroys and hides the record-detail section.
const detailDestroy = () => {
  const target = document.getElementById('detail');
  target.className = 'invisible';
  target.children[0].textContent = '[instructions]';
  target.children[1].textContent = '[template 2 results]';
  target.children[2].textContent = '[template 3 results]';
};

// Define a function that creates a single-record detail section.
const detailCreate = (texts, record) => {
  const target = document.getElementById('detail');
  target.removeAttribute('class');
  target.firstElementChild.textContent
    = texts.instructions_detail.replace(/«id»/, record._id);
  const itemProperties = [
    ['title', 'text', 80],
    ['author', 'text', 80],
    ['image', 'url', 80],
    ['releaseDate', 'text', 17],
    ['__v', 'number', 2]
  ];
  const propertyTarget = target.children[1];
  propertyTarget.textContent = '';
  for (const itemProperty of itemProperties) {
    const property = document.getElementById('template-2')
      .firstElementChild.cloneNode(true);
    const input = property.firstElementChild;
    input.id = 'record_' + texts['property_name_' + itemProperty[0]];
    input.name = texts['property_name_' + itemProperty[0]];
    input.removeAttribute('required');
    input.type = itemProperty[1];
    input.value = record[itemProperty[0]];
    input.removeAttribute('placeholder');
    input.size = input.maxLength = itemProperty[2];
    const label = property.lastElementChild;
    label.htmlFor = input.id;
    label.textContent = texts['property_label_' + itemProperty[0]];
    propertyTarget.appendChild(property);
  }
  specificControlsCreate('detail', texts, record, [
    'detail_edit', 'detail_remove', 'detail_cancel'
  ]);
  // Create listeners for the created buttons.
  $('#control-detail_edit').click(() => {
    detailEditForm(texts, record);
    return '';
  });
  // $('#control-detail_remove').click(event => {
  //   recordRemove(event);
  //   return '';
  // });
  $('#control-detail_cancel').click(() => {
    detailDestroy();
    return '';
  });
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

// Listener for page load.
$(document).ready(function() {
  const texts = window.texts;
  genericInit(texts);
  // Listener for list toggle request.
  $('#control-list-toggle').click(() => {
    listToggle(texts);
    return '';
  });
  // Listener for record addition request.
  $('#control-add').click(() => {
    addCreate(texts);
    return '';
  });
});

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

// using jquery to change the DOM
//   var p = $('<p>');
//   p.html(book.title + ' by ' + book.author);
//   $('body').append(p);
