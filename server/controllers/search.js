const Challenge = require("../models/challenge");
const Organization = require("../models/organization");
const Project = require("../models/project");
const Participant = require("../models/user");
const setPublicUsers = require("../helpers").setPublicUsers;

//= =======================================
// Search Controller
//= =======================================
exports.totalSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    const challenges = await Challenge.find({
      challenge_name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const projects = await Project.find({
      name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const organizations = await Organization.find({
      org_name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const participants = await Participant.find({
      "profile.first_name": { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    res.status(201).json({
      challenges,
      projects,
      organizations,
      participants: setPublicUsers(participants),
    });
  } catch (err) {
    return next(err);
  }
};
