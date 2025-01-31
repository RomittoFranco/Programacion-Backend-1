const socket = io();


socket.on('products', (products) => {
    updateProductList(products);
});


socket.on('error', (error) => {
    alert('Error: ' + error.message);
});


function updateProductList(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Categoría: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="deleteProduct('${product._id}')" class="delete-btn">Eliminar</button>
        </div>
    `).join('');
}


function submitProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
        status: true
    };

    socket.emit('newProduct', productData);
    event.target.reset();
}


function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}