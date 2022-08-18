import db from './db/models/index.mjs';
import InitJournalsController from './controllers/journals.mjs';
import InitUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const JournalsController = InitJournalsController(db);
  const UsersController = InitUsersController(db);

  app.post('/user', UsersController.createUser);
  app.get('/user', UsersController.getUser);
  app.get('/signin', UsersController.signIn);
  app.get('/logout', UsersController.logout);
  app.get('/reAuth', UsersController.reAuth);
  app.delete('/user', UsersController.deleteUser);

  app.get('/journal/:year/:month/:date', JournalsController.getEntry);
  app.get('/journal/:year/:month', JournalsController.getMonthJournals);
  app.post('/journal/new', JournalsController.createJournal);
  // app.get('/journal/:username', JournalsController.getAllJournals);
  // app.post('/journal/:entryId/save', JournalsController.updateJournal);
  // app.delete('/journal/:entryId/delete');
}
