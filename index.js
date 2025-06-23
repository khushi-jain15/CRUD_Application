const express = require("express");
const hbs = require("hbs");
const Employee = require("./models/Employee");
const path = require("path");
const bodyParser = require("body-parser");
const connection = require('./dbConnect');
connection();


const app = express();
connection(); // Connect to MongoDB

const encoder = bodyParser.urlencoded();
app.set("views", "./views");
app.set("view engine", "hbs");

const partialPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialPath);

const staticPath = path.join(__dirname, "./views/public");
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes...

app.get("/", async (req, res) => {
  const data = await Employee.find();
  res.render("index", { data });
});

app.get("/add", (req, res) => res.render("add"));

app.post("/add", encoder, async (req, res) => {
  const data = new Employee(req.body);
  await data.save();
  res.redirect("/");
});

app.get("/delete/:_id", async (req, res) => {
  await Employee.deleteOne({ _id: req.params._id });
  res.redirect("/");
});

app.get("/update/:_id", async (req, res) => {
  const data = await Employee.findOne({ _id: req.params._id });
  res.render("update", { data });
});

app.post("/update/:_id", encoder, async (req, res) => {
  const data = await Employee.findOne({ _id: req.params._id });
  Object.assign(data, req.body); // cleaner assignment
  await data.save();
  res.redirect("/");
});

app.get("/about", (req, res) => res.render("about"));

// ✅ Use dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
