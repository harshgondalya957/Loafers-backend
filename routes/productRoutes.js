const express = require('express');
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    getProductsByCategory,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.get('/category/:category', getProductsByCategory);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;