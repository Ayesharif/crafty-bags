import { 
    auth,
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
  

  document.addEventListener("DOMContentLoaded", () => {
    let ProductCategory = "";  // Initialize the category value

    // Select all checkboxes with the "category-checkbox" class
    let checkboxes = document.querySelectorAll("#category");

    // Iterate over each checkbox and add an event listener
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                // Set ProductCategory to the checked value
                ProductCategory = event.target.value;
                
                // Uncheck all other checkboxes except the current one
                checkboxes.forEach(box => {
                    if (box !== event.target) {
                        box.checked = false;
                    }
                });
            } else {
                // If the checkbox is unchecked, reset the ProductCategory
                ProductCategory = "";
            }
            console.log("Selected Category (inside event):", ProductCategory); // Debugging line
        });
    });
    console.log(ProductCategory);
    

    // Form submission event
    document.getElementById("addproduct-form").addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Form Submitted");

        // Get form input values
        let productName = document.getElementById("p-name").value;
        let productDescription = document.getElementById("p-description").value;
        let productPrice = document.getElementById("price").value;
        let image = document.getElementById("image").files[0];

        console.log("Product Name:", productName);
        console.log("Product Description:", productDescription);
        console.log("Product Price:", productPrice);
        console.log("Selected Image:", image);
        
        // Double-check ProductCategory value before submission
        console.log( ProductCategory);

        // Check if the category has been selected
        if (!ProductCategory) {
            alert("Please select a category before submitting.");
        } else {
            // Proceed with form logic (e.g., upload image, store product, etc.)
            console.log("Product Category:", ProductCategory);
            // Further logic for submitting data goes here
        }


onAuthStateChanged(auth, (user) => {

    if (user) {

if(user.uid=="cMM1e2mMVMdcHUe0xWNQ8d1HFG72"){


        console.log("User is available");


        let addproduct = async () => { 
          loaderOn();
      
          try {
              const imageFiles = document.getElementById('image').files; // Assuming multiple images are selected using an input
              const downloadURLs = [];
      
              // Loop through all selected images
              for (let image of imageFiles) {
                  const storageReference = await storagerf(storage, 'productImages/' + image.name);
                  console.log('Uploading image:', image.name);
      
                  // Upload the image to Firebase Storage
                  const snapshot = await uploadBytes(storageReference, image);
                  console.log('Image uploaded successfully!', snapshot);
      
                  // Get the download URL for the uploaded image
                  const downloadURL = await getDownloadURL(snapshot.ref);
                  console.log('Image available at', downloadURL);
      
                  // Store the download URL in the array
                  downloadURLs.push(downloadURL);
              }
      
              // Generate a unique ID for the product
              const id = Date.now().toString();
      
              // Save product data to the Firebase Realtime Database
              await set(databaserf(db, 'products/' + id), {
                  productId: id,
                  ProductName: productName,
                  description: productDescription,
                  Price: productPrice,
                  category: ProductCategory,
                  imageUrls: downloadURLs // Store all image URLs as an array
              });
      
              alert('Product added successfully!');
              location.replace("index.html");
      
          } catch (error) {
              loaderOff();
              console.error('Error adding product:', error);
              alert('Error adding product: ' + error);
          } finally {
              loaderOff();
          }
      };
      
      // Call the function to add the product
      addproduct();
      
}else{
    alert("Not valid user")
}
    } else {
        alert("User does not exist")
      console.log("User does not exist");
    }
  });
});
});