const User = require('./User');
const Task = require('./Task');
const TaskTag = require('./TaskTag');
const Tag = require('./Tag');
const Comments = require('./Comments');
const Friends = require('./Friends');

User.hasMany(Task, {
  foreignKey: 'author_id',
  onDelete: 'CASCADE'
});

User.hasMany(Friends, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Friends.belongsTo(User, {
  foreignKey: 'friend_id'
});

Task.belongsTo(User, {
  foreignKey: 'author_id'
});

Task.belongsToMany(Tag, {
  through: {
    model: TaskTag,
    unique: false
  },
  as: 'task_by_taskTag'
});

Tag.belongsToMany(Task, {
  through: {
    model: TaskTag,
    unique: false
  },
  as: 'tag_by_taskTag'
})

Task.hasMany(Comments, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE'
})

User.hasMany(Comments, {
  foreignKey: 'author_id',
  onDelete: 'SET NULL'
});

Comments.belongsTo(Task, {
  foreignKey: 'task_id'
});
Comments.belongsTo(User, {
  foreignKey: 'author_id'
});

module.exports = { User, Task, TaskTag, Tag, Comments, Friends };
