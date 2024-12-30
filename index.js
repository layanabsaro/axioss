import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    const vehicleNumber = req.body.vehicleNumber;

    const response = await axios.get(`https://data.gov.il/api/3/action/datastore_search?resource_id=56063a99-8a3e-4ff4-912e-5966c0279bad&q=${vehicleNumber}`);
    const result = response.data;

    if (result.result.records.length > 0) {
      res.render("index.ejs", { data: result.result.records[0] });
    } else {
      res.render("index.ejs", { error: "No data found for this vehicle number" });
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: "There was an error retrieving the data." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
