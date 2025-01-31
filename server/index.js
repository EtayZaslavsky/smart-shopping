require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const passwordResetRoutes = require("./routes/passwordReset");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Users routes
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);




// Products routes
app.post('/api/search', async (req, res) => {
  try {
    console.log(req.body)
    const searchQueries = req.body.products;
    if (!searchQueries || searchQueries.length === 0) {
      return res.status(400).send({ message: 'No search queries provided' });
    }
    const response = await axios.post('http://localhost:3002/search', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// ProductsList routes
app.post('/api/productsList', async (req, res) => {
  try {
    console.log(req.body)
    const searchQueries = req.body.products;
    if (!searchQueries || searchQueries.length === 0) {
      return res.status(400).send({ message: 'No search queries provided' });
    }
    const response = await axios.post('http://localhost:3002/search', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // dictionary of sources
    // in each source dictionary is a dictionary of products with lowest price
    sources = {}

    // for every product
    for (const [key, value] of Object.entries(response.data)) {
      const productOptions = value;
      const productName = key;
      // for every option for that product
      for (let i = 0; i < productOptions.length; i++) {

        // split these to sources, only one product option per source
        const option = productOptions[i];
        const source = option.source;
        if (!(source in sources)) {
          sources[source] = {};
        }
        if (!(productName in sources[source])) {
          sources[source][productName] = option;
          sources[source][productName].price = parseFloat(option.price.replace(/[^0-9.-]+/g, ""));
        }
      }
      // for
      // const itemWithLowestPrice = getItemWithLowestPrice(productOptions);

    }

    sourceToPrice = {};
    // for every source
    for (const [key, value] of Object.entries(sources)) {
      const products = value;
      const source = key;
      // for every product 
      priceSum = 0;
      for (const [productName, product] of Object.entries(products)) {
        // sum the price for that source
        priceSum += Number(parseFloat(product.price).toFixed(2));
      }

      console.log(`Basket from ${source} costs ${priceSum} shekels.`);
      sourceToPrice[source] = priceSum;
    }

    // cheapestSource = min(sourceToPrice, key = sourceToPrice.get)
    const [cheapestSource, cheapestPrice] = Object.entries(sourceToPrice).reduce((acc, [key, value]) => {
      return value < acc[1] ? [key, value] : acc;
    }, [null, Infinity]);

    console.log("sources");
    console.log(sources);
    console.log("sourceToPrice");
    console.log(sourceToPrice);
    res.json(
      {
        "sourcesProducts": sources,
        "sourcesPrices": sourceToPrice,
        // "name": cheapestSource,
        // "totalPrice": cheapestPrice
      }
    );


    // cheapestProducs = {}
    // for (const [key, value] of Object.entries(response.data)) {
    //   cheapestProducs[key] = value[0];
    // }
    // res.json(cheapestProducs);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/api/product/{id}', async (req, res) => {
  // a product with: Name, Price, Description, Availablity, Ratings, Deals, Cheapest stores near by
})

// Cart routes
app.get('/api/cart', async (req, res) => {
  // a list of items in the cart
})
app.post('/api/cart/add', async (req, res) => {
  // add an item to the cart
})
app.post('/api/cart/remove', async (req, res) => {
  // remove an item from the cart
})
app.post('/api/cart/checkout', async (req, res) => {
  // checkout the cart
})

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));
