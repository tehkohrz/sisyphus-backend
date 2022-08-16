import { Op } from 'sequelize';

export default class initJournalsController {
  constructor(db) {
    this.db = db;
  }

  async getJournal(req, res) {
    try {
      const entry = await this.db.Journal.findOne({
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

  async getMonthJournals(req, res) {
    try {
      const { year, month } = req.params;
      const entries = await this.db.Journal.findAll({
        where: {
          [Op.and]: [
            { id: req.cookies.id },
            {
              date: this.db.where(
                this.db.fn('MONTH', this.db.col('entry_date')),
                month
              ),
            },
            {
              date: this.db.where(
                this.db.fn('YEAR', this.db.col('entry_date')),
                year
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
  async getAllJournals(req, res) {
    try {
      const entries = await this.db.Journal.findAll({
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

  async createJournal(req, res) {
    try {
      const entry = await this.db.Journal.create({
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

  async updateJournal(req, res) {
    try {
      const updatedEntry = await this.db.Journal.update(
        {
          content: req.body.content,
        },
        {
          where: {
            entryId: req.body.entryId,
          },
        }
      );
      console.log('Entry updated', updatedEntry);
      res.send({ updatedEntry });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteJournal(req, res) {
    try {
      await this.db.Journal.destroy({
        where: {
          entryId: req.params.entryId,
        },
      });
      console.log('Entry deleted');
    } catch (err) {
      console.log(err);
    }
  }
}
