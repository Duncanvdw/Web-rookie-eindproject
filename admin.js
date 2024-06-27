document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('productTableBody');
    const productForm = document.getElementById('productForm');
    const resetProductsBtn = document.getElementById('resetProducts');

    let products = JSON.parse(localStorage.getItem('products')) || [];

    const renderProducts = () => {
        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${index + 1}</td>
                <td class="px-4 py-2">
                    <img src="${product.image}" alt="Product Image" class="w-16 h-16 object-cover"/>
                </td>
                <td class="px-4 py-2">${product.name}</td>
                <td class="px-4 py-2">€${product.price}</td>
                <td class="px-4 py-2">
                    <button class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md" onclick="editProduct(${index})">Edit</button>
                    <button class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700" onclick="deleteProduct(${index})">Delete</button>
                </td>`
            ;

            row.style.backgroundColor = index % 2 === 0 ? '#eee' : '#ccc';
            productTableBody.appendChild(row);
        });
    };

    const saveProductsToLocalStorage = () => {
        localStorage.setItem('products', JSON.stringify(products));
    };

    const addProduct = (event) => {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPicture = document.getElementById('productPicture').files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;

            const newProduct = {
                name: productName,
                price: productPrice,
                description: productDescription,
                image: imageUrl
            };

            products.push(newProduct);
            saveProductsToLocalStorage();
            renderProducts();
        };

        reader.readAsDataURL(productPicture);
        productForm.reset();

        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2">${index + 1}</td>
                <td class="px-4 py-2">
                    <img src="${product.image}" alt="Product Image" class="w-16 h-16 object-cover"/>
                </td>
                <td class="px-4 py-2">${product.name}</td>
                <td class="px-4 py-2">€${product.price}</td>
                <td class="px-4 py-2">
                    <button class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md" onclick="editProduct(${index})">Edit</button>
                    <button class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700" onclick="deleteProduct(${index})">Delete</button>
                </td>`
            ;

            row.style.backgroundColor = index % 2 === 0 ? '#eee' : '#ccc';
            productTableBody.appendChild(row);
        });
    };

    const deleteProduct = (index) => {
        products.splice(index, 1);
        saveProductsToLocalStorage();
        renderProducts();
    };

    const resetProducts = () => {
        products = [];
        saveProductsToLocalStorage();
        renderProducts();
    };

    productForm.addEventListener('submit', addProduct);
    resetProductsBtn.addEventListener('click', resetProducts);

    renderProducts();
});