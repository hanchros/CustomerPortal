const Question = require("../models/question");
const SecurityQuestion = require("../models/securityquestion");
const User = require("../models/user");
const utils = require("./util");

//= =======================================
// Challenge Registration Route
//= =======================================
exports.createQuestion = (req, res, next) => {
  req.body.participant = req.user._id;
  const sq = new SecurityQuestion(req.body);
  sq.save((err, securityquestion) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      securityquestion,
    });
  });
};

exports.updateQuestion = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  req.body.participant = req.user._id;
  try {
    await SecurityQuestion.findByIdAndUpdate(id, req.body);
    let securityquestion = await SecurityQuestion.findById(id);
    res.status(201).json({
      securityquestion,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    let sq = await SecurityQuestion.findOne({ participant: req.user._id });
    return res.status(201).json({ securityquestion: sq || {} });
  } catch (err) {
    return next(err);
  }
};

exports.listQuestions = async (req, res, next) => {
  try {
    let questions = await Question.find({});
    res.status(201).json({
      questions,
    });
  } catch (error) {
    return next(err);
  }
};

exports.checkQuestion = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        error: "You email doesn't exist in list",
      });
    }
    let sq = await SecurityQuestion.findOne({ participant: user._id });
    if (!sq) {
      return res.status(401).json({
        error: "You didn't set security question yet",
      });
    }

    let filters = sq.questions.filter(
      (q) =>
        utils.compareIds(q.question, req.body.question) &&
        q.answer.toLowerCase() === req.body.answer.toLowerCase()
    );
    if (filters.length > 0) {
      return res.status(201).json({
        userid: user._id,
      });
    }
    return res.status(401).json({
      error: "security question and answer don't match",
    });
  } catch (error) {
    return next(err);
  }
};
