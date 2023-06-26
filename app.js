/**
 * This is products API, an API that lets you get the product and user information.
 * Dataset: https://www.kaggle.com/datasets/lokeshparab/amazon-products-dataset?resource=download
 */

"use strict";

const express = require("express");
const multer = require("multer");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const USER_ERROR_MSG = "User does not exist.";
const USER_EXISTS_MSG = "User already exists.";
const PRODUCTS_ERROR_MSG = "Product does not exist.";
const PARAM_ERROR_MSG = "Missing one or more of the required params.";
const SERVER_ERROR_MSG = "An error occurred on the server. Try again later.";

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// Get all products or products matching search term
app.get("/products/list", async (req, res) => {
  res.type("json");
  let searchTerm = req.query.search;
  try {
    let query =
      "SELECT id, name, sub_title, price, availability, avg_rating, review_count, images" +
      " FROM products WHERE images IS NOT NULL";
    if (searchTerm) {
      query =
        "SELECT name, color, price, availability, avg_rating, review_count, images FROM" +
        " products WHERE images IS NOT NULL AND name LIKE '%" +
        searchTerm +
        "%'";
      let db = await getDBConnection();
      let results = await db.all(query);
      await db.close();
      results = parseAll(results);

      res.json(results);
    } else {
      let db = await getDBConnection();
      let results = await db.all(query);
      await db.close();
      results = parseAll(results);

      res.json(results);
    }
  } catch (err) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

// Get all product categories
app.get("/products/categories", async (req, res) => {
  res.type("json");
  try {
    let query =
      "SELECT DISTINCT sub_title FROM products WHERE images IS NOT NULL";
    let db = await getDBConnection();
    let results = await db.all(query);
    await db.close();

    results = parseCategories(results);
    res.json(results);
  } catch (err) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

// Get details for a product
app.get("/products/details/:name", async (req, res) => {
  let name = req.params.name;
  try {
    let query = "SELECT * FROM products WHERE name = ? LIMIT 1";
    let db = await getDBConnection();
    let results = await db.all(query, [name]);
    await db.close();

    if (results.length === 0) {
      res.type("text").status(INVALID_PARAM_ERROR);
      res.send(USER_ERROR_MSG);
    } else {
      res.type("json").send(results);
    }
  } catch (err) {
    res.type("text").status(SERVER_ERROR);
    res.send(SERVER_ERROR_MSG);
  }
});

// Add rating and comment to a product
app.post("/rate", async (req, res) => {
  res.type("json");
  try {
    let results = "";
    try {
      let newAverageRating =
        (parseFloat(req.body.avg_rating) * parseFloat(req.body.review_count) +
        parseFloat(req.body.rating)) / (parseFloat(req.body.review_count) + 1);

      let db = await getDBConnection();
      let updateQuery = "UPDATE products SET avg_rating = ?, review_count = ? WHERE id = ?";
      results = await db.run(updateQuery, [newAverageRating, parseFloat(req.body.review_count) + 1,
        req.body.product_id]);
    } catch (error) {
      res.status(INVALID_PARAM_ERROR).send(PRODUCTS_ERROR_MSG);
    }

    if (req.body.comment) {
      let db = await getDBConnection();
      let result = await db.run("INSERT INTO comments (username, comment, rating, product_id)" +
                                " VALUES (?, ?, ?, ?)", [req.body.username, req.body.comment,
                                                         req.body.rating, req.body.product_id]);
      await db.close();

      db = await getDBConnection();
      results = await db.get("SELECT * FROM comments WHERE id = " + result.lastID);
      await db.close();
    }
    res.send(results);
  } catch (error) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

// Get comments
app.get("/products/comments/:id", async (req, res) => {
  let productId = req.params.id;
  try {
    let query = "SELECT * FROM comments WHERE product_id = '" + productId + "'";
    let db = await getDBConnection();
    let results = await db.all(query);
    await db.close();

    res.type("json").send(results);
  } catch (err) {
    res.type("text").status(SERVER_ERROR);
    res.send(SERVER_ERROR_MSG);
  }
});

// Get used transaction codes
app.get("/history/code", async (req, res) => {
  try {
    let query = "SELECT confirmation_code FROM history";
    let db = await getDBConnection();
    let results = await db.all(query);
    await db.close();

    res.type("text").send(results);
  } catch (err) {
    res.type("text").status(SERVER_ERROR);
    res.send(SERVER_ERROR_MSG);
  }
});

app.get("/history/user/:user", async (req, res) => {
  try {
    let user = req.params.user;
    let db = await getDBConnection();
    let query = "SELECT * FROM history WHERE user = ?";
    let rows = await db.all(query, user);
    await db.close();
    res.json(rows);
  } catch (err) {
    res.type("text").status(SERVER_ERROR);
    res.send(SERVER_ERROR_MSG);
  }
});

app.post("/history", async (req, res) => {
  try {
    let {confirmationCode, productName, price, user} = req.body;
    let db = await getDBConnection();
    db.run("INSERT INTO history (confirmation_code, product_name, price, user)" +
    " VALUES (?, ?, ?, ?)", [confirmationCode, productName, price, user]);
    await db.close();

    res.type("text").send("Success");
  } catch (err) {
    res.type("text").status(SERVER_ERROR);
    res.send(SERVER_ERROR_MSG);
  }
});

// Adds a new user and their information
app.post("/users/signup", async (req, res) => {
  res.type("json");
  if (req.body.username && req.body.email && req.body.password) {
    try {
      let db = await getDBConnection();
      let results = await db.get("SELECT * FROM users WHERE username = '" +
                                 req.body.username + "'");
      await db.close();

      if (results) {
        res.type("text").status(INVALID_PARAM_ERROR);
        res.send(USER_EXISTS_MSG);
      } else {
        let query =
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db = await getDBConnection();
        await db.run(query, [req.body.username, req.body.email, req.body.password]);
        await db.close();
        db = await getDBConnection();
        results = await db.get("SELECT username, password FROM users WHERE username = '" +
            req.body.username + "'");
        await db.close();
        res.send(results);
      }
    } catch (err) {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR).send(PARAM_ERROR_MSG);
  }
});

// Gets availability of product
app.post("/availability", async (req, res) => {
  res.type("text");
  let {availability, name} = req.body;
  try {
    let db = await getDBConnection();
    let query = "UPDATE products SET availability = ? WHERE name = ?";
    let newAvailability = availability - 1;
    await db.run(query, [newAvailability, name]);
    res.send({newAvailability});
  } catch (err) {
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

// Login an existing user
app.post("/users/login", async (req, res) => {
  res.type("text");
  if (req.body.username && req.body.password) {
    try {
      let query =
        "SELECT username FROM users WHERE username = '" +
        req.body.username +
        "' AND password = '" +
        req.body.password +
        "'";
      let db = await getDBConnection();
      let results = await db.get(query);
      await db.close();

      if (results.length === 0) {
        res.status(INVALID_PARAM_ERROR);
        res.send(USER_ERROR_MSG);
      } else {
        res.send(results);
      }
    } catch (err) {
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR);
    res.send(PARAM_ERROR_MSG);
  }
});

/**
 * Turns array of objects of products into json.
 * @param {array} queryResults - array of objects
 * @returns {json} - array of objects as json.
 */
function parseAll(queryResults) {
  let results = {};
  results["products"] = [];
  for (let i = 0; i < queryResults.length; i++) {
    let images = queryResults[i].images.split(" | ");
    results["products"].push({
      id: queryResults[i].id,
      name: queryResults[i].name,
      sub_title: queryResults[i].sub_title,
      price: queryResults[i].price,
      availability: queryResults[i].availability,
      avg_rating: queryResults[i].avg_rating,
      review_count: queryResults[i].review_count,
      images: images
    });
  }
  return results;
}

/**
 * Turns array of objects of product categories into json.
 * @param {array} queryResults - array of objects
 * @returns {json} - array of objects as json.
 */
function parseCategories(queryResults) {
  let results = {};
  results["categories"] = [];
  for (let i = 0; i < queryResults.length; i++) {
    results["categories"].push({
      sub_title: queryResults[i].sub_title
    });
  }
  return results;
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "products.db",
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
