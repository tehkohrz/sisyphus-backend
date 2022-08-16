export default class initUsersController {
  constructor(db) {
    this.db = db;
  }

  // Create new user
  async createUser(req, res) {
    try {
      // Checks for an exiting user and throws error if found
      const existingUser = await this.db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (existingUser) {
        throw new Error('User exists');
      }

      const newUser = await this.db.User.create({
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

  async getUser(req, res) {
    try {
      const userData = await this.db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      res.send({ userData });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUser(req, res) {
    try {
      let success = false;
      await this.db.User.destroy({
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

  async signIn(req, res) {
    try {
      // Get user data
      const user = await this.db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      // Password not match or usernot found
      if (!user) {
        const error = new Error('User not found');
        res.send(error);
      }
      if (user.password !== req.body.password) {
        const error = new Error('Password wrong.');
        res.send(error);
      }
      // User found and password correct
      if (user.password === req.body.password) {
        // Set cookie
        res.cookie('Username', user.username);
        res.cookie('id', user.id);
      }
      res.send({ user });
    } catch (err) {
      console.log(err);
      res.send({ success: false });
    }
  }

  logout(req, res) {
    // Clearing cookies on client side
    // This might not work as it clears cookies on the server and not cilent side
    res.clearCookie('username');
    res.clearCookie('id');
    // Setting cookies to expire
    // res.cookie('username', '', { expires: Date.now() });
    // res.cookie('id', '', { expires: Date.now() });
  }

  async reAuth(req, res) {
    const { username, id } = req.cookies;
    // If there are no cookies
    if (!username || !id) {
      res.send({ success: false });
    }
    // Check that the cookies do exist
    if (username && id) {
      const user = await this.db.User.findOne({
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
        res.send({ success: true, user });
      }
    }
  }
}
