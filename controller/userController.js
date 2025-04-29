const bcrypt = require('bcryptjs');
const prisma = require('../prisma')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
  const { email, password, first_name, last_name, org_name } = req.body;
  
  try {

    const organization = await prisma.organization.findUnique({
      where: { name: org_name },
    });

    if (!organization) {
      return res.status(400).json({ error: 'Organization not found, If Not Found Create One Using Admin Panel' });
    }

    if (password.length < 6){
      return res.status(400).json({ error: 'Password Not Be Less Than 6 Characters' });
    }
  
    const existingUser = await prisma.user.findUnique({
      where: {
        email_org_id: {
          email: email,
          org_id: organization.id,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists in this organization' });
    }

 
    const password_hash = await bcrypt.hash(password, 10);

   
    await prisma.user.create({
      data: {
        org_id: organization.id,
        email,
        password_hash,
        role: 'user',
        first_name,
        last_name,
      },
    });

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



const login = async (req, res) => {
  const { email, password, org_name } = req.body;

  try {
    
    const org = await prisma.organization.findUnique({
      where: { name: org_name },
    });

    if (!org) {
      return res.status(404).json({ error: 'Organization not found,  If Not Found Create One Using Admin Panel' });
    }

    const user = await prisma.user.findUnique({
      where: {
        email_org_id: {
          email,
          org_id: org.id,
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or organization' });
    }


    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }


    const payload = {
      userId: user.id,
      orgId: org.id,
      email: user.email,
      first_name : user.first_name
    };

    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const fetchTask = async (req, res) => {
  const userId = req.user.userId;

  console.log(userId)


  try {
    const tasks = await prisma.task.findMany({
      where: {  assigned_to : userId },
      include: {
        assignee: true,
      }
    });

    res.json({tasks})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const comment = async (req, res) => {
  try {
    const { content } = req.body
    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }


    const userId = req.user.userId  

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
      }
    })

    res.status(201).json({ message: 'Comment added successfully', comment: newComment })
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }}

  module.exports = {signup, login, fetchTask, comment}