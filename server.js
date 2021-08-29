//libs
const express = require("express");
const app = express();
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const cookieSession = require("cookie-session");
//vars
const SERVER_PORT = 8080;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // User.findById(id, function(err, user) {
    done(null, user);
  // });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "...client__id",
      clientSecret: "...client__secret",
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(null, profile);
      // });
    }
  )
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "passport-google-auth",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/test", (req, res) => {
  res.status(200).send("SUCCESSFULLY CONNECTED TO BACKEND");
});
app.get("/", (req, res) => {
  res.send("THIS IS THE HOME PAGE!");
});
app.get("/fail", (req, res) => {
  res.send("GITHUB AUTH FAILED");
});
app.get("/success", (req, res) => {
  console.log(req.user);
  res.send(`GITHUB AUTH SUCCESS`);
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/fail" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

app.listen(SERVER_PORT, () => {
  console.log(`SUCCESSFULLY STARTED SERVER ON PORT ${SERVER_PORT}`);
});
