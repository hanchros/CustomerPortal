const Article = require("../models/article");

exports.createArticle = (req, res, next) => {
  const article = new Article(req.body);
  article.save((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      article: hd,
    });
  });
};

exports.updateArticle = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await Article.findByIdAndUpdate(id, req.body);
    const article = await Article.findById(id);
    res.send({ article });
  } catch (err) {
    return next(err);
  }
};

exports.bulkUpdateArticle = async (req, res, next) => {
  const articles = req.body.articles;
  try {
    for (let article of articles) {
      await Article.findOneAndUpdate(
        { _id: article._id },
        { order: article.order }
      );
    }
    res.status(201).json({
      message: "Update success",
    });
  } catch (err) {
    return next(err);
  }
};

exports.listArticle = (req, res, next) => {
  Article.find({})
    .sort({ tag: 'asc', order: 1 })
    .exec((err, hds) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        articles: hds,
      });
    });
};

exports.deleteArticle = (req, res, next) => {
  Article.deleteOne({ _id: req.params.id }).exec((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      article: hd,
    });
  });
};
