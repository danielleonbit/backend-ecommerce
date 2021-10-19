const userController = {}
const dotenv = require("dotenv")
const User = require('../models/User')
let fs = require('fs');
let path = require('path');
userController.uploadImage = async (file) => {
    if (!file) {
        return false;
    } else {
        const tempPath = file.path;
        const targetPath = path.join(__dirname, `${process.env.URL_IMAGES_SERVER}users/${file.originalname}`);

        fs.rename(tempPath, targetPath, function (res) {
            return true;
        });
        return file.originalname;
    }


}
userController.getUsers = async (req, res) => {
    await User.find().then((data) => {
        res.json(data)
    }).catch((e) => {
        res.status(401).send(e);
    })
}
userController.getInfoUser = async (req, res) => {
    await User.find({token:req.params.token}).then((data) => {
        res.json(data)
    }).catch((e) => {
        res.status(401).send(e);
    })
}
userController.createUser = async (req, res) => {
    let nameImage = await userController.uploadImage(req.file).then(data => data)
    const user = new User({
        names_and_lastnames: req.body.names_and_lastnames,
        email: req.body.email,
        password: req.body.password,
        image: `${process.env.URL_USERS}${nameImage}`
    })
    user.save().then((datauser) => {
        res.status(200).json({
            success: true,
            data: datauser
        })
    }).catch((e) => {
        res.status(401).send(e);
    })
}
userController.updateUser = async (req, res) => {
    let nameImage = await userController.uploadImage(req.file).then(data => data)
  
    await User.findByIdAndUpdate(req.params.id, req.body,(err,user)=>{
        user.image=`${process.env.URL_USERS}${nameImage}`
        user.save().then((datauser) => {
            res.status(200).json({
                success: true,
                data: datauser._id
            })
        }).catch((e) => {
            res.status(401).send(e);
        })
    })


}
userController.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id).then((data) => {
        res.status(200).json({
            success: true
        })
    }).catch((e) => {
        res.status(401).send();
    });


}

userController.Login = async (req, res) => {
    // 1. Encuentra el correo        
    User.findOne({ 'email': req.body.username }, (err, user) => {
        if (!user) return res.json({ loginSuccess: false, message: 'Email no encontrado!' })

        // 2. Obtén el password y compruébalo 
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "Password incorrecto!" })

            // 3. Si todo es correcto, genera un token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                // Si todo bien, debemos guardar este token como un "cookie"
                res.cookie('blaaecommerce_auth', user.token).status(200).json(
                    { 
                        loginSuccess:true,
                        datauser:{
                            token:user.token,
                            names_and_lastnames:user.names_and_lastnames,
                            email:user.email,
                            image:user.image,
                            _id:user._id
                        }
                    }
                )
            })
        })
    })


}
userController.LogOut = (req, res) => {
    console.log(req);
    User.findOneAndUpdate(
        { _id: req.body._id },
        { token: '' },
        (err, doc) => {
            if (err) return res.json({ success: false, err })
            return res.status(200).json({
                success: true
            })
        }
    )
}


module.exports = userController