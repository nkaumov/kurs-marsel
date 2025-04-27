require('dotenv').config();
const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const flash   = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const methodistRoutes = require('./routes/methodist');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const { ensureAuth } = require('./middleware/authMiddleware');

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override for PUT/DELETE in forms
app.use(methodOverride('_method'));

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// Flash messages
app.use(flash());

// Globals for templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg   = req.flash('error_msg');
    res.locals.error       = req.flash('error');
    res.locals.user        = req.session.user || null;
    next();
});

// Handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        formatDate: require('./utils/formatDate'),
        eq: (a,b) => a === b
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.use('/methodist', ensureAuth, methodistRoutes);
app.use('/student', ensureAuth, studentRoutes);
app.use('/teacher', ensureAuth, teacherRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error/404');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error/500');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
