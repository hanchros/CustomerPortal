const ProjectCompany = require("../models/projectcompany");

exports.createProjectCompany = async (req, res, next) => {
  try {
    let expcs = await ProjectCompany.find(req.body);
    if (expcs && expcs.length > 0) {
      return res
        .status(422)
        .send({ error: "The company is already associated with this project" });
    }
    let projectcompany = new ProjectCompany(req.body);
    projectcompany = await projectcompany.save();
    return res.status(200).json({ projectcompany });
  } catch (err) {
    return next(err);
  }
};

exports.resolvePCInvite = async (req, res, next) => {
  try {
    let projectcompany = await ProjectCompany.findById(req.params.inv_id);
    if (req.body.resolve === "accept") {
      projectcompany.status = 0;
      await projectcompany.save();
    } else {
      await ProjectCompany.deleteOne({ _id: req.params.inv_id });
    }
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.listPCByCompany = async (req, res, next) => {
  try {
    let projectcompanies = await ProjectCompany.find({
      softcompany: req.params.company_id,
    })
      .populate({ path: "softcompany", select: "_id profile" })
      .populate({
        path: "project",
        populate: {
          path: "participant",
          select: "_id profile",
        },
      })
      .populate("technology");
    let result = [];
    for (let pc of projectcompanies) {
      if (pc.softcompany && pc.project && pc.technology) {
        result.push(pc);
      }
    }
    return res.status(200).json({ projectcompanies: result });
  } catch (err) {
    return next(err);
  }
};

exports.listPCByProject = async (req, res, next) => {
  try {
    let projectcompanies = await ProjectCompany.find({
      project: req.params.project_id,
    })
      .populate({ path: "softcompany", select: "_id profile" })
      .populate({
        path: "project",
        populate: {
          path: "participant",
          select: "_id profile",
        },
      })
      .populate("technology");
    let result = [];
    for (let pc of projectcompanies) {
      if (pc.softcompany && pc.project && pc.technology) {
        result.push(pc);
      }
    }
    return res.status(200).json({ projectcompanies: result });
  } catch (err) {
    return next(err);
  }
};
