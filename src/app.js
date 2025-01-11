const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const io = new Server(httpServer);


const ProductManager = require('./dao/managers/product.manager');
const productManager = new ProductManager();


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    
    productManager.getProducts().then(products => {
        socket.emit('products', products);
    });

    
    socket.on('newProduct', async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts();
            io.emit('products', updatedProducts);
        } catch (error) {
            socket.emit('error', { error: error.message });
        }
    });

    
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(parseInt(productId));
            const updatedProducts = await productManager.getProducts();
            io.emit('products', updatedProducts);
        } catch (error) {
            socket.emit('error', { error: error.message });
        }
    });
});