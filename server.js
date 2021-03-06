const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://leeduan:mTbc2Ln5Gcap8eRJ@cluster0.cvzmt.mongodb.net/Cluster0?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error(error));
    });

    app.use(bodyParser.json());
    app.use(express.static("public"));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.set("view engine", "ejs");

    app.listen(3000, function () {
      console.log("listening on 3000");
    });
    app.get("/", (req, res) => {
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        });
      console.log(cursor);
      //res.sendFile(__dirname + "/index.html");
    });
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

console.log("May Node be with you");
