const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');
const PORT = 5000;

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

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});