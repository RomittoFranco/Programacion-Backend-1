const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/managers/product.manager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const options = {
            limit,
            page,
            sort,
            query: query ? { category: query } : {}
        };
        const result = await productManager.getProducts(options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await productManager.deleteProduct(req.params.pid);
        if (!result) {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

module.exports = router;