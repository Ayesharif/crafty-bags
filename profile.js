import { auth, onAuthStateChanged, get, databaserf, db, child, signOut  } from "./firebase.js";
loaderOff()
window.addEventListener("load", (event) => {
    console.log("Page fully loaded");
event.preventDefault();

function profile (){
  location.replace("profile.html");
  }
  
  document.getElementById("profile").addEventListener("click",profile);

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
function update() {
  location.replace("update.html");
}
  document.getElementById("change-btn").addEventListener("click", update);
  
  
  
  // let signoutbtn= document.getElementById("logout-btn");
  // signoutbtn.addEventListener("click",logout);
onAuthStateChanged(auth, async (user)  => {
    if (user) {

      
 const dbRef =databaserf(db);      
 loaderOn();     
 await get(child(dbRef, `users/${auth.currentUser.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("image").src = `${data.imageUrl}`;
            document.getElementById("firstN").innerHTML = `${data.firstName}`;
            document.getElementById("lastN").innerHTML = `${data.lastName}`;
            document.getElementById("email").innerHTML = `${data.email}`;
            loaderOff();
          } else {
            loaderOff();
            console.log("No data available");
            alert("No data available");
          }
        })
        .catch((error) => {
          loaderOff();
          console.error("Error retrieving user data:", error);
          alert(error);
  });
     
  await get(child(dbRef, "OrderDetails/" + user.uid))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const container = document.getElementById("myorders");
      console.log(data);

      // Loop through orders
      for (let orderID in data) {
        const orderdetails = data[orderID];

        // Loop through products in each order
        for (let productdetails in orderdetails.products) {
          const productnum = orderdetails.products[productdetails];

          console.log(productnum.quantity);

          // document.getElementById("#details").style.cssText="display:flex; flex";
          // Fetch product details
          const card = document.getElementById("details").cloneNode(true);
          get(child(dbRef, "products/" + productnum.id)).then((productSnapshot) => {
            if (productSnapshot.exists()) {
              const productdata = productSnapshot.val();
              card.style.display = "block"; // Ensure cloned card is visible
              
              // Select the elements inside the cloned card
            card.querySelector("#p-image").src = productdata.imageUrls;
             card.querySelector("#p-name").textContent = productdata.ProductName;
             card.querySelector("#p-price").innerHTML = productdata.Price;
            card.querySelector("#quantity").innerHTML = productnum.quantity.replace("Quantity:","");
            // card.querySelector("#subTotal").innerHTML = orderdetails.Subtotal;

              // Append the cloned card to the container
              container.appendChild(card);
            }
          }).catch((error) => {
            console.error("Error retrieving product data:", error);
          });
        }

      }
      loaderOff();
      // Remove the original ".details1" template if it exists
      // container.removeChild(document.querySelector("#details"));
    } else {
      loaderOff();
      console.log("No data available");
    }
  })
  .catch((error) => {
    loaderOff();
    console.error("Error retrieving order data:", error);
  });


  await get(child(dbRef, "SingleOrderDetails/" + user.uid))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const container = document.getElementById("myorders");
      console.log(data);

      // Loop through orders
      for (let orderID in data) {
        const orderdetails = data[orderID];
        
        console.log(orderdetails.productId);
        

        // Loop through products in each order

          // document.getElementById("#details").style.cssText="display:flex; flex";
          // Fetch product details
          const card = document.getElementById("details").cloneNode(true);
          get(child(dbRef, "products/" + orderdetails.productId)).then((productSnapshot) => {
            if (productSnapshot.exists()) {
              const productdata = productSnapshot.val();
              card.style.display = "block"; // Ensure cloned card is visible
              
              // Select the elements inside the cloned card
            card.querySelector("#p-image").src = productdata.imageUrls;
             card.querySelector("#p-name").textContent = productdata.ProductName;
             card.querySelector("#p-price").innerHTML = productdata.Price;
            card.querySelector("#quantity").innerHTML = orderdetails.quantity.replace("Quantity:","");
            // card.querySelector("#subTotal").innerHTML = orderdetails.Subtotal;

              // Append the cloned card to the container
              container.appendChild(card);
            }
          }).catch((error) => {
            console.error("Error retrieving product data:", error);
          });
        

      }
      loaderOff();
      // Remove the original ".details1" template if it exists
      container.removeChild(document.querySelector("#details"));
    } else {
      loaderOff();
      console.log("No data available");
    }
  })
  .catch((error) => {
    loaderOff();
    console.error("Error retrieving order data:", error);
  });


 // location.replace("index.html")
  }else{
    console.log("not exist");

    location.replace("index.html") 
  }
});

});