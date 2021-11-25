"use strict";

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  get(id, location) {
    if (id) {
      return this.model.findOne({ where: { id } });
    } else if (location) {
      return this.model.findAll({ where: { location } });
    } else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update(id, data) {
    return this.model
      .findOne({ where: { id } })
      .then((record) => record.update(data));
  }

  delete(id, ownerName) {
    if (ownerName) {
      this.model.destroy({ where: { id } });
    } else {
      return this.model.destroy({ where: { id } });
    }
  }
}

module.exports = DataCollection;
