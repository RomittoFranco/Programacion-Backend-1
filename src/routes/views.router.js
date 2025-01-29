const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/managers/product.manager');
const productManager = new ProductManager();

// Ruta para home
router.get('/', async (req, res) => {
    try {
        const options = { limit: 10, page: 1 };
        const result = await productManager.getProducts(options);
        res.render('home', { 
            products: result.payload,
            title: 'Horizonte Interior - Productos' 
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});

// Ruta para productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const options = { limit: 10, page: 1 };
        const result = await productManager.getProducts(options);
        res.render('realTimeProducts', {
            products: result.payload,
            title: 'Productos en Tiempo Real'
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});

module.exports = router;