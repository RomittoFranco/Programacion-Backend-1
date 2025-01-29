const Cart = require('../models/cart.model');

class CartManager {
    async createCart() {
        const cart = new Cart();
        return await cart.save();
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: productId });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }

    async updateCart(cartId, products) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { products },
            { new: true }
        ).populate('products.product');
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        }
        throw new Error('Product not found in cart');
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        cart.products = [];
        return await cart.save();
    }
}

module.exports = CartManager;