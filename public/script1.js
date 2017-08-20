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

// Define a function that adds an error message to a control’s label.
const errorAdd = (texts, controlElement, errorKey) => {
  const errorTarget
    = controlElement.nextElementSibling.getElementsByClassName('error')[0];
  errorTarget.textContent = ' ' + texts[errorKey];
};

// Define a function that destroys any error message to a control’s label.
const errorDestroy = (controlElement) => {
  const errorTarget
    = controlElement.nextElementSibling.getElementsByClassName('error')[0];
  errorTarget.textContent = '';
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
      listItem.id = listItem.id.replace(/\[_id\]/, record._id);
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
  const controlDiv = document.getElementById('control-list-toggle');
  controlDiv.firstElementChild.textContent = texts.button_list_hide;
  controlDiv.lastElementChild.textContent = texts.legend_list_hide;
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
const listDestroy = (texts) => {
  const target = document.getElementById('list');
  target.className = 'invisible';
  target.textContent = '[template 1 results]';
  const controlDiv = document.getElementById('control-list-toggle');
  controlDiv.firstElementChild.textContent = texts.button_list_show;
  controlDiv.lastElementChild.textContent = texts.legend_list_show;
};

// Define a function that toggles the existence and display of the list.
const listToggle = texts => {
  if (document.getElementById('list').className === 'invisible') {
    $.ajax('https://mutably.herokuapp.com/books')
    .done(data => {
      window.data = data;
      listCreate(texts, data);
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
    listDestroy(texts);
  }
};

// === Utilities for Specific Sections === //

// Define a function that makes a specified input element editable.
const makeEditable = inputElement => {
  inputElement.removeAttribute('readonly');
  inputElement.setAttribute('required', '');
  const editIcon = document.createElement('i');
  editIcon.className = 'material-icons prefix';
  editIcon.innerHTML = 'edit';
  inputElement.insertAdjacentElement('beforebegin', editIcon);
};

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

// Define a function that submits a record to the list.
const submit = (texts, section, id, queryType) => {
  const propertyIDs = ['title', 'author', 'image', 'releaseDate'];
  const destroyFns = {
    'add': addDestroy,
    'detail': detailDestroy
  };
  if (propertyIDs.map(propertyID => {
    const target = document.getElementById(section + '_' + propertyID);
    if (!target.value) {
      errorAdd(texts, target, 'missing');
      return false;
    }
    else if (target.className.includes('invalid')) {
      errorAdd(texts, target, 'invalid');
      return false;
    }
    else {
      errorDestroy(target);
      return true;
    }
  }).every(element => element)) {
    $.ajax({
      url: 'https://mutably.herokuapp.com/books' + id,
      type: queryType,
      cache: false,
      data: {
        title: document.getElementById('add_title').value,
        author: document.getElementById('add_author').value,
        image: document.getElementById('add_image').value,
        releaseDate: document.getElementById('add_releaseDate').value
      },
      success: () => {
        destroyFns[section]();
        listDestroy(texts);
      },
      error: response => {console.log('Error: ' + response.responseText);}
    });
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

// Define a function that submits a new record for addition to the list.
const addSubmit = texts => {
  submit(texts, 'add', '', 'POST');
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
    ['releaseDate', 'date', 10]
  ];
  const propertyTarget = target.children[1];
  propertyTarget.textContent = '';
  for (const itemProperty of itemProperties) {
    const property = document.getElementById('template-2')
      .firstElementChild.cloneNode(true);
    const input = property.firstElementChild;
    input.id = input.name = 'add_' + itemProperty[0];
    input.type = itemProperty[1];
    input.placeholder = texts['property_placeholder_' + itemProperty[0]];
    input.size = input.maxLength = itemProperty[2];
    makeEditable(input);
    const label = property.lastElementChild;
    label.htmlFor = input.id;
    label.children[0].textContent = texts['property_label_' + itemProperty[0]];
    errorDestroy(input);
    propertyTarget.appendChild(property);
  }
  specificControlsCreate('add', texts, null, ['add_submit', 'add_cancel']);
  // Create listeners for the created buttons.
  $('#control-add_submit').click(() => {
    addSubmit(texts);
    return '';
  });
  $('#control-add_cancel').click(() => {
    addDestroy();
    return '';
  });
  document.getElementById('control-add').className = 'invisible';
};

// === Record-Detail Section === //

// Define a function that destroys and hides the record-detail section.
const detailDestroy = () => {
  const target = document.getElementById('detail');
  target.className = 'invisible';
  target.children[0].textContent = '[instructions]';
  target.children[1].textContent = '[template 2 results]';
  target.children[2].textContent = '[template 3 results]';
};

/*
  Define a function that destroys and hides the record-detail section
  and the summary of its record in the list.
*/
const recordDestroy = () => {
  const recordID = document.getElementById('detail__id').value;
  detailDestroy();
  const exSummary = document.getElementById('summary-' + recordID);
  if (exSummary) {
    document.getElementById('list').removeChild(exSummary);
  }
};

/*
  Define a function that submits an amended record for replacement of an
  existing record in the list.
*/
const amendSubmit = texts => {
  const id = '/' +  document.getElementById('detail__id').value;
  submit(texts, 'detail', id, 'PUT');
};

/*
  Define a function that submits an amended record for addition to the list
  as a new record.
*/
const versionSubmit = texts => {
  submit(texts, 'detail', '', 'POST');
};

// Define a function that submits a request to remove a record from the list.
const recordRemove = () => {
  const recordID = document.getElementById('detail__id').value;
  $.ajax({
    url: 'https://mutably.herokuapp.com/books/' + recordID,
    type: 'DELETE',
    cache: false,
    success: recordDestroy,
    error: response => {console.log('Error: ' + response.responseText);}
  });
};

// Define a function that makes the record-detail section editable.
const detailEditForm = (texts, record) => {
  const detailPropertyDiv
    = document.getElementById('detail').getElementsByClassName('properties')[0];
  const detailPropertyDivs = detailPropertyDiv.getElementsByTagName('DIV');
  for (const div of detailPropertyDivs) {
    const input = div.getElementsByTagName('INPUT')[0];
    if ([
      'title', 'author', 'image', 'releaseDate'
    ].includes(input.id.replace(/^detail_/, ''))) {
      makeEditable(input);
    }
  }
  const detailControlSection
    = document.getElementById('detail').getElementsByClassName('controls')[0];
  detailControlSection.removeChild(
    document.getElementById('control-detail_edit')
  );
  detailControlSection.removeChild(
    document.getElementById('control-detail_remove')
  );
  specificControlsCreate('detail', texts, record, [
    'detail_amend', 'detail_version', 'detail_cancel'
  ]);
  // Create listeners for the created buttons.
  $('#control-detail_amend').click(() => {
    amendSubmit(texts);
    return '';
  });
  $('#control-detail_version').click(() => {
    versionSubmit(texts);
    return '';
  });
  $('#control-detail_cancel').click(() => {
    detailDestroy();
    return '';
  });
};

// Define a function that creates a single-record detail section.
const detailCreate = (texts, record) => {
  const target = document.getElementById('detail');
  target.removeAttribute('class');
  target.firstElementChild.textContent
    = texts.instructions_detail;
  const itemProperties = [
    ['_id', 'text', 24],
    ['title', 'text', 80],
    ['author', 'text', 80],
    ['image', 'url', 80],
    ['releaseDate', 'date', 10],
    ['__v', 'number', 2]
  ];
  const propertyTarget = target.getElementsByClassName('properties')[0];
  propertyTarget.textContent = '';
  for (const itemProperty of itemProperties) {
    const property = document.getElementById('template-2')
      .firstElementChild.cloneNode(true);
    const input = property.firstElementChild;
    input.id = input.name = 'detail_' + itemProperty[0];
    input.removeAttribute('required');
    input.type = itemProperty[1];
    input.value = record[itemProperty[0]];
    input.removeAttribute('placeholder');
    input.size = input.maxLength = itemProperty[2];
    const label = property.lastElementChild;
    label.htmlFor = input.id;
    label.getElementsByClassName('label')[0].textContent
      = texts['property_label_' + itemProperty[0]];
    errorDestroy(input);
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
  $('#control-detail_remove').click(() => {
    recordRemove();
    return '';
  });
  $('#control-detail_cancel').click(() => {
    detailDestroy();
    return '';
  });
};

// /// PAGE /// //

// Listener for page load.
$(document).ready(function() {
  const texts = window.texts;
  genericInit(texts);
  // Create listeners for the created buttons.
  $('#control-list-toggle').click(() => {
    listToggle(texts);
    return '';
  });
  $('#control-add').click(() => {
    addCreate(texts);
    return '';
  });
});
