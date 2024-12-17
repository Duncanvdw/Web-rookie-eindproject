// Function to add product to cart
function addToCart(name, description, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.name === name);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ name, description, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    const notification = document.getElementById('notification');
    notification.innerText = `${name} is toegevoegd aan de winkelwagen!`;
    notification.classList.add('show');

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to update product quantity in cart
function updateQuantity(name, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.name === name);
    if (product) {
        product.quantity += quantity;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Add event listener to "toevoegen aan winkelwagen" button
document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const name = this.getAttribute('data-name');
        const description = this.getAttribute('data-description');
        const price = this.getAttribute('data-price');
        addToCart(name, description, price);
    });
});

// Function to display cart items
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="leeg">Je winkelwagen is leeg.</p>';
        return;
    }
    let table = document.createElement('table');
    table.className = 'cart-table';
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Prijs</th>
            <th>Aantal</th>
        </tr>
    `;
    cart.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>€${item.price}</td>
            <td>
                <button class="quantity-button" onclick="updateQuantity('${item.name}', -1)">-</button>
                ${item.quantity}
                <button class="quantity-button" onclick="updateQuantity('${item.name}', 1)">+</button>
            </td>
        `;
        table.appendChild(row);
    });
    cartContainer.appendChild(table);
    displayTotalPrice(); // Add this line to update total price
}

// Function to calculate and display total price
function displayTotalPrice() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.querySelector('.totaalprijs').innerText = `€${totalPrice.toFixed(2)}`;
}

// Call displayCart when the page loads
window.onload = displayCart;

// Add event listener to "afrekenen" button
document.getElementById('afrekenen').addEventListener('click', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    let order = {
        totalPrice: totalPrice.toFixed(2),
        date: new Date().toLocaleString()
    };
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart'); // Clear the cart after checkout
});

// Make addToCart function accessible globally
window.addToCart = addToCart;