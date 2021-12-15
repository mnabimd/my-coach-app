const express = require('express');
const app = express();
const authRouter = require('./routers/auth/auth');
const coachesRouter =  require('./routers/coaches/coaches');
const coursesRouter = require('./routers/courses/courses');
const usersRouter = require('./routers/users/users');
const adminRouter = require('./routers/admin/admin');
const cors = require('cors');
const path = require('path');
// Load in DB
const db = require('./db/connection');

app.use(express.json({limit: '50mb'}));
app.use(cors());

app.use(authRouter, coachesRouter, coursesRouter, usersRouter, adminRouter);

const publicDir = path.join(__dirname, '../public');

// Let's serve the static files, remember to build them first!
app.use(express.static(publicDir));

app.get(/.*/, (req, res) => res.sendFile(path.join(publicDir, 'index.html')));


let PORT = 7500;

app.listen(PORT, () => console.log(`App started on http://localhost:${PORT}`));