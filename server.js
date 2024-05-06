// server.js
const express = require("express");
const cors = require("cors");
const compression = require('compression');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const budgetRoute = require("./Routes/budgetRoute");
const expenseRoute = require("./Routes/expenseRoute");
const userRoute = require("./Routes/userRoute");

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = "mongodb+srv://nsatti1:nsatti@nbadproject.rr1kmuh.mongodb.net/personalBudget?retryWrites=true&w=majority&appName=NbadProject";

app.use(cors({
    origin: 'http://167.71.242.234:8080',
    credentials: true
}))
app.options('*', cors());

// app.use('/', express.static("personal-budget"))
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/budget", budgetRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/user", userRoute);

app.use((req, res, next) => {
    res.status(400).send("Invalid Route");
})

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to Mongo-Database");
        app.listen(port, () => {
            console.log(`API served at Port ${port}`);
        });
    })
    .catch(error => {
        console.error("Error Connecting to Mongo-Database", error);
    });
