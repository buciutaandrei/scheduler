const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const passport = require("passport");
const users = require("./api/users");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const dayjs = require("dayjs");
require("dayjs/locale/ro");
dayjs.locale("ro");
const path = require("path");

require("dotenv").config();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/api/users", users);
app.use(express.static(path.join(__dirname + "/client/build")));

MongoClient.connect(
  process.env.MONGODB_URI || "mongodb://localhost/proiect",
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db();

    db.on("error", error => console.error(error));
    db.once("open", () => console.log("connected to database"));

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });

    const connections = [];

    io.on("connection", socket => {
      console.log("user connected to socket ", socket.id);
      connections.push(socket);
      socket.on("disconnect", () => {
        console.log("disconnected");
      });

      socket.on("fetchItems", collection => {
        db.collection(collection)
          .find({})
          .toArray((err, result) => {
            io.sockets.emit("dataFetch", result);
          });
      });

      socket.on("loaded", () => {
        io.sockets.emit("loaded");
      });

      socket.on("fetchEditItems", collection => {
        db.collection(collection)
          .find({})
          .toArray((err, result) => {
            io.sockets.emit("dataFetchEdit", result);
          });
      });

      socket.on("addItems", input => {
        console.log(input);
        let date = dayjs(input.selectedDate)
          .startOf("week")
          .format("DDMMYYYY");
        db.collection(date)
          .insertOne(input)
          .then(data => io.sockets.emit("refresh", date));
      });

      socket.on("deleteItems", input => {
        let date = dayjs(input.selectedDate)
          .startOf("week")
          .format("DDMMYYYY");
        db.collection(date)
          .deleteOne({ index: input.id })
          .then(data => io.sockets.emit("refresh", date));
      });

      socket.on("fetchWeek", input => {
        let firstDate = dayjs(input, "week").startOf("week");
        for (i = 1; i < 6; i++) {
          let date = dayjs(firstDate)
            .add(i, "d")
            .format("DDMMYYYY");
          db.collection(date).find({}, (err, cursor) => {
            cursor.toArray((err, result) => {
              io.sockets.emit("weekData", result);
            });
          });
        }
      });
    });

    app.post("/logging", (req, res) => {});

    app.get("/database/:id", (req, res) => {
      db.collection(req.params.id)
        .find({})
        .toArray((err, result) => {
          res.json(result);
        });
    });

    app.post("/database/:id", (req, res) => {
      let date = req.params.id;
      db.collection(date)
        .insertOne(req.body)
        .then(data => res.send(data));
    });

    app.delete("/database/:id", (req, res) => {
      db.collection(req.params.id)
        .deleteOne({ index: req.body.id })
        .then(data => res.send(data));
    });

    let port = process.env.PORT || 3001;

    server.listen(port, () => {
      console.log("server started");
    });
  }
);
