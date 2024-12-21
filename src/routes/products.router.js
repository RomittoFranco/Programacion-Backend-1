const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/managers/product.manager');
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        await productManager.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;