require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const publicPath = path.join(__dirname, "public", "employee-client", "build")

app.use(require("cors")({origin: "*"})); //google "CORS"
app.use(express.json());
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

app.get("/*", (req, res) => res.sendFile(publicPath + "/index.html"));

// const server = require("http").createServer(app);

// -- https Server --//
const fs = require("fs");
const privateKey = fs.readFileSync("./cert/cookassistant.tk.key");
const certificate = fs.readFileSync("./cert/cookassistant.tk.pem");
const credentials = { key: privateKey, cert: certificate };
const server = require("https").createServer(credentials, app);

server.listen(process.env.PORT || 8002, () =>
  console.log(`Server is running on https://localhost:${process.env.PORT}.`)
);
