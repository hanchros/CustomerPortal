const Gallery = require("../models/gallery");

//= =======================================
// Gallery Registration Route
//= =======================================
exports.createGallery = (req, res, next) => {
  const gallery = new Gallery(req.body);
  gallery.save((err, gal) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      gallery: gal,
    });
  });
};

exports.updateGallery = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Gallery.findByIdAndUpdate(id, req.body);
    let gal = await Gallery.findById(id);
    res.status(201).json({
      gallery: gal,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getGallery = (req, res, next) => {
  Gallery.findById(req.params.gallery_id).exec((err, gallery) => {
    if (err) {
      return next(err);
    }
    if (!gallery.project) {
      gallery.project = {};
    }
    res.status(201).json({ gallery });
  });
};

exports.getProjectGallery = (req, res, next) => {
  Gallery.findOne({ project: req.params.project_id }).exec((err, gallery) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ gallery });
  });
};

exports.listGallery = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;

    let filter = { public: true };
    let tags = [];
    for (let k of Object.keys(req.body)) {
      if (req.body[k] && req.body[k].length > 0) {
        tags = [...tags, ...req.body[k]];
      }
    }
    if (tags.length > 0) filter["tags"] = { $all: tags };
    if (searchStr.length > 2)
      filter["$or"] = [
        { name: { $regex: searchStr, $options: "i" } },
        { description: { $regex: searchStr, $options: "i" } },
        { short_description: { $regex: searchStr, $options: "i" } },
      ];

    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { name: 1 };
        break;
      case "Z-A":
        sort = { name: -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await Gallery.find(filter).countDocuments();
    let gallerys = await Gallery.find(filter)
      .sort(sort)
      .skip(curNum)
      .limit(16);
    res.status(201).json({
      gallerys,
      total,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteGallery = (req, res, next) => {
  Gallery.deleteOne({ _id: req.params.gallery_id }).exec((err, gallery) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      gallery,
    });
  });
};

exports.privateGallery = async (req, res, next) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { public: false });
    let gallery = await Gallery.findById(req.params.id);
    res.status(201).json({
      gallery,
    });
  } catch (err) {
    return next(err);
  }
};
