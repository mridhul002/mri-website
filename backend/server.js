const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
const port = 5000


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }))
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs))
const dbURI = process.env.MONGODB_URI  

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.once('open', () => {
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
})

const Users = mongoose.model("data", userSchema)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/post', async (req, res) => {

    const {  name, email, message } = req.body

    const user = new Users({
        name,
        email,
        message
    })
    await user.save()
    console.log(user)
    res.send("Form Submission Successful" )
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})   