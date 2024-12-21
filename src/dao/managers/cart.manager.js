const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../../carts.json');
        this.carts = [];
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            await this.saveFile();
        }
    }

    async saveFile() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const id = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
        const newCart = {
            id,
            products: []
        };

        this.carts.push(newCart);
        await this.saveFile();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            
            cart.products[productIndex].quantity++;
        } else {
            
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveFile();
        return cart;
    }
}

module.exports = CartManager;