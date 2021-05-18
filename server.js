if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];
let userindex = 0;
const exams = [
  { subject: "Accounting and Finance", Date: "27/05/21" },
  { subject: "Ancient History", Date: "28/05/21" },
  { subject: "Biology", Date: "25/05/21" },
  { subject: "Chemistry", Date: "26/05/21" },
  { subject: "Chinese: Background Language", Date: "27/05/21" },
  { subject: "Chinese: Second Language", Date: "31/05/21" },
  { subject: "Computer Science", Date: "03/06/21" },
  { subject: "Design", Date: "26/05/21" },
  { subject: "Drama", Date: "01/06/21" },
  { subject: "Economics", Date: "01/06/21" },
  { subject: "Engineering Studies", Date: "27/05/21" },
  { subject: "English", Date: "25/05/21" },
  { subject: "Food Science and Technology", Date: "27/05/21" },
  { subject: "French: Second Language", Date: "31/05/21" },
  { subject: "Human Biology", Date: "03/06/21" },
  { subject: "Italian: Second Language", Date: "02/06/21" },
  { subject: "Japanese: Second Language", Date: "04/06/21" },
  { subject: "Literature", Date: "31/05/21" },
  { subject: "Mathematics: Applications", Date: "28/05/21" },
  { subject: "Mathematics: Methods", Date: "28/05/21" },
  { subject: "Mathematics: Specialist", Date: "03/06/21" },
  { subject: "Modern History", Date: "27/05/21" },
  { subject: "Music: Western Art Music", Date: "26/05/21" },
  { subject: "Philosophy and Ethics", Date: "28/05/21" },
  { subject: "Physical Education Studies", Date: "26/05/21" },
  { subject: "Physics", Date: "02/06/21" },
  { subject: "Politics and Law", Date: "04/06/21" },
  { subject: "Psychology", Date: "02/06/21" },
  { subject: "Visual Arts", Date: "28/05/21" },
];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("pages/register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      subjects: [],
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.get("/profile", checkAuthenticated, (req, res) => {
  let subjects = [];
  for (i = 0; i < users[userindex].subjects.length; i++) {
    subjects.push(users[userindex].subjects[i]);
  }
  res.render("pages/profile.ejs", { name: req.user.name, subjects: subjects });
});

app.post("/namechange", checkAuthenticated, (req, res) => {
  users[userindex].name = req.body.name;
  let subjects = [];
  for (i = 0; i < users[userindex].subjects.length; i++) {
    subjects.push(users[userindex].subjects[i]);
  }
  res.render("pages/profile.ejs", { name: req.user.name, subjects: subjects });
});

app.get("/exams", checkAuthenticated, (req, res) => {
  let dates = [];
  let subjects = [];
  for (i = 0; i < users[userindex].subjects.length; i++) {
    for (j = 0; j < exams.length; j++) {
      if (exams[j].subject === users[userindex].subjects[i]) {
        dates.push(exams[j].Date);
      }
    }
  }
  for (i = 0; i < users[userindex].subjects.length; i++) {
    subjects.push(users[userindex].subjects[i]);
  }
  let subdat = [];
  for (i = 0; i < subjects.length; i++) {
    subdat.push(subjects[i] + ": " + dates[i]);
  }
  res.render("pages/exams.ejs", { subjects: subdat });
});

app.get("/calendar", checkAuthenticated, (req, res) => {
  res.render("pages/calendar.ejs");
});

app.get("/subjects", checkAuthenticated, (req, res) => {
  res.render("pages/subject-selection.ejs");
});

app.post("/subject", checkAuthenticated, (req, res) => {
  if (
    req.body.s1 !== null &&
    users[userindex].subjects.includes(req.body.s1) == false
  ) {
    users[userindex].subjects.push(req.body.s1);
  }
  if (
    req.body.s2 !== null &&
    users[userindex].subjects.includes(req.body.s2) == false
  ) {
    users[userindex].subjects.push(req.body.s2);
  }
  if (
    req.body.s3 !== null &&
    users[userindex].subjects.includes(req.body.s3) == false
  ) {
    users[userindex].subjects.push(req.body.s3);
  }
  if (
    req.body.s4 !== null &&
    users[userindex].subjects.includes(req.body.s4) == false
  ) {
    users[userindex].subjects.push(req.body.s4);
  }
  if (
    req.body.s5 !== null &&
    users[userindex].subjects.includes(req.body.s5) == false
  ) {
    users[userindex].subjects.push(req.body.s5);
  }
  if (
    req.body.s6 !== null &&
    users[userindex].subjects.includes(req.body.s6) == false
  ) {
    users[userindex].subjects.push(req.body.s6);
  }
  if (
    req.body.s7 !== null &&
    users[userindex].subjects.includes(req.body.s7) == false
  ) {
    users[userindex].subjects.push(req.body.s7);
  }
  if (
    req.body.s8 !== null &&
    users[userindex].subjects.includes(req.body.s8) == false
  ) {
    users[userindex].subjects.push(req.body.s8);
  }
  if (
    req.body.s9 !== null &&
    users[userindex].subjects.includes(req.body.s9) == false
  ) {
    users[userindex].subjects.push(req.body.s9);
  }
  if (
    req.body.s10 !== null &&
    users[userindex].subjects.includes(req.body.s10) == false
  ) {
    users[userindex].subjects.push(req.body.s10);
  }
  if (
    req.body.s11 !== null &&
    users[userindex].subjects.includes(req.body.s11) == false
  ) {
    users[userindex].subjects.push(req.body.s11);
  }
  if (
    req.body.s12 !== null &&
    users[userindex].subjects.includes(req.body.s12) == false
  ) {
    users[userindex].subjects.push(req.body.s12);
  }
  if (
    req.body.s13 !== null &&
    users[userindex].subjects.includes(req.body.s13) == false
  ) {
    users[userindex].subjects.push(req.body.s13);
  }
  if (
    req.body.s14 !== null &&
    users[userindex].subjects.includes(req.body.s14) == false
  ) {
    users[userindex].subjects.push(req.body.s14);
  }
  if (
    req.body.s15 !== null &&
    users[userindex].subjects.includes(req.body.s15) == false
  ) {
    users[userindex].subjects.push(req.body.s15);
  }
  if (
    req.body.s16 !== null &&
    users[userindex].subjects.includes(req.body.s16) == false
  ) {
    users[userindex].subjects.push(req.body.s16);
  }
  if (
    req.body.s17 !== null &&
    users[userindex].subjects.includes(req.body.s17) == false
  ) {
    users[userindex].subjects.push(req.body.s17);
  }
  if (
    req.body.s18 !== null &&
    users[userindex].subjects.includes(req.body.s18) == false
  ) {
    users[userindex].subjects.push(req.body.s18);
  }
  if (
    req.body.s19 !== null &&
    users[userindex].subjects.includes(req.body.s19) == false
  ) {
    users[userindex].subjects.push(req.body.s19);
  }
  if (
    req.body.s20 !== null &&
    users[userindex].subjects.includes(req.body.s20) == false
  ) {
    users[userindex].subjects.push(req.body.s20);
  }
  if (
    req.body.s21 !== null &&
    users[userindex].subjects.includes(req.body.s21) == false
  ) {
    users[userindex].subjects.push(req.body.s21);
  }
  if (
    req.body.s22 !== null &&
    users[userindex].subjects.includes(req.body.s22) == false
  ) {
    users[userindex].subjects.push(req.body.s22);
  }
  if (
    req.body.s23 !== null &&
    users[userindex].subjects.includes(req.body.s23) == false
  ) {
    users[userindex].subjects.push(req.body.s23);
  }
  if (
    req.body.s24 !== null &&
    users[userindex].subjects.includes(req.body.s24) == false
  ) {
    users[userindex].subjects.push(req.body.s24);
  }
  if (
    req.body.s25 !== null &&
    users[userindex].subjects.includes(req.body.s25) == false
  ) {
    users[userindex].subjects.push(req.body.s25);
  }
  if (
    req.body.s26 !== null &&
    users[userindex].subjects.includes(req.body.s26) == false
  ) {
    users[userindex].subjects.push(req.body.s26);
  }
  if (
    req.body.s27 !== null &&
    users[userindex].subjects.includes(req.body.s27) == false
  ) {
    users[userindex].subjects.push(req.body.s27);
  }
  if (
    req.body.s28 !== null &&
    users[userindex].subjects.includes(req.body.s28) == false
  ) {
    users[userindex].subjects.push(req.body.s28);
  }
  if (
    req.body.s29 !== null &&
    users[userindex].subjects.includes(req.body.s29) == false
  ) {
    users[userindex].subjects.push(req.body.s29);
  }
  for (i = 0; i < users[userindex].subjects.length; i++) {
    if (users[userindex].subjects[i] == undefined) {
      users[userindex].subjects.splice(i, 1);
    }
  }
  let subjects = [];
  for (i = 0; i < users[userindex].subjects.length; i++) {
    subjects.push(users[userindex].subjects[i]);
  }
  res.render("pages/profile.ejs", { name: req.user.name, subjects: subjects });
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    for (i = 0; i < users.length; i++) {
      if (users[i].name === req.user.name) {
        userindex = i;
        break;
      }
    }
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return next();
}

app.listen(3000);
