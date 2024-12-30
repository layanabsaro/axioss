import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import axiosRetry from "axios-retry";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// إعداد مكتبة axios-retry لإعادة المحاولة
axiosRetry(axios, {
  retries: 3,  // عدد المحاولات لإعادة الاتصال
  retryDelay: axiosRetry.exponentialDelay,  // تأخير عشوائي بين المحاولات
  retryCondition: (error) => error.response.status === 429,  // إعادة المحاولة عند رمز الحالة 429 فقط
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://data.gov.il/api/3/action/datastore_search?resource_id=c8b9f9c8-4612-4068-934f-d4acd2e3c06e&limit=5");
    const result = response.data.result.records;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const vehicleNumber = req.body.vehicleNumber;
    
    const response = await axios.get(
      `https://data.gov.il/api/3/action/datastore_search?resource_id=c8b9f9c8-4612-4068-934f-d4acd2e3c06e&q=${vehicleNumber}`
    );
    const result = response.data.result.records;

    if (result.length > 0) {
      res.render("index.ejs", { data: result[0] });
    } else {
      res.render("index.ejs", { error: "No data found for this vehicle number" });
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "There was an error retrieving the data.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
