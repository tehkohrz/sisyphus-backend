export default function initUsersController(db) {
  // Create new user
  async function createUser(req, res) {
    try {
      // Checks for an exiting user and throws error if found
      const existingUser = await db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (existingUser) {
        throw new Error('User exists');
      }

      const newUser = await db.User.create({
        username: req.body.username,
        password: req.body.password,
      });
      console.log('User Created', newUser);
      res.cookie('loggedIn', true);
      res.cookie('sessionId', newUser.username);
      res.send({ newUser });
    } catch (err) {
      console.log(err);
      // Sends error message back to for react to render toast
      res.send(err);
    }
  }

  async function getUser(req, res) {
    try {
      const userData = await db.User.findOne({
        where: {
          username: req.cookies.username,
        },
      });
      res.send({ userData });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteUser(req, res) {
    try {
      let success = false;
      await db.User.destroy({
        where: {
          username: req.cookies.username,
        },
      });
      console.log('User deleted');
      success = true;
      res.send({ success });
    } catch (err) {
      console.log(err);
      res.send({ success: false });
    }
  }

  async function signIn(req, res) {
    try {
      console.log(req.body);
      // Get user data
      const user = await db.User.findOne({
        where: {
          username: req.body.username,
        },
      });

      // Password not match or usernot found
      if (!user) {
        throw new Error('User not found');
      }
      if (user.password !== req.body.password) {
        throw new Error('Password incorrect');
      }
      // User found and password correct
      if (user.password === req.body.password) {
        // Set cookie
        console.log('Set Cookeis');
        res.cookie('username', user.username);
        res.cookie('id', user.id);
      }
      res.send(user);
    } catch (err) {
      res.status(400).send({ errMsg: err.message });
    }
  }

  function logout(req, res) {
    // Clearing cookies on client side
    // This might not work as it clears cookies on the server and not cilent side
    res.clearCookie('username');
    res.clearCookie('id');
    // Setting cookies to expire
    // res.cookie('username', '', { expires: Date.now() });
    // res.cookie('id', '', { expires: Date.now() });
  }

  async function reAuth(req, res) {
    const { username, id } = req.cookies;
    // If there are no cookies
    if (!username || !id) {
      res.send({ success: false });
    }
    // Check that the cookies do exist
    if (username && id) {
      const user = await db.User.findOne({
        where: {
          id,
        },
      });
      // Cookie incorrect no user found - to cear all cookies
      if (!user || user.username !== username) {
        res.clearCookie('username');
        res.clearCookie('id');
        res.send({ success: false });
      }
      if (user.username === username) {
        console.log('backend login');
        res.send({ success: true, user });
      }
    }
  }

  return {
    getUser,
    reAuth,
    logout,
    signIn,
    deleteUser,
    createUser,
  };
}
