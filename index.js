const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');

// Middlewares
let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(router);