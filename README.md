# stickynote

public url (https://stickynote-9046e.firebaseapp.com/)

login url (https://stickynote-9046e.firebaseapp.com/login.html)
username: kassis
passwod: kassis


es6 folder contains developent env, i have used es6 syntax const, let and arrow functions

Steps of building the app:

- create controllers
1- StorageCtrl: to interact with localStorage
2- noteCtrl: to perform CRUD Operations
3- UICtrl: to interact with UI, showing, hiding, injecting to html
4- appCtrl: bring above controllers to work together, load event listeners and init the app.

- populate data to the screen: i hardcoded data and created public function to get the data and put it inside html.

- add note to data: i declared a note as class in my data structure, set event listener to get user input and instantiate new object from that class

- add note to UI: i created a function that takes the new note and inject it to html

- working with edit state: in my data structure, i declared a currentNote var to manage edit state, when the user clicks on the edit/delete icon, i used bubbling delegation to fire an event listener and get the note id, then fetch the date and edit/delete the note.

- working with localStorage: i declared functions to perform get, create, update, delete operations with localStorage, if the localStorage is null, it will return an empty array.

- working with login: i created a simple vanilla js login system, when you submit the user and pass, it will create a var 'auth' in localStorage, if the auth is true, you will be redirect to the homepage, if not, it will reload login.html


