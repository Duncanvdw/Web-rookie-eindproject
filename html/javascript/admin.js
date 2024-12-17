// Base products data
const baseProducts = [
    {
        name: "Ferrari 488 FI Exhaust system",
        price: "8500",
        image: "./images/488-exhaust.jpg",
        description: "Ferrari 488 GTB / Spider Fi Exhaust (Frequency Intelligent Exhaust) high-performance valvetronic exhaust system"
    },
    {
        name: "Ferrari 488 AirREX luchtvering",
        price: "6500",
        image: "./images/488-vering.jpg",
        description: "Elevate your ride with customizable handling dynamics for unparalleled performance on any road with Ferrari 488 AirREX Air Suspension."
    },
    {
        name: "Ferrari 488 Liberty Walk kit",
        price: "32500",
        image: "./images/488-liberty.jpg",
        description: "Transform your Ferrari 488 with the bold Liberty Walk Body Kit, enhancing its iconic design for a powerful, individualized look."
    },
    {
        name: "Ferrari 488 Twin turbo kit",
        price: "6000",
        image: "./images/488-twin-turbo.jpg",
        description: "Experience a significant boost in power and torque with the TTE950 Twin Turbo Kit for the Ferrari 488."
    },
    {
        name: "Ferrari 488 Tail lights",
        price: "2500",
        image: "./images/488-taillights.jpg",
        description: "The Ferrari 488's tail lights feature distinctive circular designs and glowing red rings, enhancing the car's aggressive and sleek rear profile."
    },
    {
        name: "Ferrari 488 Liberty Walk spoiler",
        price: "5000",
        image: "./images/488-spoiler.jpg",
        description: "Make a statement with the Ferrari 488 Liberty Walk Rear Wing - Version 2 Duck Tail, combining style with performance."
    }
];

// Load products from localStorage or fall back to base products
let productsData = JSON.parse(localStorage.getItem('productsData')) || [...baseProducts];

// Save the base products to localStorage if no data exists
if (!localStorage.getItem('productsData')) {
    localStorage.setItem('productsData', JSON.stringify(productsData));
}

// Function to render the table
function renderTable(productsData) {
    const productTableBody = document.getElementById('productTableBody');
    productTableBody.innerHTML = '';
    productsData.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${index + 1}</td>
            <td class="px-4 py-2"><img src="${product.image}" alt="${product.name}" class="h-16"></td>
            <td class="px-4 py-2">${product.name}</td>
            <td class="px-4 py-2">${product.price}</td>
            <td class="px-4 py-2">
                <button data-modal-target="default-modal" data-modal-toggle="default-modal" data-index="${index}" class="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700 modal-toggle-button" type="button">Edit</button>                
                <button class="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700" onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });

    // Add event listeners to the edit buttons
    document.querySelectorAll('.modal-toggle-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const product = productsData[index];
            populateEditForm(product, index);

            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });
}

// Function to populate the modal form
function populateEditForm(product, index) {
    document.getElementById('editProductId').value = index;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPicture').value = ''; // Reset file input
}

// Function to save changes
function saveChanges() {
    const index = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const price = document.getElementById('editProductPrice').value;
    const description = document.getElementById('editProductDescription').value;
    const imageInput = document.getElementById('editProductPicture');
    const imageFile = imageInput.files[0];

    // Update the product in the array
    const updatedProduct = productsData[index];
    updatedProduct.name = name;
    updatedProduct.price = price;
    updatedProduct.description = description;

    if (imageFile) {
        updatedProduct.image = URL.createObjectURL(imageFile);
    }

    // Save the updates to localStorage
    localStorage.setItem('productsData', JSON.stringify(productsData));

    // Update the table
    renderTable(productsData);

    // Close the modal
    closeModal();

    // Update the cart if the product is in the cart
    updateCartProduct(updatedProduct);
}

function updateCartProduct(updatedProduct) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.map(item => {
        if (item.name === updatedProduct.name) {
            return {
                ...item,
                price: updatedProduct.price,
                description: updatedProduct.description,
                image: updatedProduct.image
            };
        }
        return item;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to delete a product
function deleteProduct(index) {
    productsData.splice(index, 1);
    localStorage.setItem('productsData', JSON.stringify(productsData));
    renderTable(productsData);
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const imageInput = document.getElementById('productPicture');
    const imageFile = imageInput.files[0];

    if (!name || !price || !description || !imageFile) {
        return; // Ensure all fields are filled
    }

    const newProduct = {
        name,
        price,
        description,
        image: URL.createObjectURL(imageFile)
    };

    productsData.push(newProduct);
    localStorage.setItem('productsData', JSON.stringify(productsData));
    renderTable(productsData);
    document.getElementById('productForm').reset();
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('default-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Function to reset products to base products
function resetProducts() {
    productsData = [...baseProducts];
    localStorage.setItem('productsData', JSON.stringify(productsData));
    renderTable(productsData);
}

// Event listener for the reset products button
document.getElementById('resetProducts').addEventListener('click', resetProducts);

// Event listener for the close button (cross)
document.getElementById('closeModalButton').addEventListener('click', closeModal);

// Event listener for the cancel button
document.getElementById('cancelButton').addEventListener('click', closeModal);

// Event listener for the save button
document.getElementById('saveChangesButton').addEventListener('click', saveChanges);

// Event listener for the add product form
document.getElementById('productForm').addEventListener('submit', addProduct);

// Function to display orders
function displayOrders() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let besteloverzicht = document.getElementById('besteloverzicht');
    besteloverzicht.innerHTML = '';
    if (orders.length === 0) {
        besteloverzicht.innerHTML = '<p class="leeg">Geen bestellingen gevonden.</p>';
        return;
    }
    let table = document.createElement('table');
    table.className = 'min-w-full bg-white';
    table.innerHTML = `
        <thead>
            <tr class="bg-gray-200">
                <th class="px-4 py-2 text-left">Datum en Tijd</th>
                <th class="px-4 py-2 text-left">Totaal Prijs</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    orders.forEach(order => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border text-left">${order.date}</td>
            <td class="px-4 py-2 border text-left">€${order.totalPrice}</td>
        `;
        table.querySelector('tbody').appendChild(row);
    });
    besteloverzicht.appendChild(table);
}

// Call displayOrders when the page loads
window.onload = function() {
    renderTable(productsData);
    displayOrders();
};
