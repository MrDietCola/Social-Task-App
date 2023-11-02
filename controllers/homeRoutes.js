const router = require('express').Router();
const { User, Task, Tag, Comments, TaskTag, Friends } = require('../models');
const withAuth = require('../utils/auth');
const getEmotion = require('../utils/emotion');
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  headers: {
    'X-RapidAPI-Key': '1715b24a43msh9b5023d4aa71c9bp108651jsn692826a37b09',
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
  }
};

router.get('/', async (req, res) => {
  try {
    const response = await axios.request(options);
    const quote = response.data.content;

    if (req.session.logged_in) {
      res.redirect('/tasks', { ...req.session });
    }

    res.render('landingPage', {
      layout: 'landing.handlebars',
      quote: quote
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    res.render('profile', {
      ...req.session 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile', { ...req.session });
    return;
  }

  res.render('login', { logged_in: req.session.logged_in });
});

router.get('/tasks', async (req, res) => {
  const tasksData = await Task.findAll({
    where: {
      public: true
    },
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Tag,
        through: TaskTag,
        attributes: ['id', 'tag_name'],
        as: 'task_by_taskTag'
      },
    ]
  })

  const tagsData = await Tag.findAll()
  let tags = []
  if (tagsData.length > 0) {
    tags = tagsData.map((tag) => tag.get({ plain: true }));
  }
  // Serialize data so the template can read it
  if (tasksData.length > 0) {
    const tasks = tasksData.map((task) => task.get({ plain: true }));
    res.render('tasks', { tasks, tags, ...req.session });
  }
  else {
    res.render('tasks', { tasks: [], tags, ...req.session })
  }
});

// GET one tag and associated tasks
router.get('/tags/:id', async (req, res) => {
  const tasksData = await Tag.findByPk(req.params.id, {
    include: [
      {
        model: Task,
        through: TaskTag,
        as: 'tag_by_taskTag',
        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
            model: Tag,
            through: TaskTag,
            attributes: ['id', 'tag_name'],
            as: 'task_by_taskTag'
          },
        ]
      },
    ]
  })

  const allTasks = tasksData.get({ plain: true });
  const tasks = allTasks.tag_by_taskTag

  const tagsData = await Tag.findAll()
  let tags = []
  if (tagsData.length > 0) {
    tags = tagsData.map((tag) => tag.get({ plain: true }));
  }
  // Serialize data so the template can read it
  if (tasks.length > 0) {
    res.render('tasks', { tasks, tags, ...req.session });
  }
  else {
    res.render('tasks', { tasks: [], tags, ...req.session })
  }
});

router.get('/search/:searchVal', async (req, res) => {
  const tagData = await Tag.findAll()
  const tagInfo = tagData.map(tag => tag.dataValues);

  let tags = tagInfo.filter(tag => {
    const { tag_name } = tag;
    const searchTerm = req.params.searchVal;

    return [tag_name].some(attribute =>
      attribute.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const taskData = await Task.findAll({
    include: {
      model: User,
      attributes: ['username']
    }
  })
  const taskInfo = taskData.map(task => task.dataValues);
  console.log(taskInfo[0].user.dataValues.username);

  let tasks = taskInfo.filter(task => {
    const { title, description } = task;
    const searchTerm = req.params.searchVal;

    return [title, description].some(attribute =>
      attribute.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const userData = await User.findAll()
  const usersInfo = userData.map(user => user.dataValues);

  let users = usersInfo.filter(user => {
    const { first_name, last_name, username } = user;
    const searchTerm = req.params.searchVal;

    return [first_name, last_name, username].some(attribute =>
      attribute.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!(users.length > 0)) {
    users = [];
  }

  if (!(tasks.length > 0)) {
    tasks = [];
  }

  if (!(tags.length > 0)) {
    tags = [];
  }

  res.render('results', { tasks, users, tags, ...req.session })
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const taskData = await Task.findByPk(req.params.id, {
      where: {
        public: true
      },
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
          as: 'task_by_taskTag'
        },
        {
          model: Comments,

          include: [{
            model: User,
            attributes: ['username'],
            foreignKey: "author_id",
          }]
        }
      ]
    })
    if (taskData) {
      const task = taskData.get({ plain: true });
      let emotion = await getEmotion(task.description);
      res.render('task', { task, ...req.session, emotion })
    }
    else {
      res.redirect('/tasks', { ...req.session });
    }
  } catch (err) {
    res.status(500).json(err);
  }

  // Serialize data so the template can read it
});

router.get('/user/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: { exclude: ['id', 'password'] }
    });

    // Shows private posts as well if the user page belongs to the current user. 
    let activeUser;
    if (req.session.logged_in && req.session.user.id == req.params.id) {
      activeUser = { author_id: req.params.id }
    }
    else {
      activeUser = {
        public: true,
        author_id: req.params.id
      }
    }

    const tasksData = await Task.findAll({
      where: activeUser,
      include: [
        {
          model: Tag,
          through: TaskTag,
          attributes: ['id', 'tag_name'],
          as: 'task_by_taskTag'
        },
      ]
    })
    // Serialize data so the template can read it
    let tasks;
    const users = userData.get({ plain: true });
    if (users && tasksData.length > 0) {
      tasks = tasksData.map((task) => task.get({ plain: true }));
      tasks = tasks.map((task) => { Object.assign(task, { users: { username: users.username } }); return task; });
      res.render('user', { tasks, users, ...req.session });
    }
    else if (users) {
      res.render('user', { tasks: [], users, ...req.session });
    }
    else {
      res.render('user', { tasks, users, ...req.session });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.get('/home', async (req, res) => {
  try {
    const response = await axios.request(options);
    const quote = response.data.content;

    if (req.session.logged_in) {
      res.redirect('/tasks');
    }

    res.render('landingPage', {
      layout: 'landing.handlebars',
      quote: quote,
      ...req.session, // Pass the logged_in flag to the template
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/add-task', withAuth, (req, res) => {
  try {
    res.render('addTask', { ...req.session });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

router.get('/add-tag', withAuth, (req, res) => {
  try {
    res.render('addTag', { ...req.session });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

router.get('/friends/:id', withAuth, async (req, res) => {
  try {
    const friendsData = await Friends.findAll({
      where: {
        user_id: req.params.id
      },
      include: [
        {
          model: User,
          foreignKey: 'friend_id',
          attributes: { exclude: ['password'] },
          include: [
            {
              model: Task,
              required: false,
              where: { public: true }
            },
          ]
        },
      ]
    });

    let friends =  friendsData.map(task => task.get({ plain: true }));

    res.render('friends', { friends, ...req.session });

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


module.exports = router;
