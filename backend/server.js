const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');
const cors = require('cors');

const app = express();

// Utiliser CORS avant les routes
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => console.log(error));
