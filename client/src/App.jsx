import { useEffect, useState } from "react"
import io from "socket.io-client"
const socket = io.connect("https://todo-server-avyvv9qhb-md-irfan-rahman-mubins-projects.vercel.app")

function App() {

  // all hooks
  const [taskAdd, setTaskAdd] = useState("")
  const [allTask, setAllTask] = useState([])
  const [editTask, setEditTask] = useState("")
  const [error, setError] = useState("")

  // useEffect
  useEffect(() => {

    socket.on("allDatas", (data) => {
      setAllTask(data)
    })

    // error msg from server
    socket.on("err_msg", (err_msg) => {
      setError(err_msg)
    })

  }, [])

  // task adding part
  const taskAddHandler = () => {
    socket.emit("taskAdd_client", taskAdd),
      setTaskAdd("")
  }

  // task deleting part
  const taskDeleteHandler = (deleteTskId) => {
    socket.emit("deleteTask_client", deleteTskId)
  }

  // task editing part
  const taskEditHandler = (editTaskData) => {
    setEditTask(editTaskData)
  }

  // task save after editing
  const saveEditedTask = (saveEditedTask) => {

    socket.emit("saveEdit_client", saveEditedTask)
    setEditTask("")
  }

  // Enter key part
  const enterKey = (e) => {
    if (e.key === "Enter") {
      taskAddHandler()
    }
  }

  return (
    <>
      {/* ============ Adding Task Part ============ */}
      <section className="pt-[100px]">
        <div className="container">
          <ul className="addTask">
            <p className="absolute text-red-300 top-[-25px] right-[40%]">
              {error}
            </p>
            
            <input
              value={taskAdd}
              onKeyDown={(e) => enterKey(e)}
              onChange={(e) => (setTaskAdd(e.target.value), setError(""))}
              type="text" />

            <button onClick={taskAddHandler}>Add</button>

          </ul>
        </div>
      </section>

      {/* ============= All Task Part ============= */}
      <section className="mt-[50px]">
        <div className="container">
          {
            allTask.map((items) => (
              <ul key={items._id} className="flex justify-center items-center gap-[20px] mt-[15px]">

                <input
                  className="allTasks"
                  onChange={editTask._id == items._id ? (e) => setEditTask({ ...editTask, ToDo: e.target.value }) : () => { }}
                  value={editTask._id == items._id ? editTask.ToDo : items.ToDo} />

                <button onClick={editTask._id == items._id ? () => saveEditedTask(editTask) : () => taskEditHandler(items)} className="edit_button">
                  {
                    editTask._id == items._id ? "Update" : "Edit"
                  }
                </button>

                <button
                  onClick={() => taskDeleteHandler(items._id)} className="delete_btn">
                  Delete
                </button>
              </ul>
            ))
          }
        </div>
      </section>
    </>
  )
}

export default App
