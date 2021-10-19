const ProductController = {}
const dotenv = require("dotenv")
const Product = require('../models/Product')
const mongoose = require("mongoose");
let fs = require('fs');
let path = require('path');

ProductController.uploadImage = async (file) => {
     if (!file) {
          return false;
     } else {
          const tempPath = file.path;
          const targetPath = path.join(__dirname, `${process.env.URL_IMAGES_SERVER_PRODUCTS}product_${file.originalname}`);
          console.log(__dirname, targetPath)
          fs.rename(tempPath, targetPath, function (res) {
               console.log(res)
               return true;
          });
          return 'product_' + file.originalname;
     }


}

ProductController.getProducts = async (req, res) => {
     await Product.aggregate(
          [
               {
                    $lookup: {
                         from: 'categories',
                         localField: 'id_category',
                         foreignField: '_id',
                         as: 'infoCategory'
                    }

               },
            
          ]).then((data) => {
               res.json(data)
          }).catch((e) => {
               res.status(401).send(e);
          })
}
ProductController.filterProducts = async (req, res) => {
     if (req.params.string != 'null') {
          await Product.aggregate(
               [
                    {
                         $match: {
                              name: { '$regex': req.params.string, '$options': 'i' }
                         }
                    },
                    {
                         $lookup: {
                              from: 'categories',
                              localField: 'id_category',
                              foreignField: '_id',
                              as: 'infoCategory'
                         }

                    }

               ]).then((data) => {
                    res.status(200).json({
                         success: true,
                         dataproduct: data
                    })
               }).catch((e) => {
                    res.status(401).send(e);
               })
     } else {
          res.status(200).json({
               success: false,
               dataproduct: []
          })
     }

}
ProductController.getInfoProduct = async (req, res) => {
     await Product.aggregate(
          [
               {
                    $match: {
                         _id: mongoose.Types.ObjectId(req.params.id)
                    }
               },
               {
                    $lookup: {
                         from: 'categories',
                         localField: 'id_category',
                         foreignField: '_id',
                         as: 'infoCategory'
                    }
               }

          ]
     ).then((data, err) => {
          if (err) console.log(err)
          res.status(200).json({
               success: true,
               dataproduct: data
          })
     }).catch((e) => {
          res.status(401).send(e);
     })
}
ProductController.createProduct = async (req, res, next) => {
     let nameImage = (req.file) ? `${process.env.URL_IMAGES_PRODUCTS}${await ProductController.uploadImage(req.file).then(data => data)}` : (req.body.url_image!='') ? req.body.url_image : '';
     const product = new Product(
          {
               name: req.body.name,
               description: req.body.description,
               image: `${nameImage}`,
               id_category: req.body.id_category,
               price:req.body.price

          }
     )
     product.save().then((data, err) => {
          if (err) console.log(err)
          res.status(200).json({
               success: true,
               productdata: data
          })
     }).catch((e) => {
          res.status(401).send();
     })
}
ProductController.updateProduct = async (req, res) => {
     let nameImage = (req.file) ? `${process.env.URL_IMAGES_PRODUCTS}${await ProductController.uploadImage(req.file).then(data => data)}` : (req.body.url_image!='') ? req.body.url_image : '';
      const product = {
          name: req.body.name,
          description: req.body.description,
          image: `${nameImage}`,
          id_category: req.body.id_category,
          price:req.body.price

     }

     await Product.findByIdAndUpdate(req.params.id, product).then((data) => {
          res.status(200).json({
               success: true,
               productdata: data._id
          })
     }).catch((e) => {
          res.status(401).send();
     })

}
ProductController.deleteProduct = async (req, res) => {
     await Product.findByIdAndDelete(req.params.id).then((doc) => {
          res.status(200).json({
               success: true
          })
     }).catch((e) => {
          res.status(401).send();
     });


}
module.exports = ProductController