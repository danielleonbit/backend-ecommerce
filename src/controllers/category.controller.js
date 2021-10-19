const CategoryController = {}
const dotenv = require("dotenv")
const Category = require('../models/Category')
let fs = require('fs');
let path = require('path');

CategoryController.uploadImage = async (file) => {
     if (!file) {
          return false;
     } else {
          const tempPath = file.path;
          const targetPath = path.join(__dirname,`${process.env.URL_IMAGES_SERVER_CATEGORIES}category_${file.originalname}`);
          console.log(__dirname,targetPath)
          fs.rename(tempPath, targetPath, function (res) {
               console.log(res)
               return true;
          });
          return 'category_' + file.originalname;
     }


}
CategoryController.getCategories = async (req, res) => {
     await Category.find().then((data) => {
          res.json(data)
     }).catch((e) => {
          res.status(401).send(e);
     })
}
CategoryController.filterCategories = async (req, res) => {
     console.log(req);
     if(req.params.string!='null'){
          await Category.find({"name": { '$regex' : req.params.string, '$options' : 'i' }}).then((data) => {
               res.status(200).json({
                    success: true,
                    data: data
               })
          }).catch((e) => {
               res.status(401).send(e);
          })
     }else{
          res.status(200).json({
               success: false,
               datacategory: []
          })
     }
     
}
CategoryController.getInfoCategory = async (req, res) => {
     await Category.find({_id:req.params.id}).then((data) => {
          res.status(200).json({
               success: true,
               datacategory: data
          })
     }).catch((e) => {
          res.status(401).send(e);
     })
}
CategoryController.createCategory = async (req, res, next) => {
     let nameImage = (req.file) ? `${process.env.URL_IMAGES_CATEGORIES}${await CategoryController.uploadImage(req.file).then(data => data)}` : (req.body.url_image!='') ? req.body.url_image : '';
     const category = new Category(
          {
               name: req.body.name,
               description: req.body.description,
               image: `${nameImage}`
          }
     )
     category.save().then((data) => {
          res.status(200).json({
               success: true,
               datacategory: data
          })
     }).catch((e) => {
          res.status(401).send(e);
     })
}
CategoryController.updateCategory = async (req, res) => {
     console.log(req);

     let nameImage = (req.file) ? `${process.env.URL_IMAGES_CATEGORIES}${await CategoryController.uploadImage(req.file).then(data => data)}` : (req.body.url_image!='') ? req.body.url_image : '';
     console.log(nameImage)
     const category = {
          name: req.body.name,
          description: req.body.description,
          image: `${nameImage}`
     }

     await Category.findByIdAndUpdate(req.params.id, category).then((data) => {
          res.status(200).json({
               success: true,
               data: data._id
          })
     }).catch((e) => {
          res.status(401).send();
     })

}
CategoryController.deleteCategory = async (req, res) => {
     await Category.findByIdAndDelete(req.params.id).then((data) => {
          res.status(200).json({
               success: true
          })
     }).catch((e) => {
          res.status(401).send();
     });


}


module.exports = CategoryController