import { 
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  db, 
  databaserf, 
  set, 
  storage, 
  storagerf,
  uploadBytes,
  getDownloadURL
} from "./firebase.js";
loaderOff();
window.addEventListener("DOMContentLoaded",(event)=>{
  event.preventDefault();

const handlegoogle= async () =>{
}

document.getElementById("fa-google-plus-g").addEventListener('click',async ()=>{
  console.log("log");
  const provider= await new GoogleAuthProvider();
  return  signInWithPopup(auth,provider);
  
})
document.getElementById("signup-form").addEventListener("submit",  (event) => {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let firstName = document.getElementById("F-name").value;
  let lastName = document.getElementById("L-name").value;
  let image = document.getElementById("image").files[0];

 const  signup = async () => {
loaderOn();
     await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        // loaderOff()
        var user = userCredential.user;
        console.log(user);

        const storageReference = storagerf(storage, 'images/' + image.name);
        console.log('processing!');
        // Upload the image to Firebase Storage
        // loaderOn()
       await uploadBytes(storageReference, image).then(async(snapshot) => {
        // loaderOff()
          console.log('Image uploaded successfully!', snapshot);
          console.log('processing!');
        await  getDownloadURL(snapshot.ref).then(async(downloadURL) => {
            console.log('Image available at', downloadURL);

            
            // const userId = databaserf(db, 'users/' + user.name);
            console.log('processing!');
            // loaderOn()
          await  set( databaserf (db, 'users/' + user.uid), {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password, // Note: Storing passwords in plain text is not secure; use Firebase Auth instead
              imageUrl: downloadURL
            });

            alert('User signed up successfully!');

               sendEmailVerification(auth.currentUser)
            .then(() => {
              


              alert("We have sent you an email verification link.");
              location.replace("login.html");

              // if(c){

              // }
              // ...
            });
          }).catch((error) => {
            loaderOff()
            alert("Error getting image URL:" + error);
            console.error('Error getting image URL:', error);
          });

        }).catch((error) => {
          loaderOff()
          alert("Error uploading image:" +error);
          console.error('Error uploading image:', error);
        });
    
      })
      .catch((error) => {
        loaderOff()
        console.log(error.message);
        alert("Error: " + error.message);
      });
  }

  signup(); // Call the signup function to register the user

  // Monitor auth state change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // location.replace("login.html");
      console.log("User is available" );
    } else {
      console.log("User does not exist");
    }
  });
});
});