const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');
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
// third party api route
  try {
    const response = await axios.request(options);
    const quote = response.data.content;

    res.render('landingPage', {
      layout: 'landing.handlebars',
      quote: quote
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }

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







module.exports = router;
