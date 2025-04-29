const prisma = require('../prisma');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {

    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      userId: user.id,
      isAdmin: true,
      role: 'admin',
    };


    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

   
    res.json({
      message: 'Admin Logged In',
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log(error);
  }
};

module.exports = adminLogin;
