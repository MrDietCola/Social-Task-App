const router = require('express').Router();
const { User, Task, Tag, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
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
    res.render('landingPage', {
      layout: 'landing.handlebars'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
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
      logged_in: true
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

  res.render('login');
});

router.get('/tasks', async (req, res) => {
  const tasksData = await Task.findAll({
    where: {
      public: true
    },
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Tag,
        attributes: ['tag_name'],
        as: 'task_by_taskTag'
      },
    ]
  })
  // Serialize data so the template can read it
  // const tasks = tasksData.map((task) => task.get({ plain: true }));
  const tasks = [{
    title: "TaskTestTitle",
    user: "ExampleUser",
    date_created: "00/00/0000",
    description: "This is the description of this task! look at how well this task is doing! oh my goodness look at this task. Don't you want to participate in it??",
    tags: ["epic", "cool", "awesome"],
  },
  {
    title: "TaskTestTitle",
    user: "ExampleUser",
    date_created: "00/00/0000",
    description: "This is the description of this task! look at how well this task is doing! oh my goodness look at this task. Don't you want to participate in it??",
    tags: ["epic", "cool", "awesome"],
  },
  {
    title: "TaskTestTitle",
    user: "ExampleUser",
    date_created: "00/00/0000",
    description: "This is the description of this task! look at how well this task is doing! oh my goodness look at this task. Don't you want to participate in it??",
    tags: ["epic", "cool", "awesome"],
  }]
  console.log(tasks);
  res.render('tasks', { tasks });
});

router.get('/tasks/:id', async (req, res) => {
  const taskData = await Task.findAll({
    where: {
      public: true
    },
    include: [
      {
        model: User,
        attributes: ['name', 'email']
      },
      {
        model: Tag,
        attributes: ['tag_name'],
        as: 'task_by_taskTag'
      },
      {
        model: Comments
      }
    ]
  })

  // Serialize data so the template can read it
  // const task = taskData.map((task) => task.get({ plain: true }));
  const task = {
    title: "TaskTestTitle",
    user: "ExampleUser",
    date_created: "00/00/0000",
    description: "This is the description of this task! look at how well this task is doing! oh my goodness look at this task. Don't you want to participate in it??",
    tags: ["epic", "cool", "awesome"],
    comments: [
      {
        id: 1,
        comment_text: 'wow amazing project',
        date_created: '00/00/000',
        author_id: 5,
        task_id: 7
      }
    ]
  }
  res.render('task', { task })
});

module.exports = router;
