import { auth, onAuthStateChanged, set, databaserf,db } from "./firebase.js";


window.addEventListener('beforeunload',(event)=>{

    localStorage.clear();
})

loaderOff()

window.addEventListener("DOMContentLoaded", event=>{
    event.preventDefault();
    
             const urlParams = new URLSearchParams(window.location.search);
             const productId = urlParams.get('id');
             const productName = urlParams.get('name');
             const productPrice = urlParams.get('price');
             const productImage = urlParams.get('image');
             const productquantity = urlParams.get('quantity');
             const subtotal = parseInt(urlParams.get('subtotal'));
         
             console.log(productId, productName, productPrice, productImage, productquantity, subtotal);

    onAuthStateChanged(auth,(user)=>{

        if (user){

        

// console.log(orderid);



            document.querySelector('#p-image').src=productImage;
            document.querySelector('#p-image').alt=productId;
            document.querySelector('#p-name').textContent=productName;
            document.querySelector('#p-price').textContent="RS  : " +productPrice;
            document.querySelector('#quantity').textContent=productquantity;
            document.querySelector('.subTotal').textContent=subtotal;
            document.querySelector('#compTotal').textContent=subtotal;
           console.log();
           
            let shopping=0;
            if(productquantity && productquantity==1){
                shopping=productquantity*150;
                            
                
            }else if(productquantity>1){
                shopping=0;

            }
            console.log(productquantity);
            

            let total=subtotal+shopping;
            document.querySelector('#shipping').textContent= "RS : "+shopping;
            document.querySelector('#total').textContent= "RS : "+ total;
          
            
            
document.getElementById("orderdetails").addEventListener("submit",async event=>{
    event.preventDefault();

    loaderOn()
    const id = document.querySelector('#p-image').alt;
    const productquantity = document.querySelector('#quantity').textContent;

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
    
    
    // Store order details in the database


   await set(databaserf(db, 'SingleOrderDetails/' + `${userId}/` +orderid), {

        productId: id,
        quantity: productquantity,
        fname: fname,
        lname: lname,
        orderId:orderid,
        orderby: userId,
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
})


}
else{
alert("please login first");
location.replace("login.html");

    
}
})         // let order = async()=> {


            // }
            
                
            



// onAuthStateChanged(auth, (user)=>{

//     if(user){
//     }
//     else{
//         console.log('not available');
        
//     }
// });

})