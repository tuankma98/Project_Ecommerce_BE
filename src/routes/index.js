const authRoute = require('../routes/auth.routes');
const userRoute = require('../routes/user.routes');
const adminRoute = require('../routes/admin.routes');
const teacherRoute = require('../routes/teacher.routes');
const blogRoute = require('../routes/blog.routes');
const commentRoute = require('../routes/comment.routes');
const searchRoute = require('../routes/search.routes');

function route(app) {
  /**
   * Router - /auth/*
   * Method - *
   */
  app.use("/auth", authRoute);

  /**
   * Router Middleware
   * Router - /user/*
   * Method - *
   */
  app.use("/user", userRoute);

  app.use("/admin", adminRoute);

  app.use("/teacher", teacherRoute);

  app.use("/blog", blogRoute)
  
  app.use("/comment", commentRoute);

  app.use("/search", searchRoute);

  app.use('/', (req, res) => {
    res.send('Hello Root!')
  });
}

module.exports = route;
