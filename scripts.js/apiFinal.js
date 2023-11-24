require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const port = 3000;

// Define your API key
const apiKey = process.env.apiKey;

// Middleware to check for API key
const checkApiKey = (req, res, next) => {
  const providedApiKey = req.headers["api-key"];

  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }

  next();
};

app.use(checkApiKey); // Use the middleware for all routes

const pool = new Pool({
  user: "default",
  host: "ep-summer-hill-45014262-pooler.us-east-1.postgres.vercel-storage.com",
  database: "verceldb",
  password: "4GgYsz5FDfnk",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/students", function (req, res) {
  const listUsersQuery = `SELECT * FROM students`;

  pool
    .query(listUsersQuery)
    .then((data) => {
      console.log("List students: ", data.rows);
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/students/:id", function (req, res) {
  const listUsersQuery = `SELECT * FROM students WHERE id= ${req.params.id}`;
  pool
    .query(listUsersQuery)
    .then((data) => {
      console.log("List students: ", data.rows);
      res.status(201).send(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/students", function (req, res) {
  const id = req.body.id;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const notes = req.body.notes;
  const insertar = `INSERT INTO students(id, name, lastname, notes) VALUES(${id}, '${name}', '${lastname}', '${notes}')`;
  pool
    .query(insertar)
    .then(() => {
      res.status(201).send("students save");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  console.log(req.body);
});

app.put("/students/:id", function (req, res) {
  const modificar = `UPDATE students SET name='${req.body.name}', lastname='${req.body.lastname}', notes='${req.body.notes}' WHERE id=${req.params.id}`;
  console.log(modificar);
  pool
    .query(modificar)
    .then(() => {
      res.status(201).send("modified student");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  console.log(req.body);
});

app.delete("/students/:id", function (req, res) {
  const eliminar = `DELETE FROM students WHERE id=${req.params.id}`;
  console.log(eliminar);
  pool
    .query(eliminar)
    .then(() => {
      res.status(204).send("User Deleted");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  console.log(req.body);
});

app.listen(port, function () {
  console.log(`the student server is working`);
});
