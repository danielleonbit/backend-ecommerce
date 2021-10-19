const { Router } = require('express')
const router = Router();
const userController = require('../controllers/user.controller')
const { auth } = require('../middleware/auth')
let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });
router.get('/', userController.getUsers)
router.get('/:token', userController.getInfoUser)
router.post('/create', upload.single('file'), userController.createUser)
router.post('/login', userController.Login)
router.put('/:id', upload.single('file'), userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/auth', auth, (req, res) => {
    console.log(req)
    res.status(200).json({
        email: req.user.email,
        names_and_lastnames: req.user.names_and_lastnames
    })
})
router.get('/logout', auth, userController.LogOut)
module.exports = router;
 