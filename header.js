import { auth, onAuthStateChanged,createUserWithEmailAndPassword, onValue,signInWithEmailAndPassword, signOut, get, databaserf, db, child, getDatabase  } from "./firebase.js";


window.addEventListener('DOMContentLoaded',async event=>{
    event.preventDefault();
 const x=window.matchMedia("(max-width:815px)");
 if(x.matches){

   document.getElementById("ul").style.width="0px";
 }


    document.getElementById("open").href="javascript:void(0)";
    document.getElementById("close").href="javascript:void(0)";
  document.getElementById("open").addEventListener('click',  function openSlider(){
  document.getElementById("ul").style.width="230px";

});

document.getElementById("close").addEventListener('click', function closeSlider(){
  document.getElementById("ul").style.width="0";
})

const addpro= document.getElementById("ap");
addpro.style.display="none";

let logout= ()=>{

  signOut(auth ).then(() => {
    // Sign-out successful.
    console.log("user gone");
    location.replace("login.html");
  }).catch((error) => {
    // An error happened.
    console.log("user not gone",error );
  });
};
function profile (){
location.replace("profile.html");
}

document.getElementById("ap").addEventListener("click", (event)=>{
  location.replace("addproduct.html");
});
document.getElementById("profile").addEventListener("click",profile);
document.getElementById("logout").addEventListener("click",logout);


const dbRef = databaserf(getDatabase());

// Fetch all products

document.getElementById("pearl-bags").addEventListener('click',()=>{
  location.replace("pearl.html");
})
document.getElementById("crystal-bags").addEventListener('click',()=>{
  location.replace("crystal.html");
})

    

onAuthStateChanged(auth, (user) => {
    if (user) {
if(user.uid=="cMM1e2mMVMdcHUe0xWNQ8d1HFG72"){
    document.getElementById("ap").style.display="block";
}
else{
    document.getElementById("ap").style.display="none";
}
      
document.querySelector('#cart').href="addtocard.html";

      console.log("good");
      if(user  &!user.emailVerified ){
        console.log("bad");

        document.getElementById("emailverification").style.display="none";
        
        document.getElementById("notverified").style.display="block";
      }else{
        // document.getElementById("notverified").style.display="none";
        // document.getElementById("emailverification").style.display="block";
        console.log("good");
        console.log("exist" + user.emailVerified);  
       
        
      }
        
 // location.replace("index.html")
  }else{
    console.log("not exist");
    document.getElementById("logout").innerHTML="Login";
    document.getElementById("logout").href="login.html";
    document.getElementById("profile").innerHTML="Sign up";
    document.getElementById("profile").href="Signup.html";
    // document.getElementById("notverified").style.display="none";
    // location.replace("index.html") 
  }
});
});