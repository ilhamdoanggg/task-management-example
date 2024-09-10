const express = require('express');
const logger = require('./config/logger'); 
const taskRoutes = require('./routes/tasksRoute');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  logger.info(`Response code: ${res.statusCode}`);
  next();
});

app.use(taskRoutes);

app.get('/hello', (req, res) => {
  res.send('Hello World!');
})
// Start the server
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
});
