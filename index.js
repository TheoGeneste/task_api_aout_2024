const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./bdd');
const userRouter = require('./route/user');
const taskRouter = require('./route/task');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);





app.listen(3000, () => {
    console.log('Server sur le port 3000');
});