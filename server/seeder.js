const seeder = require("mongoose-seed");

const db = require("./config/main").database;

seeder.connect(db, () => {
  seeder.loadModels(["./models/fielddata.js"]);
  seeder.clearModels(["FieldData"], () => {
    seeder.populateModels(data, (err, done) => {
      if (err) return console.log("seed err", err);
      if (done) return console.log("seed done", done);
      seeder.disconnect();
    });
  });
});

const data = [
  {
    model: "FieldData",
    documents: [
      { field: "org_type", value: "Law Firm" },
      { field: "org_type", value: "Corporation" },
      { field: "org_type", value: "Government" },
      { field: "org_type", value: "Non-Profit" },
      { field: "org_type", value: "University" },
      { field: "org_type", value: "Other" },
      { field: "user_role", value: "Attorney" },
      { field: "user_role", value: "Chief Executive" },
      { field: "user_role", value: "Sales and Marketing" },
      { field: "user_role", value: "Finance and Accounting" },
      { field: "user_role", value: "Operations" },
      { field: "user_role", value: "Research" },
      { field: "user_role", value: "Educator" },
      { field: "user_role", value: "Student" },
      { field: "user_role", value: "Software Developer" },
      { field: "user_role", value: "Designer" },
      { field: "user_role", value: "Other" },
      { field: "organization_category", value: "Firm" },
      { field: "project_category", value: "Social" },
      { field: "profile_category", value: "Advisor" },
      { field: "article_tag", value: "LearnHub" },
      { field: "article_tag", value: "HelpCenter" },
      { field: "article_tag", value: "Demos" },
      { field: "article_tag", value: "TechHub" },
      { field: "article_tag", value: "Application" },
      { field: "article_tag", value: "Faq" },
      { field: "sort", value: "A-Z" },
      { field: "sort", value: "Z-A" },
      { field: "sort", value: "Oldest-Newest" },
      { field: "sort", value: "Newest-Oldest" },
      { field: "org_column", value: "4" },
      { field: "proj_column", value: "4" },
      { field: "ptp_column", value: "4" },
      { field: "show_project", value: "true" },
      { field: "org_intro", value: "" },
      { field: "proj_intro", value: "" },
      { field: "ptp_intro", value: "" },
      { field: "dash_intro", value: "" },
    ],
  },
];
