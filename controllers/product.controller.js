const Product = require('../models/product.model.js');

const getProducts = async (req,res) => {
    try{
        const products =  await Product.find();
         res.status(200).json(products);
      }
      catch (error)
      {
          res.status(500).json({message: error.message});
      }
}

const getProduct = async(req,res) => {
    try{
        const { id } = req.params;

       const products =  await Product.findById(id);
        res.status(200).json(products);
     }
     catch (error)
     {
         res.status(500).json({message: error.message});
     }
}


const createProduct = async (req,res) => {
    console.log(req.body);
    try{
       const product = await Product.create(req.body);
       res.status(200).json(product);
    }
    catch (error)
    {
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req,res) => {
    try{
        const { id } = req.params;

       const product =  await Product.findByIdAndUpdate(id, req.body);

       if(!product)
       {
            res.send(404).json({message: "Product Not found"});
       }
        
       
       const updatedProduct =  await Product.findById(id);
        res.status(200).json(updatedProduct);
     }
     catch (error)
     {
         res.status(500).json({message: error.message});
     }

}

const deleteProduct = async (req,res) => {
    try{
        const { id } = req.params;

       const product =  await Product.findByIdAndDelete(id);

       if(!product)
       {
            res.send(404).json({message: "Product Not found"});
       }
        
       
       
        res.status(200).json({message: "Product deleted!"});
     }
     catch (error)
     {
         res.status(500).json({message: error.message});
     }

}
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}