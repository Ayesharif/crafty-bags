//login........................................................................................ area
import { auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "./firebase.js";
loaderOff();
document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault()
  loaderOn();
  

  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let login = async() => {


    await signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
loaderOff();
          
      })
      .catch((error) => {
        loaderOff();
        console.log(error.message);
        
        alert( error.code );

        // ..
      });
  }

login();


 onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user available")
      location.replace("index.html");
      // ...
    }
    else {
      console.log("not exist");

    }
  });
}
);


//signup........................................................................................ area


