const express = require("express");
const { task, fetchTasks, deleteTask, updateTask } = require("../controller/taskController");
const upload = require('../middleware/upload')

const router = express.Router();


router.post("/tasks", upload.single('file'),
  task
);

router.get('/fetchTasks', fetchTasks)
router.delete('/deleteTask/:id', deleteTask)
router.put('/updateTask/:id', updateTask)



module.exports = router;
