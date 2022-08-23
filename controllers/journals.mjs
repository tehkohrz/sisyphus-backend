import { Op, Sequelize } from 'sequelize';

export default function InitJournalsController(db) {
  // Gets single entry
  async function getEntry(req, res) {
    try {
      const { year, month, date } = req.params;
      const entry = await db.Journal.findOne({
        where: {
          [Op.and]: [
            { user_id: req.cookies.id },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'month', Sequelize.col('entry_date')),
                month
              ),
            },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'year', Sequelize.col('entry_date')),
                year
              ),
            },
            {
              // day of month
              date: Sequelize.where(
                Sequelize.fn('date_part', 'd', Sequelize.col('entry_date')),
                date
              ),
            },
          ],
        },
      });
      res.send(entry);
    } catch (err) {
      console.log(err);
    }
  }
  // ONLY GETS THE DATE FOR THE MONTH
  async function getMonthJournals(req, res) {
    try {
      const { year, month } = req.params;
      const entries = await db.Journal.findAll({
        attributes: ['entry_date'],
        where: {
          [Op.and]: [
            { user_id: req.cookies.id },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'month', Sequelize.col('entry_date')),
                month
              ),
            },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'year', Sequelize.col('entry_date')),
                year
              ),
            },
          ],
        },
      });
      res.send(entries);
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

  // Post and updaet journal entries
  async function updateJournal(req, res) {
    try {
      let success = false;
      const { selectedEntry } = req.body;
      console.log(selectedEntry);
      const date = new Date(selectedEntry.entry_date);
      // Looking for existing entry
      const existingEntry = await db.Journal.findOne({
        where: {
          [Op.and]: [
            { user_id: req.cookies.id },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'month', Sequelize.col('entry_date')),
                date.getMonth() + 1
              ),
            },
            {
              date: Sequelize.where(
                Sequelize.fn('date_part', 'year', Sequelize.col('entry_date')),
                date.getFullYear()
              ),
            },
            {
              // day of month
              date: Sequelize.where(
                Sequelize.fn('date_part', 'd', Sequelize.col('entry_date')),
                date.getDate()
              ),
            },
          ],
        },
      });
      console.log('Entry created', existingEntry);
      // Update existing entry
      if (existingEntry) {
        await existingEntry.update({
          title: selectedEntry.title,
          content: selectedEntry.content,
          updatedAt: Date.now(),
        });
        success = true;
        res.send(success);
      }
      // If entry does not exist create new one
      if (!existingEntry) {
        const entry = await db.Journal.create({
          userId: req.cookies.id,
          title: selectedEntry.title,
          content: selectedEntry.content,
          entryDate: date,
        });
        console.log('New Entry created', entry);
        res.send(entry);
      }
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
    deleteJournal,
    updateJournal,
    getAllJournals,
    getMonthJournals,
    getEntry,
  };
}
