const { Router } = require('express')
const router = Router();
const ProductController = require('../controllers/product.controller')
let multer = require('multer');
let path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/products')
    }, 
    filename: (req, file, cb) => {
        cb(null, 'product_' + file.originalname)
    }
}); 
var upload = multer({ storage: storage });
router.get('/',ProductController.getProducts)
router.get('/filter/:string',ProductController.filterProducts)
router.get('/:id',ProductController.getInfoProduct)
router.post('/create',upload.single('file'),ProductController.createProduct)
router.put('/:id',upload.single('file'),ProductController.updateProduct)
router.delete('/:id',ProductController.deleteProduct)

module.exports = router;