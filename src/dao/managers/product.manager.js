const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../../products.json');
        this.products = [];
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            await this.saveFile();
        }
    }

    async saveFile() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async getProductByCode(code) {
        return this.products.find(p => p.code === code);
    }

    async addProduct({title, description, code, price, stock, category, thumbnails = []}) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios excepto thumbnails');
        }

        const existingProduct = await this.getProductByCode(code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con ese código');
        }

        const id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        await this.saveFile();
        return newProduct;
    }

    async getProducts(limit) {
        const activeProducts = this.products.filter(p => p.status);
        if (limit) {
            return activeProducts.slice(0, limit);
        }
        return activeProducts;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        if (updatedFields.code) {
            const existingProduct = await this.getProductByCode(updatedFields.code);
            if (existingProduct && existingProduct.id !== id) {
                throw new Error('Ya existe un producto con ese código');
            }
        }

        const updatedProduct = {
            ...this.products[index],
            ...updatedFields,
            id: this.products[index].id
        };

        this.products[index] = updatedProduct;
        await this.saveFile();
        return updatedProduct;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        
        // Eliminar completamente el producto
        this.products.splice(index, 1);
        await this.saveFile();
        return true;
    }
}

module.exports = ProductManager;