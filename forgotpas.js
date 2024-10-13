import { auth,onAuthStateChanged,sendPasswordResetEmail } from "./firebase.js";
loaderOff();
document.getElementById("reset-btn").addEventListener("click", (event) => {
  event.preventDefault()

let email=document.getElementById("email");
// console.log(email.value);
 let resetpas = async()=>{
    console.log("processeing");
loaderOn();
   await  sendPasswordResetEmail(auth, email.value)
  .then(() => {
loaderOff();
alert("Sent");

    console.log("sent");
    location.replace("login.html");

  })
  .catch((error) => {
    loaderOff();
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    
    alert(errorCode);
    // ..
  });
}
 resetpas();
});