const moment = require('moment');
const {customAlphabet} = require('nanoid');
const nanoid = customAlphabet('abcdefgh1234567890', 8);
const RESULT = require('./constants.js');

class CronTask {
  name;
  constructor({name, description, logModel}) {
    this.name = name;
    this.description = description;
    this.logModel = logModel;
  }

  static info() {
    return {
      name: this.name,
      description: this.description,
    };
  }

  log(...args) {
    console.log(`[${this.name}:${this.iterateId}]`, ...args);
  }

  generateIterateId() {
    this.iterateId = nanoid();
  }

  clearIterateId() {
    this.iterateId = null;
  }

  async logToModel(startTime, result, subresult) {
    if (this.logModel) {
      await this.logModel.create({
        date: startTime,
        task: this.name,
        iterateId: this.iterateId,
        result,
        subresult,
        executingTime: moment().diff(startTime, 'seconds'),
      });
    }
  }

  async run() {
    const start = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      this.generateIterateId();
      this.log('>>>>> start');
      const subresult = await this.runChild();
      await this.logToModel(start, RESULT.OK, subresult);
    } catch (err) {
      await this.logToModel(start, RESULT.FAIL, err.message);
    } finally {
      this.log('>>>>> end');
      this.clearIterateId();
    }
  }
}

module.exports = {CronTask};
