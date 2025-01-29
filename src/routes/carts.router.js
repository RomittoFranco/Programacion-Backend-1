const express = require('express');
const router = express.Router();
const CartManager = require('../dao/managers/cart.manager');
const cartManager = new CartManager();

// Create new cart
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Get cart by ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Cart not found' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Delete product from cart
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const result = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Update entire cart with products array
router.put('/:cid', async (req, res) => {
    try {
        const result = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Update product quantity
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const result = await cartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Clear cart
router.delete('/:cid', async (req, res) => {
    try {
        const result = await cartManager.clearCart(req.params.cid);
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

module.exports = router;