const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("./models/cohort.model");
const Student = require("./models/student.model");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((db) =>
    console.log(`Connected to Database: "${db.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Student Routes

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students -> ", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.post("/api/students", (req, res) => {
  Student.create(req.body)
    .then((newStudent) => {
      res.status(201).json(newStudent);
    })
    .catch((error) => {
      res.status(500).json({ message: `Error creating new student: ${error}` });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Student.find({cohort: cohortId})
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error retrieving students from one cohort: ${error}`,
      });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const{studentId} = req.params;

  Student.findById(studentId)
    .then((student) => {
      console.log("Catched :");
      console.log("Catched student:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error on getting spesific student, error type:${err}`,
      });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  const{studentId} = req.params;

  Student.findByIdAndDelete(studentId)
    .then((student) => {
      console.log("Catched :");
      console.log("Catched student:", student);
      res.status(200).json(student);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error on getting spesific student, error type:${err}`,
      });
    });
});





// Cohort Routes
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json({ cohorts });
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts -> ", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
