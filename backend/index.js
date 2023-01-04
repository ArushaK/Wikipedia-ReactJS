import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "users",
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/searchForLastDay", (req, res) => {
  const q =
    "SELECT * FROM SearchInfo where Date(time) = DATE(NOW()) - INTERVAL 0 DAY";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/searchForLastHour", (req, res) => {
  const q =
    "SELECT * FROM SearchInfo where Date(time) = DATE(NOW()) - INTERVAL 0 HOUR";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/search", (req, res) => {
  const searchText = req.body.searchText;
  const time = req.body.time;

  db.query(
    "INSERT INTO SearchInfo (searchText, time) VALUES (?,?)",
    [searchText, time],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
