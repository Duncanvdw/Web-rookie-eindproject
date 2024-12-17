async function fetchProducts() {
    try {
        const response = await fetch("./products.JSON");
        const productsData = await response.json();
        if (!Array.isArray(productsData.products)) {
            throw new Error('Products data is not an array');
        }
        renderProducts(productsData.products);
    } catch (error) {
        console.error('Error fetching the products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear the container

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'flex flex-col justify-between pb-8 bg-white rounded-lg shadow-xl';

        productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="object-cover rounded-t-lg aspect-video"/>
        <h2 class="flex justify-start mt-4 ml-4 text-2xl font-medium">
          ${product.name}
        </h2>
        <p class="flex justify-start my-4 ml-4 text-2xl font-medium">${product.price},-</p>
        <p class="flex justify-start mb-6 ml-4 mr-3 font-normal">${product.description}</p>
        <button id="btn" type="submit" onclick="addToCart('${product.name}', '${product.description}', '${product.price}')" value="Send" class="flex justify-start p-2 ml-4 my-auto text-lg text-white rounded-md w-60 bg-[#2563EB]" role="button">
          Voeg toe aan winkelwagen
        </button>
      `;
      
        container.appendChild(productElement);
    });
}

document.addEventListener('DOMContentLoaded', fetchProducts);

// Make the addToCart function accessible globally
window.addToCart = addToCart;