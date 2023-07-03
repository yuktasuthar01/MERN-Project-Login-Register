const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


async function connection() {
    try {
        await mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('DB Connected')
    } catch (err) {
        console.log('Error')
    }
}

connection()

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())




const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (user) {
        if (password === user.password) {
            return res.send({ message: "Login Successfull", user: user })
        } else {
            return res.send({ message: "Password didn't match" })
        }
    } else {
        return res.send({ message: "User not registered" ,data: user })
    }
})

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    const user = await User.findOne({ email: email })

    if (user) {
        return res.send({ message: "User already registered" })
    } else {
        const user = new User({
            name,
            email,
            password
        });
        await user.save()

        return res.send('Success')
    }
})



app.listen(9002, () => {
    console.log("BE started at port 9002")
})