const Product = require('../models/product.model');

class ProductManager {
    async getProducts(options = {}) {
        const {
            limit = 10,
            page = 1,
            sort,
            query = {}
        } = options;

        const queryOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };

        const result = await Product.paginate(query, queryOptions);

        return {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
        };
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async updateProduct(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManager;