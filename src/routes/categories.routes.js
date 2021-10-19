const { Router } = require('express')
const router = Router();
const categoryController = require('../controllers/category.controller')
let multer = require('multer');
let path = require('path');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/categories')
    }, 
    filename: (req, file, cb) => {
        cb(null, 'category_' + file.originalname)
    }
});
var upload = multer({ storage: storage });
router.get('/',categoryController.getCategories)
router.get('/filter/:string',categoryController.filterCategories)
router.get('/:id',categoryController.getInfoCategory)
router.post('/create',upload.single('file'),categoryController.createCategory)
router.put('/:id',upload.single('file'),categoryController.updateCategory)
router.delete('/:id',categoryController.deleteCategory)

module.exports = router; 