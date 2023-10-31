const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./taskRoutes');

router.use('/users', userRoutes);
router.use('/tasks', projectRoutes);

module.exports = router;
