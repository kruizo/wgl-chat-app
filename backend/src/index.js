const express = require("express");
const cors = require("cors");
const apiRoutes = require("./api");
const requestLogger = require("./logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Express API running on port ${PORT}`);
});
