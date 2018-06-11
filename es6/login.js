function check(form) {
 if(form.userid.value == "kassis" && form.pswrd.value == "kassis") {
    window.location.replace('../index.html')
    localStorage.setItem('auth', 'true')
  }
 else { alert("Please enter a valid user and password!!") }
}