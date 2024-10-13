import { getDatabase, databaserf, child, db, get } from "./firebase.js";

window.addEventListener('DOMContentLoaded', async (event) => {
    const dbRef = databaserf(db);

    try {
        // Fetch order details from Firebase
        const snapshot = await get(child(dbRef, 'OrderDetails'));
        if (snapshot.exists()) {
            const orders = snapshot.val(); // Get all the order data
            const orderContainer = document.getElementById("card"); // Main container
    
            // Loop through each order (assuming orders is an object)
            for (let orderId in orders) {
                let order = orders[orderId]; // Each individual order object
    
                // Create a new order card for each order
                const card = document.querySelector(".details").cloneNode(true);
    
                for (let senderId in order) {
                    let orderDetails = order[senderId]; // Individual order details (like fname, lname, etc.)
    
                    // Fill in the order details into the card
                    card.querySelector('.byName').textContent = orderDetails.fname + " " + orderDetails.lname || 'No Name'; // Set the order by name
                    card.querySelector('.id').textContent = orderDetails.orderid || 'No ID'; // Set the order ID
    
                    // Loop through products in the order
                    const productList = orderDetails.products; // Array of products
                    const firstContainer = card.querySelector(".Cont-first"); // Target the first container
    
                    // Remove existing product details in the clone (if any)
                    firstContainer.innerHTML = '';
    
                    let totalOrderPrice = 0; // Accumulator for total order price
                    let deliveryCharge = 0;
                    let nopro = orderDetails.products.length; // Number of products
    
                    let allProductsData = []; // To hold product data for all products
    
                    for (let productId in productList) {
                        let product = productList[productId]; // Individual product details
    
                        // Fetch product details from 'products' node
                        const productSnapshot = await get(child(dbRef, 'products/' + product.id));
                        if (productSnapshot.exists()) {
                            const productData = productSnapshot.val(); // Get the actual product data
    
                            let quantity = parseInt(product.quantity.replace("Quantity: ", ""));
                            let price = parseInt(productData.Price);
    
                            // Clone and insert the product details
                            const productCard = document.querySelector('.first').cloneNode(true);
    
                            productCard.querySelector('.name').textContent = productData.ProductName || 'No Product Name'; // Product name
                            productCard.querySelector('.price').textContent = productData.Price || 'No Price'; // Product price
                            productCard.querySelector('.image').src = productData.imageUrls || 'No Image'; // Product image
                            productCard.querySelector('.quantity').textContent = product.quantity.replace('Quantity: ', '') || 'No Quantity'; // Product quantity
    
                            // Append the productCard to the firstContainer
                            firstContainer.appendChild(productCard);
    
                            // Add product's total price to the totalOrderPrice
                            totalOrderPrice += quantity * price;
    
                            // Push the product data to the allProductsData array
                            allProductsData.push({
                                productName: productData.ProductName,
                                price: productData.Price,
                                productImage: productData.imageUrls,
                                quantity: quantity
                            });
                        } else {
                            console.log(`Product with ID ${product.id} not found`);
                        }
                    }
    
                    // Set delivery charge based on number of products
                    deliveryCharge = (nopro == 1) ? 200 : (nopro > 1) ? 0 : null;
    
                    // Calculate final total including delivery charge
                    const finalTotal = totalOrderPrice + deliveryCharge;
    
                    // Fill in other order details (middle container)
                    const middleContainer = card.querySelector('.middle');
                    middleContainer.querySelector('.delivery').textContent = deliveryCharge || '0'; // Delivery charge
                    middleContainer.querySelector('.method').textContent = orderDetails.paymentmethod || '0'; // Payment method
                    middleContainer.querySelector('.total').textContent = finalTotal || '0'; // Total price including delivery
               
               
                    card.querySelector(".printbtn").addEventListener('click', () => {
                        // Prepare an object containing the order details you want to store
                        const orderData = {
                            orderId: orderDetails.orderid,
                            customerName: orderDetails.fname + " " + orderDetails.lname,
                            contact: orderDetails.contact,
                            address: orderDetails.address,
                            postalCode: orderDetails.postal_code,
                            city: orderDetails.city,
                            country: orderDetails.country,
                            products: allProductsData, // All products stored in an array
                            paymentMethod: orderDetails.paymentmethod,
                            total: finalTotal,
                            deliveryCharge: deliveryCharge
                        };
        
                        // Convert the orderData object to a JSON string before storing it in localStorage
                        localStorage.setItem('orderData', JSON.stringify(orderData));
        
                        // Redirect to print page
                        location.href = "print.html";
                    });
                }
    
                // Append the complete order card to the main container
                orderContainer.appendChild(card);

                // Attach print event listener for each card after it is added to DOM
               
            }
    
            // Optionally, remove the original template card (if it exists)
            const firstCard = orderContainer.querySelector('.details'); // Select the original card by its class
            if (firstCard) {
                orderContainer.removeChild(firstCard);
            }
        } else {
            console.log("No orders available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});


document.addEventListener('DOMContentLoaded', async (even) => {
    even.preventDefault();

    const dbRef = databaserf(db);
    await get(child(dbRef, "SingleOrderDetails")).then((snapshot) => {
        if (snapshot.exists()) {
            const order = snapshot.val();
            const orderContainer = document.getElementById("card"); // Main container

            for (let orderId in order) {
                const orders = order[orderId];
                console.log(orders.fname);


                // Check if the original details element exists before cloning
                const originalDetails = document.querySelector(".details1");
                if (!originalDetails) {
                    console.error('Element with class "details1" not found');
                    return; // Stop further execution if element is not found
                }

                const card = originalDetails.cloneNode(true);
                for (let orderIds in orders) {
                    const Orders = orders[orderIds];
                    card.querySelector(".byName1").textContent = Orders.fname;
                    card.querySelector(".id1").textContent = Orders.orderId;

                    const firstContainer = card.querySelector(".Cont-first1"); // Target the first container
                    // Remove existing product details in the clone (if any)
                    firstContainer.innerHTML = '';
                    let allProductsData = [];
                    const originalProductCard = document.querySelector('.first1');
                    // Fetch product details based on product ID
                    get(child(dbRef, "products/" + Orders.productId)).then((productsnapshot) => {
                        if (productsnapshot.exists()) {
                            const productdata = productsnapshot.val();
                            console.log(productdata);

                            // Check if the original product card exists before cloning
                            if (!originalProductCard) {
                                console.error('Element with class "first1" not found');
                                return; // Stop further execution if element is not found
                            }




                            const productCard = originalProductCard.cloneNode(true);
                            const quantity=parseInt(Orders.quantity.replace("Quantity: ",""));
                            const price=parseInt(productdata.Price);

                            
                            
                            productCard.querySelector('.image1').src = productdata.imageUrls || 'No Image'; // Product image
                            productCard.querySelector('.name1').textContent = productdata.ProductName || 'No Product Name'; // Product name
                            productCard.querySelector('.price1').textContent = price || 'No Price'; // Product price
                            productCard.querySelector('.quantity1').textContent = quantity
                                ? Orders.quantity.replace('Quantity: ', '') // Remove "Quantity: " and leave only the number
                                : 'No Quantity';
                                const deliveryCharge = (quantity == 1) ? 100 : (Orders.quantity > 1) ? 0 : null;
const total=(price*quantity)+deliveryCharge;

                            productCard.querySelector('.delivery1').textContent = deliveryCharge
                             || '0'; // Delivery charge
                            productCard.querySelector('.method1').textContent = Orders.paymentmethod || '0'; // Payment method
                            productCard.querySelector('.total1').textContent = total || '0'; // Subtotal

                            const name= document.querySelector(".byName").textContent;
                            console.log(name);
                            
                            allProductsData.push({
                                productName: productdata.ProductName,
                                price: productdata.Price,
                                productImage: productdata.imageUrls,
                                quantity: quantity
                            });
                            productCard.querySelector(".printbtn1").addEventListener('click', () => {
                                // Prepare an object containing the order details you want to store
                                const orderData = {
                                    orderId: Orders.orderId,
                                    customerName: Orders.fname + " " + Orders.lname,
                                    contact: Orders.contact,
                                    address: Orders.address,
                                    postalCode: Orders.postal_code,
                                    city: Orders.city,
                                    country: Orders.country,
                                    products: allProductsData, // All products stored in an array
                                    paymentMethod: Orders.paymentmethod,
                                    total: total,
                                    deliveryCharge: deliveryCharge
                                };
            
                                // Convert the orderData object to a JSON string before storing it in localStorage
                                localStorage.setItem('orderData', JSON.stringify(orderData));
            
                                // You can now retrieve it later with JSON.parse(localStorage.getItem('orderData'))
                                console.log("Order data saved to localStorage");
                                location.href = "print.html";

                            });

                            // Append the productCard to the firstContainer
                            firstContainer.appendChild(productCard);

                        } else {
                            console.log(`Product with ID ${Orders.productId} not found`);
                        }
                    });
                }
                // Append the card to the main container after processing the products
                orderContainer.appendChild(card);
            }

            // Remove the original ".details1" template if it exists
            const detailsElement = document.querySelector(".details1");
            if (detailsElement) {
                detailsElement.remove();
            }
        } else {
            console.log("No orders found.");
        }
    }).catch((error) => {
        console.error("Error fetching order details:", error);
    });
});

