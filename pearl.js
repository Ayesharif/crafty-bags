import { auth, onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut, get, databaserf, db, child, getDatabase  } from "./firebase.js";
loaderOff()

window.addEventListener('DOMContentLoaded',async event=>{
  event.preventDefault();

  document.getElementById("pearl-bags").addEventListener('click',event=>{
    location.replace("pearl.html");
  })
  document.getElementById("crystal-bags").addEventListener('click',event=>{
    location.replace("crystal.html");
  })

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
loaderOff();
await get(child(dbRef, 'products')).then((snapshot) => {
  if (snapshot.exists()) {
      const products = snapshot.val();
      console.log(products);

      // Get the container where products will be appended
      const productsContainer = document.getElementById("products-container");

      // Loop through each product and update the written HTML
      for (let productId in products) {
          const product = products[productId];

          // Check if the product's category is "Crystal"
          if (product.category === "Pearl") {

              // Clone the card template for each product
              const card = document.querySelector(".card").cloneNode(true);

              // Update the image, name, and price with product data
              if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1) {
                  card.querySelector(".p-image").src = product.imageUrls[0]; // Display the second image
              } else if (product.imageUrls && product.imageUrls.length > 0) {
                  card.querySelector(".p-image").src = product.imageUrls[0]; // Default to the first image if only one exists
              } else {
                  console.log("No images available for this product.");
                  card.querySelector(".p-image").src = 'path/to/placeholder-image.jpg'; // Fallback if no images exist
              }

              card.querySelector(".p-name").textContent = product.ProductName;
              card.querySelector(".p-price").textContent = "RS. " + product.Price;
              card.setAttribute('data-id', product.productId);

              // Add event listener to card for redirecting to the detail page
              const details = card.querySelector(".p-name");
              const buynow = card.querySelector("#buynow");
              details.addEventListener('click', () => {
                  // Navigate to detail screen with product ID in URL
                  window.location.href = `detail.html?id=${productId}`;
              });

              // const addToCartButton = card.querySelector('#submitbtn');
              // addToCartButton.addEventListener('click', (event) => {
              //     // Prevent the form or button from causing a page reload
              //     event.preventDefault();
                
              //     // Get multiple data from the product
              //     const productId = card.getAttribute('data-id');
              //     const productName = product.ProductName;
              //     const productPrice = product.Price;
              //     const productImage = product.imageUrls ? product.imageUrls[0] : '';
                
              //     console.log("Product ID:", productId);
                  
              //     // Construct a URL with multiple query parameters
              //     const queryParams = new URLSearchParams({
              //       id: productId,
              //       name: productName,
              //       price: productPrice,
              //       image: productImage
              //     }).toString();
                
              //     // Redirect to addtocard.html with query params
              //     window.location.href = `addtocard.html?${queryParams}`;
              // });
                        
              // Append the updated card to the container
              productsContainer.appendChild(card);
          }
      }

      // Remove the first empty template card
      productsContainer.removeChild(document.querySelector(".card"));
      loaderOff();
  } else {
      console.log("No products available");
  }
}).catch((error) => {
  console.error("Error fetching data:", error);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
if(user.uid=="cMM1e2mMVMdcHUe0xWNQ8d1HFG72"){
  document.getElementById("ap").style.display="block";
}


      console.log("good");
      if(user  &!user.emailVerified ){
        console.log("bad");

        document.getElementById("emailverification").style.display="none";
        
        document.getElementById("notverified").style.display="block";
      }else{
        document.getElementById("notverified").style.display="none";
        document.getElementById("emailverification").style.display="block";
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
    document.getElementById("notverified").style.display="none";
    // location.replace("index.html") 
  }
});
})