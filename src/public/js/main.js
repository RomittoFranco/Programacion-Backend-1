const socket = io();

// Escuchar actualizaciones de productos
socket.on('products', (products) => {
    updateProductList(products);
});

// Escuchar errores
socket.on('error', (error) => {
    alert('Error: ' + error.message);
});

// Función para actualizar la lista de productos
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

// Función para enviar nuevo producto
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

// Función para eliminar producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}