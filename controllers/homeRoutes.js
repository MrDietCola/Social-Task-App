const router = require('express').Router();
const { User, Task, Tag, Comments, TaskTag } = require('../models');
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
      res.redirect('/profile');
    }

    res.render('landingPage', {
      layout: 'landing.handlebars',
      quote: quote
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
  // try {
  // Get all projects and JOIN with user data
  // const projectData = await Project.findAll({
  //   include: [
  //     {
  //       model: User,
  //       attributes: ['name'],
  //     },
  //   ],
  // });

  // Serialize data so the template can read it
  // const projects = projectData.map((project) => project.get({ plain: true }));

  // Pass serialized data and session flag into template
  //   res.render('landingPage', {
  //     layout: 'landing.handlebars'
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json(err);
  // }


});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    // const userData = await User.findByPk(req.session.user_id, {
    //   attributes: { exclude: ['password'] },
    //   include: [{ model: Project }],
    // });

    // const user = userData.get({ plain: true });

    res.render('profile', {
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
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
        attributes: ['tag_name'],
        as: 'task_by_taskTag'
      },
    ]
  })
  // Serialize data so the template can read it
  if (tasksData.length > 0) {
    const tasks = tasksData.map((task) => task.get({ plain: true }));
    res.render('tasks', { tasks, logged_in: req.session.logged_in });
  }
  else {
    res.render('tasks', { tasks: [], logged_in: req.session.logged_in })
  }
});

router.get('/tasks/:id', async (req, res) => {
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
        attributes: ['tag_name'],
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
    res.render('task', { task, logged_in: req.session.logged_in, emotion })
  }
  else {
    res.redirect('/tasks');
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
          attributes: ['tag_name'],
          as: 'task_by_taskTag'
        },
      ]
    })
    // Serialize data so the template can read it
    const user = userData.get({ plain: true });
    if (user && tasksData.length > 0) {
      let tasks = tasksData.map((task) => task.get({ plain: true }));
      tasks = tasks.map((task) => { Object.assign(task, { user: { username: user.username } }); return task; });
      console.log("user", user);
      console.log("tasks", tasks);
      res.render('user', { tasks, user });
    }
    else if (user) {
      res.render('user', { tasks: [], user });
    }
    else {
      res.render('user', { tasks, user });
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

      res.render('landingPage', {
        layout: 'landing.handlebars',
        quote: quote,
        logged_in: req.session.logged_in, // Pass the logged_in flag to the template
      });
    
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
