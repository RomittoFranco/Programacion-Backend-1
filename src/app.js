const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
    res.render('products', {
        title: 'Horizonte Interior',
        style: 'styles.css'
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});