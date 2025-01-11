const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/managers/product.manager');
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { 
            products,
            title: 'Horizonte Interior - Productos' 
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { 
            products,
            title: 'Productos en Tiempo Real' 
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
});

module.exports = router;
