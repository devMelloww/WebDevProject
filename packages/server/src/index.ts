import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import mongoose from "mongoose";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/profiles').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const nodeModules = path.resolve(
  __dirname,
  "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));
app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/profiles", profiles);
app.use("/auth", auth);
app.use("/api/profiles", authenticateUser, profiles);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Optionally, use your own connect function if needed
//connect("blazing"); // Uncomment and modify if you have a custom connect function
