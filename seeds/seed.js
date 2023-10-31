const sequelize = require('../config/connection');
const { User, Task, Comments, Tag, TaskTag } = require('../models');

const userData = require('./userData.json');
// const projectData = require('./projectData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
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


  // for (const project of projectData) {
  //   await Project.create({
  //     ...project,
  //     user_id: users[Math.floor(Math.random() * users.length)].id,
  //   });
  // }

  process.exit(0);
};

seedDatabase();
