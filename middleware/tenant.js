const prisma = require('../prisma');

const verifyTenant = async (req, res, next) => {
  const { org_id } = req.user;
  try {
    const org = await prisma.organization.findUnique({ where: { id: org_id } });
    if (!org) return res.status(403).json({ error: 'Organization not found' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Tenant verification failed' });
  }
};

module.exports = verifyTenant;