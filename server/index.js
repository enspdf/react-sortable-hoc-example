const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/react-sortable", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));

const app = express();
const Task = require("./models/Task");

app.use(cors());
app.use(express.json());

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  newTask.sorting = await Task.estimatedDocumentCount();
  newTask.save();
  res.json(newTask);
});

app.put("/tasks", async (req, res) => {
  const tasksIds = req.body;

  for (const [i, id] of tasksIds.entries()) {
    await Task.updateOne({ _id: id }, { sorting: i });
  }

  res.json({ msg: "Tha list was ordered" });
});

app.listen(4000, () => {
  console.info("Server on port 4000");
});
