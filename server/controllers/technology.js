const Technology = require("../models/technology");

exports.createTechnology = (req, res, next) => {
  const technology = new Technology(req.body);
  technology.save((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      technology: hd,
    });
  });
};

exports.updateTechnology = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Technology.findByIdAndUpdate(id, req.body);
    const technology = await Technology.findById(id);
    res.send({ technology });
  } catch (err) {
    return next(err);
  }
};

exports.listTechnology = (req, res, next) => {
  Technology.find({ organization: req.params.org_id }).exec((err, hds) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      technologies: hds,
    });
  });
};

exports.listAllTechnology = (req, res, next) => {
  Technology.find({})
    .populate({ path: "organization", select: "_id profile" })
    .sort({ title: 1 })
    .exec((err, hds) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        technologies: hds,
      });
    });
};

exports.deleteTechnology = (req, res, next) => {
  Technology.deleteOne({ _id: req.params.id }).exec((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      technology: hd,
    });
  });
};
