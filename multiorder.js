import { auth, onAuthStateChanged, set, databaserf, db } from "./firebase.js";


loaderOff()
window.addEventListener("DOMContentLoaded", event => {
    event.preventDefault();

    // Retrieve the product data from localStorage

    onAuthStateChanged(auth,async (user)=>{

        if(user){
            const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    
            const productsContainer = document.getElementById("multiorder");
            
            if (cartProducts && cartProducts.length > 0) {
                let multiSub = 0;  // Variable to store the sum of all subtotals
                
                cartProducts.forEach(product => {
                    // Retrieve each product's data including the image
                    const productId=product.id;
                    const name = product.name;
                    const quantity = product.quantity;
                    const price = product.price;
                    const image = product.image; // Get the image URL
                    const subtotal = product.subtotal;
                    
                    // Calculate the running total of all subtotals
                    multiSub += subtotal;
        
                    console.log(name);
                    
                    // Clone the card template for each product
                    const card = document.querySelector("#details").cloneNode(true);
        
                    // Update card details with the product data
                    card.querySelector('#p-image').src = image;
                    card.querySelector('#p-image').alt=productId;
                    card.querySelector('#p-name').textContent = name;
                    card.querySelector('#p-price').textContent = "RS: " + price;
                    card.querySelector('#quantity').textContent = "Quantity: " + quantity;
                    card.querySelector('.subTotal').textContent = "RS: " + subtotal;
        
                    // Append the card to the products container
                    productsContainer.appendChild(card);
                });
        
                // Remove the first card template if it's not needed anymore
                const firstCard = document.querySelector("#details");
                if (firstCard) {
                    productsContainer.removeChild(firstCard);
                }
        
                // Update the calculated subtotal for all products
                document.querySelector('.compTotal').textContent = "RS: " + multiSub;
        
                // Calculate and display the total with shipping cost (if any)
                let shipping = cartProducts.length * 100;  // Example: 100 RS per product for shipping
                let total = multiSub + shipping;
                document.querySelector('#shipping').textContent = "RS: " + shipping;
                document.querySelector('#total').textContent = "RS: " + total;
        


                const userId= user.uid
                const orderid= Date.now().toString();
                    
                    console.log(userId);
                    
                    
                    // Store order details in the database
                
                   
document.getElementById("orderdetails").addEventListener("submit",async event=>{
    event.preventDefault();

    loaderOn()
    try{
        const productQuantities = document.querySelectorAll('#quantity');
        const productIds = document.querySelectorAll('#p-image');
        
        const products = [];
        
        productQuantities.forEach((quantityElement, index) => {
            const quantity = quantityElement.textContent;
            const productId = productIds[index].alt; // Get the corresponding product ID using the same index
        
            // Push both product ID and quantity as an object
            products.push({
                id: productId,    // Key for ID
                quantity: quantity // Key for quantity
            });
        });
        
        console.log('Products:', products);
        


    // Fetch values from input fields
    const fname = document.querySelector('#fname').value; // Use .value instead of .textContent
    const lname = document.querySelector('#lname').value;
    const contact = document.querySelector('#contact').value;
    const postal_code = document.querySelector('#postal-code').value;
    const address = document.querySelector('#address').value;
    const city = document.querySelector('#city').value;
    
    // Get the selected country
    const countrySelect = document.getElementById('country');
    const selectedCountry = countrySelect.value;
    
    // Payment method could also be a value, depending on how it's structured (radio buttons, etc.)
    const payment = document.querySelector('#cod').value; // Assuming radio buttons for payment method

    // Display loader while submitting data
    
    const userId= user.uid
const orderid= Date.now().toString();
    
    console.log(userId);
    if(products.length===1){
const singleproduct= products[0].id;
const singlequantity= products[0].quantity;

await set(databaserf(db, 'SingleOrderDetails/' + `${userId}/` +orderid), {

    orderby:userId,
    orderid:orderid,
    productId: singleproduct,
    quantity:singlequantity,
     fname: fname,
     lname: lname,
     contact: contact,
     postal_code: postal_code,
     address: address,
     city: city,
     country: selectedCountry,
     paymentmethod: payment
      // Store payment method
 }).then(() => {
     // Success: Show alert and redirect
     loaderOff()
     alert('Successfully placed the order!');
     location.replace("index.html");
 }).catch(error => {
     console.error("Error placing order:", error);
 }).finally(() => {
     loaderOff(); // Turn off the loader once operation is done
 });


    }else if(products.length>1){
        console.log("muti");

        await set(databaserf(db, 'OrderDetails/' + `${userId}/` +orderid), {

            orderby:userId,
            orderid:orderid,
            products: products,
             fname: fname,
             lname: lname,
             contact: contact,
             postal_code: postal_code,
             address: address,
             city: city,
             country: selectedCountry,
             paymentmethod: payment
              // Store payment method
         }).then(() => {
             // Success: Show alert and redirect
             loaderOff()
             alert('Successfully placed the order!');
             location.replace("index.html");
         }).catch(error => {
             console.error("Error placing order:", error);
         }).finally(() => {
             loaderOff(); // Turn off the loader once operation is done
         });
     
    }
    
    // Store order details in the database

    
 
} catch (error) {
    loaderOff();
    console.error('Error adding product:', error);
    alert('Error adding product: ' + error);
} finally {
    loaderOff();
}
})


            } else {
                // If no products are in the cart, show a message
                const firstCard = document.querySelector("#details");
                if (firstCard) {
                    document.getElementById("order").style.cssText = "display: flex; justify-content: center; align-items: center";
                    firstCard.innerHTML = "<p>No products found in cart.</p>";
                }
                console.log("No products found in cart.");
            }
        }else{
            alert('Please login');
            location.replace("login.html");
        }
    })

});
