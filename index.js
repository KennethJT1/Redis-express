const express = require('express')
require("dotenv").config()


const app = express()

app.use(express.json());

const PORT  = process.env.PORT || 3434

app.listen(PORT, console.log(`Redisexpress  listening on port ${PORT}`));