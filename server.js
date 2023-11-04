const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
// const imgut =require('imgur');
const sequelize = require('./config/connection');
// const fileUpload = require('express-fileupload');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//aded to acces images
app.use("/images", express.static(path.join(__dirname, "/public/images")));
// app.use("/api", express.static(path.join(__dirname, "/controllers/api")));


app.post('/upload', (req, res) => {
  if (!req, files) {
    return res.status(404).send('Not Files uploaded');
  }

  let sampleFile = req.files.sampleFile
  let uploadPath = __dirname + '/uploads/' + sampleFile.name

  sampleFile.mv(uploadPath, function (err,) {
    if (err) {
      return res.status(500).send(err)
    }
  })
})




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
