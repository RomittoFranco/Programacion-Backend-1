const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/managers/product.manager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const productExists = await productManager.getProductByCode(req.body.code);
        if (productExists) {
            return res.status(400).json({ error: 'Ya existe un producto con ese código' });
        }
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        if (req.body.code) {
            const productExists = await productManager.getProductByCode(req.body.code);
            if (productExists && productExists.id !== id) {
                return res.status(400).json({ error: 'Ya existe un producto con ese código' });
            }
        }
        const updatedProduct = await productManager.updateProduct(id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        
        
        const id = parseInt(identifier);
        
        if (isNaN(id)) {
            
            const product = await productManager.getProductByCode(identifier);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await productManager.deleteProduct(product.id);
        } else {
            
            await productManager.deleteProduct(id);
        }
        
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;