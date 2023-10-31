const sequelize = require('../config/connection');
const { User, Task, Comments, Tag, TaskTag, Friends } = require('../models');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(require('./userData.json'), {
    individualHooks: true,
    returning: true,
  });

  const tasks = await Task.bulkCreate(require('./taskData.json'), {
    individualHooks: true,
    returning: true,
  });

  const comments = await Comments.bulkCreate(require('./commentData.json'), {
    individualHooks: true,
    returning: true,
  })

  const tags = await Tag.bulkCreate(require('./tagData.json'), {
    individualHooks: true,
    returning: true,
  })

  const taskTags = await TaskTag.bulkCreate(require('./taskTagData.json'), {
    individualHooks: true,
    returning: true,
  })

  const friends = await Friends.bulkCreate(require('./friendsData.json'), {
    individualHooks: true,
    returning: true,
  })

  process.exit(0);
};

seedDatabase();
