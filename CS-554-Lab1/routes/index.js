const blogsRoutes = require('./blogs');

const constructorMethod = (app) => {
  app.use('/blog', blogsRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;