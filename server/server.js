require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM typen");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        typen: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the typen data.",
    });
  }
});

app.get("/snr/:selectedCOP", async (req, res) => {
    const selectedCOP = req.params.selectedCOP;
  
    try {
      const query = "SELECT fnr,benennung_english, code, sachnummersnr FROM snr WHERE cop_typ_bezeichnung = $1";
      const values = [selectedCOP];
      const results = await db.query(query, values);
  
      res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
          snr: results.rows.map((row) => ({
            fnr: row.fnr,
            benennung_english: row.benennung_english,
            code: row.code,
            sachnummersnr: row.sachnummersnr
          })),
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while retrieving the snr data.",
      });
    }
  });
  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});


