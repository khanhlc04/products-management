const express = require('express');
const app = express();
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require('dotenv');
dotenv.config();
const database = require('./config/database');
database.connect();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const clientRouter = require('./routes/client/index.route');
const adminRouter = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require('moment');
 
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const port = process.env.PORT;

global._io = io;

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

clientRouter(app);
adminRouter(app);

app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
      pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})