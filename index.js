/*sudo systemctl start mongodb : khoi dong mongodb
sudo systemctl status mongodb: xem trang thai
sudo systemctl unmask mongodb: ummask mongodb

//loi dpkg
sudo dpkg -i --force-overwrite /var/cache/apt/archives/nvidia-340_340.107-0ubuntu0~gpu18.04.1_amd64.deb
sudo apt -f install

show dbs: xem tat ca db
db: db dag su dung
show collections: cac collection trong db
db.collection_name.find(): dua ra tat ca data trong collection.

*/
const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');
const edge = require('edge.js');

const app = new express();

app.use(
  expressSession({
    secret: 'secret',
  })
);

const Post = require('./database/models/Post');
const auth = require('./middleware/auth');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const logoutController = require('./controllers/logout');

const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');

mongoose
  .connect('mongodb://mongo:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => 'You are now connected to Mongo!')
  .catch((err) => console.error('Something went wrong', err));

const mongoStore = connectMongo(expressSession);
app.use(
  expressSession({
    secret: 'secret',
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(fileUpload());
app.use(connectFlash());
app.use(express.static('public'));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');

app.use('*', (req, res, next) => {
  edge.global('auth', req.session.userId);
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const storePost = require('./middleware/storePost');
app.use('/posts/store', storePost);

app.get('/', homePageController);
app.get('/post/:id', getPostController);
app.get('/posts/new', auth, createPostController);
app.post('/posts/store', storePostController);
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);
app.get('/auth/register', redirectIfAuthenticated, createUserController);
app.post('/users/register', redirectIfAuthenticated, storeUserController);
app.get('/auth/logout', redirectIfAuthenticated, logoutController);

app.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
