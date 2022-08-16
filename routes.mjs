import db from './db/models/index';
import initJournalsController from './controllers/journals';
import initUsersController from './controllers/users';

export default function routes(app) {
  const JournalsController = initJournalsController(db);
  const UsersController = initUsersController(db);

  app.post('/user', UsersController.createUser);
  app.get('/user', UsersController.getUser);
  app.get('/signin', UsersController.signIn);
  app.get('/logout', UsersController.logout);
  app.get('/reAuth', UsersController.reAuth);
  app.delete('/user', UsersController.deleteUser);

  app.get('/journal/:username/:entryId', JournalsController.getJournal);
  app.get('/journal/:username', JournalsController.getAllJournals);
  app.get('/journal/:year/:month', JournalsController.getMonthJournals);
  app.post('/journal/new', JournalsController.createJournal);
  app.post('/journal/:entryId/save', JournalsController.updateJournal);
  app.delete('/journal/:entryId/delete');
}
