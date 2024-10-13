import { auth , signOut   } from "./firebase.js";

window.addEventListener("load", (event)=>{
event.preventDefault()

let logout= async()=>{
    loaderOn();
    await  signOut(auth ).then(() => {
        // Sign-out successful.
        console.log("user gone");
        location.replace("login.html");
      }).catch((error) => {
        loaderOff()
        // An error happened.
      alert("console.log('user not gone',error )")  ;
      });
    };
    document.getElementById("logout").addEventListener("click", logout);
});