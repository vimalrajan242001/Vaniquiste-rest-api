const express = require('express')
const connectDB = require('./db/db')
const env = require("dotenv");


const app = express()
const port = process.env.PORT || 4000

env.config();

//init middleware
app.use(express.json({extended:false}))

//db connection method
connectDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
//defining routes
app.use("/api/users",require('./routes/api/users'))
app.use("/api/auth",require('./routes/api/auth'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})