const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const db = require("./models");

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: isProduction ? ["http://13.50.137.242:3000"] : ["http://localhost:5173"], // Use prod IP or localhost
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
