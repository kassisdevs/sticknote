'use strict';

// Protect route with vanilla js
if (localStorage.getItem('auth') !== 'true') {
  window.location.replace('../login.html');
}

// Storage controller
var StorageCtrl = function () {
  return {
    addToLs: function addToLs(note) {
      // Add note to localStorage
      var notes = void 0;
      if (localStorage.getItem('notes') === null) {
        notes = [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
      } else {
        notes = JSON.parse(localStorage.getItem('notes'));
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
      }
    },
    getFromLs: function getFromLs() {
      // Pull data from localStorage
      var notes = void 0;
      if (localStorage.getItem('notes') === null) {
        notes = [];
      } else {
        notes = JSON.parse(localStorage.getItem('notes'));
      }
      return notes;
    },
    updateLs: function updateLs(updatedNote) {
      // Update data in localStorage
      var notes = JSON.parse(localStorage.getItem('notes'));
      notes.forEach(function (note, index) {
        if (note.id === updatedNote.id) {
          notes.splice(index, 1, updatedNote);
        }
      });
      localStorage.setItem('notes', JSON.stringify(notes));
    },
    deleteFromLs: function deleteFromLs(id) {
      // Update note from localStorage
      var notes = JSON.parse(localStorage.getItem('notes'));
      var ids = notes.map(function (note) {
        return note.id;
      });
      var index = ids.indexOf(id);
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  };
}();
// Note controller

var noteCtrl = function () {
  var Note = function Note(id, title, content) {
    // Declare a Note as an object
    this.id = id;
    this.title = title;
    this.content = content;
  };

  // Data Structure
  var data = {
    notes: StorageCtrl.getFromLs(), // Get Note Array from LS
    currentNote: null // declare currentNote variable to use in UPDATE/DELETE state
  };
  return { // return public function to perform CRUD Operations
    getNotes: function getNotes() {
      return data.notes;
    },
    addNote: function addNote(title, content) {
      var id = void 0;
      if (data.notes.length > 0) {
        id = data.notes[data.notes.length - 1].id + 1;
      } else {
        id = 0;
      }
      var newNote = new Note(id, title, content);
      data.notes.push(newNote);
      return newNote;
    },
    deleteNoteData: function deleteNoteData(id) {
      var ids = data.notes.map(function (note) {
        return note.id;
      });
      var index = ids.indexOf(id);
      data.notes.splice(index, 1);
    },
    setCurrentNote: function setCurrentNote(id) {
      data.notes.forEach(function (note) {
        if (note.id === id) {
          data.currentNote = note;
        }
      });
      return data.currentNote;
    },
    editCurrentNote: function editCurrentNote(title, content) {
      data.notes.forEach(function (note) {
        if (note.id === data.currentNote.id) {
          note.title = title;
          note.content = content;
        }
      });
      return data.currentNote;
    }
  };
}();

var UiCtrl = function (noteCtrl) {

  return {
    populateNoteList: function populateNoteList(getNotes) {
      // Populate note into Html
      if (getNotes.length > 0) {
        var html = '';
        getNotes.forEach(function (note) {
          html += '\n      <div class="empty">\n      <li id="note-' + note.id + '" class="fill" draggable="true">\n      <a href="#">\n      <i id="delete" class="fa fa-trash-alt px-2 float-right" ></i>\n      <i id="edit" class="fa fa-edit float-right" ></i>\n      <h2>' + note.title + '</h2>\n      <p>' + note.content + '</p>\n      </a>\n      </li>\n      </div>\n      ';
          document.querySelector('.note-list').innerHTML = html + '\n      <div class="empty"></div>\n      ';
        });
      } else {
        document.querySelector('.note-list').innerHTML = '';
      }
    },
    onCreateNoteClick: function onCreateNoteClick() {
      var html = "<div class=\"modal-container\">\n" + "    <section class=\"create-modal\">\n" + "        <div class=\"form-group title\">\n" + "            <label class=\"sr-only\">Title</label>\n" + "            <input type=\"text\" placeholder=\"Title...\" class=\"form-control\" id='title'>\n" + "        </div>\n" + "        <div class=\"form-group\">\n" + "            <label class=\"sr-only\">Content</label>\n" + "            <textarea type=\"text\" placeholder=\"Content...\" class=\"form-control\" id='content'></textarea>\n" + "        </div>\n" + "        <div class=\"form-group action-btn\">\n" + "            <button class=\"btn btn-primary \" id='cancel-button'>Cancel</button>\n" + "            <button class=\"btn btn-success \" id='edit-button'>Edit</button>\n" + "            <button class=\"btn btn-primary\" id='save-button'>Save</button>\n" + "        </div>\n" + "    </section>\n" + "</div>";

      document.getElementById('modal-container').innerHTML = html;
      document.getElementById('edit-button').style.display = 'none';
      document.getElementById('cancel-button').addEventListener('click', function () {
        document.getElementById('modal-container').innerHTML = "";
      });
      document.getElementById('save-button').addEventListener('click', function () {
        // Get form values
        var title = document.getElementById('title').value,
            content = document.getElementById('content').value;
        // Validate form values
        if (title !== '' && content !== '') {

          // Push new note to noteCtrl and LS, reset the UI
          var newNote = noteCtrl.addNote(title, content);
          StorageCtrl.addToLs(newNote);
          UiCtrl.showAlert('Note added!', 'alert-success');
          var getNotes = noteCtrl.getNotes();
          UiCtrl.populateNoteList(getNotes);
        } else {
          UiCtrl.showAlert('all fields are required!', 'alert-danger');
        }
        document.getElementById('modal-container').innerHTML = "";
      });
      document.getElementById('edit-button').addEventListener('click', function () {
        // Get form values
        var title = document.getElementById('title').value,
            content = document.getElementById('content').value;
        // Validate form values
        if (title !== '' && content !== '') {
          // Push updated note to noteCtrl and LS, reset the UI  
          var currentNote = noteCtrl.editCurrentNote(title, content);
          StorageCtrl.updateLs(currentNote);
          UiCtrl.showAlert('Note updated!', 'alert-success');
          var getNotes = noteCtrl.getNotes();
          UiCtrl.populateNoteList(getNotes);
        }
        document.getElementById('modal-container').innerHTML = "";
      });
    },
    editNote: function editNote(target) {
      // Apply event bubbling delegation to fire an event listner when the user target the edit icon
      if (target.id === 'edit') {
        var id = target.parentElement.parentElement.id;
        id = parseInt(id.split('')[id.split('').length - 1]);
        var currentNote = noteCtrl.setCurrentNote(id);
        UiCtrl.onCreateNoteClick();
        UiCtrl.setCurrentNoteInput(currentNote);
      }
    },
    deleteNote: function deleteNote(target) {
      // Apply event bubbling delegation to fire an event listner when the user target the delete icon
      if (target.id === 'delete') {
        if (confirm('Are you sure ?')) {
          var id = target.parentElement.parentElement.id;
          id = parseInt(id.split('')[id.split('').length - 1]);
          noteCtrl.deleteNoteData(id);
          StorageCtrl.deleteFromLs(id);
          var getNotes = noteCtrl.getNotes();
          UiCtrl.populateNoteList(getNotes);
        }
      }
    },
    setCurrentNoteInput: function setCurrentNoteInput(currentNote) {
      // Set edit state mode by hiding and showing buttons
      document.getElementById('title').value = currentNote.title;
      document.getElementById('content').value = currentNote.content;
      document.getElementById('save-button').style.display = 'none';
      document.getElementById('edit-button').style.display = 'inline-block';
    },
    showAlert: function showAlert(message, className) {

      // Create alert div
      var error = document.createElement('div');
      error.className = 'alert ' + className;
      error.innerText = message;

      // Inject into html
      var wrapper = document.querySelector('.wrapper');
      var ref = document.getElementById('show-alert');
      wrapper.insertBefore(error, ref);

      // Remove after 3 s
      setTimeout(function () {
        document.querySelector('.alert').remove();
        location.reload();
      }, 2000);
    }
  };
}(noteCtrl);

var App = function (noteCtrl, UiCtrl) {

  var loadEventListners = function loadEventListners() {
    document.querySelector('#add-note').addEventListener('click', UiCtrl.onCreateNoteClick);
    document.querySelector('.note-list').addEventListener('click', function (e) {
      UiCtrl.editNote(e.target);
      e.preventDefault();
    });
    document.querySelector('.note-list').addEventListener('click', function (e) {
      UiCtrl.deleteNote(e.target);
      e.preventDefault();
    });
  };

  return {
    init: function init() {
      var getNotes = noteCtrl.getNotes();
      UiCtrl.populateNoteList(getNotes);
      loadEventListners();
    }
  };
}(noteCtrl, UiCtrl);

App.init();