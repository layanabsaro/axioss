import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://data.gov.il/api/3/action/datastore_search?resource_id=56063a99-8a3e-4ff4-912e-5966c0279bad&limit=5");
    const result = response.data.result.records; 
    console.log(result); 
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "There was an error retrieving the data.",
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const type = req.body.type;
    const participants = req.body.participants;
    
    const response = await axios.get(
      `https://data.gov.il/api/3/action/datastore_search?resource_id=56063a99-8a3e-4ff4-912e-5966c0279bad&q=${type}&limit=${participants}`
    );
    const result = response.data.result.records;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: "No activities that match your criteria." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
