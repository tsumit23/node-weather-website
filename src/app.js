const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine, views and partials location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directories to serve
app.use(express.static(path.join(publicDirectoryPath)));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Sumit Singh"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Sumit Singh"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message:
      "This is the Help section. Submit your queries and we will answer you shortly.",
    name: "Sumit Singh"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (err, forecastData) => {
        if (err) {
          return res.send({ err });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term!"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: "Sumit Singh",
    errorMessage: "Help article not found!"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: "Sumit Singh",
    errorMessage: "Page not found!"
  });
});

app.listen(port, () => console.log(`Server is up on port ${port}.`));
