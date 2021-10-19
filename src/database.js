const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()
const connectionString = `mongodb://${process.env.DB_HOST}/blaa-ecommerce?retryWrites=true&w=majority`
mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then((db) => console.log(mongoose.connection.readyState))
  .catch((err) => console.log(err)) 