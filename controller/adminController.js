const prisma = require('../prisma')


const createOrg = async (req,res) => {


  const {name, subscription_status} = req.body
console.log(req.body)
  try {
    const existingOrg = await prisma.organization.findUnique({ where: { name } });
    if (existingOrg) {
      return res.status(400).json({ error: 'Organization already exists' });
    }

    await prisma.organization.create({
      data: { name: name, subscription_status : subscription_status },
    });

    res.status(201).json({ message: 'Organization created' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log(error)
  }

}


const org = async (req, res) => {

  try {
    
    const findorg = await prisma.organization.findMany({})
 
    res.json({findorg})
  } catch (error) {
    console.log(error)
  }
}



const fetchUser = async (req, res) => {

  try {

    const users = await prisma.user.findMany({
     
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    })
    res.json(users)
    
  } catch (error) {
    console.log(error)
  }
}



const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id), 
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

}


const fetchComment = async (req, res) => {


  try {

    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            first_name: true,
            organization : {
              select : {
                name : true
              }
            }
          }
        },
       
      }
    });
    res.json({comments})
    console.log(comments)
    
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
    console.log(error)
  }
}


module.exports = {org,createOrg, fetchUser, deleteUser, fetchComment}