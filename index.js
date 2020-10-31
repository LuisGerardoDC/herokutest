const express = require('express');
const passport = require('passport');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')

const boolParser = require('express-query-boolean');

const { config } = require('./config/index');
const PORT = config.port || 3000;
const authApi = require('./routes/auth');
const resetPasswordApi = require('./routes/resetPassword');
const providerAuth = require('./routes/providerAuth');
const categoriesApi = require('./routes/categories');
const eventsApi = require('./routes/events');
const userEventApi = require('./routes/user-event');
const notFoundHandler =  require('./utils/middleware/notFoundHandler')
const {logErrors, wrapErrors, errorHandler} =  require('./utils/middleware/errorHandler')


app.get('/', async (req, res) => {
  res.status(200).send({
    hola: "mundo"
  })
});

//cookie parser
app.use(cookieParser());
//boolParser
app.use(boolParser());
//cors
app.use(cors());
// body parser
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//routes
authApi(app);
providerAuth(app);
categoriesApi(app);
resetPasswordApi(app);
eventsApi(app);
userEventApi(app);

//not found 404
app.use(notFoundHandler);
// **errors handlers**
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

const server = app.listen(PORT, () => {
 debug(`Server listen on http://localhost:${server.address().port}`)
});