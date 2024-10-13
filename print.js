window.addEventListener('DOMContentLoaded', (event) => {
    // Get the order data from localStorage
    const savedOrder = JSON.parse(localStorage.getItem('orderData'));
const container=document.getElementById("container");
    // Make sure the savedOrder is available and valid
    if (savedOrder) {
        console.log(savedOrder);

        const city = savedOrder.city;
        const country = savedOrder.country;
        const products = savedOrder.products;
        const address = savedOrder.address;
        const postalCode = savedOrder.postalCode;
        const contact = savedOrder.contact;
        const orderId = savedOrder.orderId;
        const customerName = savedOrder.customerName;
        const paymentMethod = savedOrder.paymentMethod;
        const total = savedOrder.total;
        const deliveryCharge = savedOrder.deliveryCharge;
        let price = 0 ; 
        let quantity = 0 ;
        let subtotal= 0;

        // Update the order details in the DOM
        document.querySelector(".orderid").textContent = orderId;
        document.querySelector(".method").textContent = paymentMethod;
        document.querySelector(".name").textContent = customerName;
        document.querySelector(".contact").textContent = contact;
        document.querySelector(".postalcode").textContent = postalCode;
        document.querySelector(".address").textContent = address;
        document.querySelector(".city").textContent = city;
        document.querySelector(".country").textContent = country;

        // Iterate over products and update product information
        if (products && products.length > 0) {
            products.forEach(productData => {
                const productName = productData.productName;
                 price = parseInt(productData.price);
                 quantity = parseInt(productData.quantity);
                const image = productData.productImage;
                const card=document.querySelector(".order").cloneNode(true);

                subtotal +=quantity*price;
                
                console.log(subtotal);
                
                
                // Assuming there is a section in your HTML to display product information
                card.querySelector(".pname").textContent = productName;
                card.querySelector(".price").textContent = price;
                card.querySelector(".quantity").textContent = quantity;
                card.querySelector(".image").src = image;
                container.appendChild(card)
            });
document.querySelector(".order").remove();
        } else {
            console.log("No products found");
        }
        document.querySelector(".subtotal").textContent=subtotal;
        document.querySelector(".delivery").textContent=deliveryCharge;
        document.querySelector(".total").textContent=total;

        const nopro=products.length;
        console.log(nopro);
        document.querySelector(".Nopro").textContent=nopro;
        document.querySelector(".Cname").textContent=customerName;
        document.querySelector(".Ccontact").textContent=contact;
        document.querySelector(".Caddress").textContent=address +", "+city+", "+country;
        document.querySelector(".cost").textContent=total;
        
        
    } else {
        console.log("No order data found");
    }

    // Add an event listener for printing the order
    document.querySelector(".print").addEventListener('click', function () {
        window.print();
        console.log("Print initiated");
    });
});
