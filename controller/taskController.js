const prisma = require('../prisma')


const task = async (req, res) => {
  const {
    title,
    description,
    assigned_to, 
    due_date,
    org_id, 
  } = req.body;

  console.log(req.body)

  try {
 
    const user = await prisma.user.findFirst({
      where: {
        id: assigned_to,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Assigned user not found' });
    }

  
    const task = await prisma.task.create({
      data: {
        title,
        description,
        due_date: new Date(due_date),
        status: 'To Do',
        assigned_to,
        org_id,   
      },
    });
    
    return res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }}


  const fetchTasks = async (req, res) => {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          organization: {
            select: {
              name: true,
            },
          },
          assignee: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
  
      return res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  };
  


const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Failed to delete task" });
  }
};



const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  try {
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
      },
    });
    return res.status(200).json({ message: "Task updated", task: updated });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: "Failed to update task" });
  }
};




  module.exports = { task, fetchTasks, deleteTask, updateTask}