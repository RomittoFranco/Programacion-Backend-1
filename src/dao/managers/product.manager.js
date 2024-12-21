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

    async addProduct({title, description, code, price, stock, category, thumbnails = []}) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios excepto thumbnails');
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
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

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

        this.products.splice(index, 1);
        await this.saveFile();
    }
}

module.exports = ProductManager;