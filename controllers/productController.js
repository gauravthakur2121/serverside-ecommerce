const User=require('../models/User')
const Product = require('../models/Product');

module.exports.newForm = async(req, res) => {
    let username = null;
    const user = await User.findOne({ username: req.user.username });
    if (user) {
        username = user.username;
    }
    res.render('products/addProduct',{username})
};

module.exports.addProduct=async (req, res) => {
    try {
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; 
        const newProduct = new Product({ name, image, price, author, quantity });
        await newProduct.save();
        res.redirect('/');
    } catch (error) {
        req.flash('error','Error creating product');
    }
}


module.exports.editForm = async (req, res) => {
    try {
        let username = null;
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            username = user.username;
        }
        const product = await Product.findById(req.params._id);
        if (!product) {
            req.flash("error",'Product not found');
            return;
        }
        res.render('products/editProduct', { product,username}); 
    } catch (error) {
        req.flash("error",'Error fetching product for edit');
    }
};



module.exports.updateProduct = async (req, res) => {
    try {
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; 
        await Product.findByIdAndUpdate(req.params._id, { name, image, price, author, quantity });

        res.redirect('/'); // Redirect to the product list page after update
    } catch (error) {
        
        req.flash("error",'Error updating product');
    }
};


module.exports.deleteProduct = async (req, res) => {
    try {
        const productExists = await Product.exists({ _id: req.params._id }); // Ensure consistent naming (_id)

        if (productExists) {
            const deletedProduct = await Product.findByIdAndDelete(req.params._id);
            if (deletedProduct) {
                res.redirect('/');
            } else {
                res.status(404).send("Product not found");
            }
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
};




