const Timeline = require("../models/timeline");

exports.createTimeline = async (req, res, next) => {
  try {
    const timeline = new Timeline(req.body);
    let tl = await timeline.save();
    tl = await Timeline.findById(tl._id).populate({
      path: "creator",
      select: "_id profile",
    });
    res.status(201).json({
      timeline: tl,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateTimeline = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Timeline.findByIdAndUpdate(id, req.body);
    let tl = await Timeline.findById(id).populate({
      path: "creator",
      select: "_id profile",
    });
    res.status(201).json({
      timeline: tl,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listTimeline = (req, res, next) => {
  Timeline.find({ project: req.params.projectId })
    .populate({ path: "creator", select: "_id profile" })
    .sort({ createdAt: -1 })
    .exec((err, tls) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        timelines: tls,
      });
    });
};

exports.deleteTimeline = (req, res, next) => {
  Timeline.deleteOne({ _id: req.params.id }).exec((err, tl) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      timeline: tl,
    });
  });
};
