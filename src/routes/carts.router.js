const express = require('express');
const router = express.Router();
const CartManager = require('../dao/managers/cart.manager');
const cartManager = new CartManager();


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(id);
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;