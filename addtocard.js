import { databaserf, getDatabase, get, child, set, remove, db, onAuthStateChanged, auth } from "./firebase.js";

loaderOff();
window.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();

    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is logged in
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const productName = urlParams.get('name');
            const productPrice = urlParams.get('price');
            const productImage = urlParams.get('image');

            console.log(productId, productName, productPrice, productImage);

            // Add product to cart in Firebase if productId exists
            if (productId) {
                loaderOn();
                await set(databaserf(db, 'addtocard/' + productId), {
                    productId: productId,
                    ProductName: productName,
                    Price: productPrice,
                    imageUrls: productImage, // Store image URLs
                });
                alert('Product added successfully!');
            }

            // Function to calculate and update the subtotal
            const updateSubtotal = () => {
                let subtotal = 0;
                let checkedProducts = [];
            
                // Loop through each product card to calculate the subtotal
                document.querySelectorAll(".detailcard").forEach((card) => {
                    const checkbox = card.querySelector("#checkbox");
                    const price = parseInt(card.querySelector(".d-price").textContent.replace("RS. ", ""));
                    const quantity = parseInt(card.querySelector("#value").textContent);
            
                    // Extract product data
                    const id = card.querySelector('.d-image').alt;
                    
                    
                    const name = card.querySelector('.d-name').textContent;
                    const image = card.querySelector('.d-image').src; // Store the image URL
                    const total = quantity * price;
            
                    // Create product object
                    const product = {
                        id: id,
                        name: name,
                        quantity: quantity,
                        price: price,
                        image: image, // Include image in object
                        subtotal: total
                    };
            
                    // Only store and add to subtotal if the checkbox is checked
                    if (checkbox.checked) {
                        subtotal += total; // Add to subtotal if checked
                        checkedProducts.push(product); // Only push checked products to the array
                    }
                });
            
                // Update the subtotal on the page
                document.querySelector(".SubTotal").textContent = `Subtotal: RS. ${subtotal}`;
            
                // Store only the checked products in localStorage
                localStorage.setItem('cartProducts', JSON.stringify(checkedProducts));
            };
            

            // Fetch products from Firebase Realtime Database
            const dbRef = databaserf(getDatabase());
            await get(child(dbRef, 'addtocard')).then((snapshot) => {
                if (snapshot.exists()) {
                    const products = snapshot.val();
                    console.log(products);

                    const productsContainer = document.getElementById("addtocard");

                    // Loop through products and populate the UI
                    for (let productId in products) {
                        const product = products[productId];

                        const card = document.querySelector(".detailcard").cloneNode(true);

                        card.querySelector(".d-image").alt = product.productId;
                        card.querySelector(".d-image").src = product.imageUrls;
                        card.querySelector(".d-name").textContent = product.ProductName;
                        card.querySelector(".d-price").textContent = product.Price;
                        card.setAttribute('data-id', productId);

                        let value = parseInt(card.querySelector("#value").textContent); // Initialize value for each product

                        // Increment button event listener
                        card.querySelector("#max").addEventListener('click', () => {
                            value++;
                            card.querySelector("#value").textContent = value;
                            updateSubtotal(); // Update subtotal on quantity change
                        });

                        // Decrement button event listener
                        card.querySelector("#min").addEventListener('click', () => {
                            if (value > 1) {
                                value--;
                                card.querySelector("#value").textContent = value;
                                updateSubtotal(); // Update subtotal on quantity change
                            }
                        });

                        // Checkbox event listener
                        const checkbox = card.querySelector("#checkbox");
                        checkbox.addEventListener('change', () => {
                            updateSubtotal(); // Recalculate subtotal on checkbox change
                        });

                        // Delete product event listener
                        const delbtn = card.querySelector("#d-id");
                        delbtn.addEventListener('click', async () => {
                            const dbRef = databaserf(db, `addtocard/${productId}`);
                            await remove(dbRef).then(() => {
                                console.log(`Product ${productId} removed successfully`);
                                document.querySelector(`[data-id="${productId}"]`).remove(); // Remove from DOM
                                updateSubtotal(); // Update subtotal after deletion
                            }).catch((error) => {
                                console.error("Error removing product:", error);
                            });
                        });

                        productsContainer.appendChild(card); // Append card to container
                    }

                    // Remove the first empty template card after populating products
                    const firstCard = document.querySelector(".detailcard");
                    if (firstCard) {
                        productsContainer.removeChild(firstCard);
                    }
                    loaderOff();
                } else {
                    const firstCard = document.querySelector(".detailcard");
                    if (firstCard) {
                        firstCard.innerHTML = "No products added here.";
                        document.getElementById("addtocard").style.cssText = "display: flex; justify-content: center; align-items: center";
                    }
                    console.log("No products available");
                    loaderOff();
                }
            }).catch((error) => {
                console.error("Error fetching data:", error);
                loaderOff();
            });

            document.getElementById('checkout').addEventListener('click', () => {
                let isProductSelected = false;
            
                // Loop through each product card to check if any checkbox is selected
                document.querySelectorAll(".detailcard").forEach((card) => {
                    const checkbox = card.querySelector("#checkbox");
            
                    if (checkbox.checked) {
                        isProductSelected = true;  // Mark that a product is selected
                    }
                });
            
                // If at least one product is selected, redirect to the order form page
                if (isProductSelected) {
                    location.replace('multiorderform.html');
                } else {
                    alert("Please select at least one product");
                }
            });
            
        } else {
            // User is not logged in, clear localStorage
            localStorage.clear();
        }
    });
});
