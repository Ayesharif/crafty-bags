
import { get, child, databaserf, getDatabase , onAuthStateChanged, auth} from "./firebase.js";

window.addEventListener('beforeunload',(event)=>{

    localStorage.clear();
})
window.addEventListener('beforeunload', (event) => {
    localStorage.removeItem('cartProducts'); // Replace 'cartProducts' with the specific key
    localStorage.removeItem('otherKey'); // Clear other specific keys if necessary
});

document.addEventListener('DOMContentLoaded', event=>{
    event.preventDefault();
    let value = parseInt(document.querySelector("#value").textContent);

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
console.log(productId);

if (productId) {
    const dbRef = databaserf(getDatabase());
  
    // Fetch product details based on the product ID
    loaderOn();
    get(child(dbRef, `products/${productId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const product = snapshot.val();
  
            // Update the detail screen with the product data
            loaderOff()
console.log(product)

if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 1) {
    document.querySelector(".d-image").src = product.imageUrls[0]; // Display the second image
    document.querySelector(".d-image1").src = product.imageUrls[0]; // Display the second image
    document.querySelector(".d-image2").src = product.imageUrls[1]; // Display the second image

} else if (product.imageUrls && product.imageUrls.length > 0) {
    document.querySelector(".d-image").src = product.imageUrls[0]; // Default to the first image if only one exists
} else {
    console.log("No images available for this product.");
    document.querySelector(".d-image").src = 'path/to/placeholder-image.jpg'; // Fallback if no images exist
}
            document.querySelector(".d-name").textContent = product.ProductName;
            document.querySelector(".d-description").textContent = product.description;
            document.querySelector(".d-price").textContent = "RS. "+ product.Price;

            
            const dimage1=    document.querySelector(".d-image1");
           const dimage2 =document.querySelector(".d-image2");
           dimage2.addEventListener('click', ()=>{
                document.querySelector(".d-image").src = product.imageUrls[1];
                dimage2.style.cssText="outline: black solid 2px";
                dimage1.style.cssText="outline: none";
            })
       dimage1.addEventListener('click', ()=>{
                document.querySelector(".d-image").src = product.imageUrls[0];
                dimage1.style.cssText="outline: black solid 2px";
                dimage2.style.cssText="outline: none";
            })
            document.querySelector("#buynow").addEventListener('click', () => {

                onAuthStateChanged(auth,(user)=>{
                    if(user){


                // Get the current value of the counter
                const value = parseInt(document.querySelector("#value").textContent);
                if(value>0){

                
                // Calculate the total price (counter * product.Price)
                const totalPrice = value * product.Price;
            
                // Log or use the totalPrice variable
                console.log("Total Price:", totalPrice);

                const productId = product.productId;
                const productName = product.ProductName;
                const productPrice = product.Price;

                const productImage = product.imageUrls ? product.imageUrls[0] : '';
              
                console.log("Product ID:", productId);
                
                // Construct a URL with multiple query parameters
                const queryParams = new URLSearchParams({
                  id: productId,
                  name: productName,
                  price: productPrice,
                  image: productImage,
                  quantity: value,
                  subtotal:totalPrice
                }).toString();
              
                // Redirect to addtocard.html with query params
                window.location.href = `orderform.html?${queryParams}`;
                
            }else{
                alert("you can't but 0 quantity");
            }


        }else{
            alert("please login first");
        }
    })
                // You can now use totalPrice wherever you need it
            });
            

        var value =   document.querySelector("#value").textContent;
            console.log(value);
            document.getElementById("min").addEventListener('click', () => {
                if (value > 0) {  // Check if value is greater than 0 before decrementing
                    value--;
                    document.querySelector("#value").textContent = value;
                    
                    console.log();
                    
                    
                }
            });
            
            document.getElementById("max").addEventListener('click', () => {
                value++;  // No need to check for value here, since incrementing is allowed
                document.querySelector("#value").textContent = value;
            });
            
            
            
            
        } else {
            console.log("No product found");
        }
    }).catch((error) => {
        console.error("Error fetching product data:", error);
    });
  } else {
    console.log("No product ID in URL");
    
}

// Add event listeners for the buttons
            


})