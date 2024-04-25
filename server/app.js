const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("./models/cohort.model");
const Student = require("./models/student.model");
const PORT = 5005;
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

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

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/authenticate.routes");
app.use("/auth", authRoutes);

// Student Routes

app.get("/api/students", (req, res, next) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((err) => {
      next(err);

      console.error("Error while retrieving students -> ", err);
    });
});

app.post("/api/students", (req, res, next) => {
  Student.create(req.body)
    .then((newStudent) => {
      res.status(201).json(newStudent);
    })
    .catch((err) => {
      next(err);

      console.error("Error while creating a new student -> ", err);
    });
});

app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      next(err);

      console.error(`Error retrieving students from one cohort: ${err}`);
    });
});

app.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((err) => {
      next(err);
      console.error(`Error retrieving one student: ${err}`);
    });
});

app.put("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((err) => {
      next(err);

      console.error(`Error updating one student: ${err}`);
    });
});
app.delete("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);

      console.error(`Error deleting one student: ${err}`);
    });
});
// Cohort Routes
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find({})
    .then((cohorts) => {
      res.json(cohorts);
    })
    .catch((err) => {
      next(err);

      console.error("Error while retrieving cohorts -> ", err);
    });
});

app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  const { cohortId } = req.params;

  try {
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }
    res.status(200).json(cohort);
  } catch (err) {
    next(err);
    console.error(`Error retrieving one cohort: ${err}`);
  }
});

app.post("/api/cohorts", (req, res, next) => {
  Cohort.create(req.body)
    .then((newCohort) => {
      res.json(newCohort);
    })
    .catch((err) => {
      next(err);
      console.error(`Error while creating a new cohort: ${err}`);
    });
});

app.delete("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then(() => {
      res.status(204).send("Test");
    })
    .catch((err) => {
      next(err);
      console.error(`Error deleting one cohort: ${err}`);
    });
});
app.put("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((err) => {
      next(err);
      console.error(`Error updating one cohort: ${err}`);
    });
});

app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
