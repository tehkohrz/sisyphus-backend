import { Op, Sequelize } from 'sequelize';

export default function InitJournalsController(db) {
  async function getJournal(req, res) {
    try {
      const entry = await db.Journal.findOne({
        where: {
          entryId: req.body.entryId,
        },
      });
      console.log('Entry retreived', entry);
      res.send({ entry });
    } catch (err) {
      console.log(err);
    }
  }

  async function getMonthJournals(req, res) {
    try {
      const { year, month } = req.params;

      const entries = await db.Journal.findAll({
        where: {
          [Op.and]: [
            { id: req.cookies.id },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'month', Sequelize.col('entry_date')),
                month,
              ),
            },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'year', Sequelize.col('entry_date')),
                year,
              ),
            },
          ],
        },
      });
      console.log({ entries });
      res.send({ entries });
    } catch (err) {
      console.log(err);
    }
  }

  // ! See if you can search this way without storing the userId
  async function getAllJournals(req, res) {
    try {
      const entries = await db.Journal.findAll({
        include: {
          model: 'user',
          where: {
            username: req.params.username,
          },
        },
      });
      console.log('Entries retreived');
      res.send({ entries });
    } catch (err) {
      console.log(err);
    }
  }

  async function createJournal(req, res) {
    try {
      const entry = await db.Journal.create({
        userId: req.cookies.id,
        title: req.body.title,
        content: req.body.content,
        entryDate: req.body.date,
      });
      console.log('Entry created', entry);
      res.send(entry);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateJournal(req, res) {
    try {
      const updatedEntry = await db.Journal.update(
        {
          content: req.body.content,
        },
        {
          where: {
            entryId: req.body.entryId,
          },
        },
      );
      console.log('Entry updated', updatedEntry);
      res.send({ updatedEntry });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteJournal(req, res) {
    try {
      await db.Journal.destroy({
        where: {
          entryId: req.params.entryId,
        },
      });
      console.log('Entry deleted');
    } catch (err) {
      console.log(err);
    }
  }

  return {
    deleteJournal, updateJournal, createJournal, getAllJournals, getMonthJournals, getJournal,
  };
}
