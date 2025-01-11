const fs = require('fs').promises;
const path = require('path');
const ProductManager = require('./product.manager');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../../carts.json');
        this.carts = [];
        this.productManager = new ProductManager();
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

        
        const cartWithProducts = {...cart};
        cartWithProducts.products = await Promise.all(
            cart.products.map(async (item) => {
                try {
                    const product = await this.productManager.getProductById(item.product);
                    if (product.status) { 
                        return {
                            product: {
                                id: product.id,
                                title: product.title,
                                description: product.description,
                                code: product.code,
                                price: product.price,
                                status: product.status,
                                stock: product.stock,
                                category: product.category
                            },
                            quantity: item.quantity
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            })
        );

        
        cartWithProducts.products = cartWithProducts.products.filter(item => item !== null);
        return cartWithProducts;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        
        
        const product = await this.productManager.getProductById(productId);
        if (!product.status) {
            throw new Error('El producto no está disponible');
        }

        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            
            this.carts.find(c => c.id === cartId).products[productIndex].quantity++;
        } else {
            
            this.carts.find(c => c.id === cartId).products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveFile();
        return await this.getCartById(cartId);
    }

    async removeProductFromCart(cartId, productId) {
        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) throw new Error('Carrito no encontrado');

        const productIndex = this.carts[cartIndex].products.findIndex(p => p.product === productId);
        if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');

        this.carts[cartIndex].products.splice(productIndex, 1);
        await this.saveFile();
        return await this.getCartById(cartId);
    }

    async updateCartProducts(cartId, products) {
        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) throw new Error('Carrito no encontrado');

        
        await Promise.all(products.map(async (item) => {
            const product = await this.productManager.getProductById(item.product);
            if (!product.status) {
                throw new Error(`El producto ${item.product} no está disponible`);
            }
        }));

        this.carts[cartIndex].products = products;
        await this.saveFile();
        return await this.getCartById(cartId);
    }
}

module.exports = CartManager;