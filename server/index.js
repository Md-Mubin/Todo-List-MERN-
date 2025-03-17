require('dotenv').config()

const express = require("express")
const app = express()
const cors = require("cors")
const { Server } = require("socket.io")
const dbConnect = require("./config/dbConnect")
const todoSchema = require("./modals/todoSchema")

app.use(express.json())
app.use(cors({
    origin : "https://todo-list-mern-plum.vercel.app",
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

dbConnect()

const PORT = 8000 || process.env.PORT

const server = app.listen(PORT, () => {
    console.log("Port Executed")
})

const io = new Server(server, {
    cors: "*"
})

// ============ Socket connect start
io.on("connection", async (socket) => {

    // sending datas from database to client
    const datas_DB = await todoSchema.find()
    socket.emit("allDatas", datas_DB)

    // adding task from client
    socket.on("taskAdd_client", async (data) => {

        if (!data) { // if the data is empty
            return socket.emit("err_msg", "Must Input Something")
        }

        const newTask = new todoSchema({ // creating new task in database
            ToDo: data
        })

        await newTask.save()

        // after adding new task sending updated datas
        const updatedData = await todoSchema.find()
        socket.emit("allDatas", updatedData)
    })

    // deleting datas from database
    socket.on("deleteTask_client", async (data) => {
        await todoSchema.findByIdAndDelete(data)

        // after deleting task sending updated datas
        const updatedData = await todoSchema.find()
        socket.emit("allDatas", updatedData)
    })

    // saving edited data in database
    socket.on("saveEdit_client", async (data) => {

        if (!data) { // if the data is empty
            return socket.emit("err_msg", "Must Input Something")
        }

        await todoSchema.findByIdAndUpdate(data._id, { ToDo: data.ToDo })
        
        // after editing and save task sending updated datas
        const updatedData = await todoSchema.find()
        socket.emit("allDatas", updatedData)
    })
})