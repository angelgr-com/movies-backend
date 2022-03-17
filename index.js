const PORT = 5000;
const express = require('express');
const cors = require('cors');
const router = require('./router');

// Middlewares
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
const app = express();
// express.json() parses incoming JSON requests and 
// puts the parsed data in req.body
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`)
});