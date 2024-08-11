import { useEffect, useRef, useState } from 'react'
import Board from './Board'
import axios from 'axios'
import {useLocation,Link,Navigate,BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import EditBoard from './EditBoard'
import BoardSelect from './BoardSelect'
import ManageTask from './ManageTask'
import Header from './Header'
import Confirm from './Confim'


function App() {
  const [data, setData] = useState()
  const [addTask, setAddTask] = useState(false)

  useEffect(()=>{
    const getData = async() =>{
      try{
        const response = await axios.get('data.json')
        setData(response.data.boards)
      }
      catch(e){
        console.error(e);
      }
    }
    getData()
  },[])
  useEffect(() =>{
    setData(data)

  },[data])

  const [currBoard, setCurrBoard] = useState()

  const handleSubtaskClick = (currColumn, currTask, currSubtask) =>{
    const updatedData = data.map((board) =>{
      if (board.name == currBoard){
        return{
          ...board,
          columns: board.columns.map(column =>{
            if (column.name == currColumn){
              return{
                ...column,
                tasks: column.tasks.map(task =>{
                  if(task.title == currTask){
                    return{
                      ...task,
                      subtasks: task.subtasks.map(subtask => {
                        if(subtask.title == currSubtask){
                          return{
                            ...subtask,
                            isCompleted: !subtask.isCompleted
                          }
                        }
                        return subtask
                      })
                    }
                  }
                  return task
                })
              }
            }
            return column
          })
        }
      }
      return board
    })
    setData(updatedData)
  }

  const handleChangeStatus = (newStatus, currStatus, selectTask) =>{   
    const updatedData = data.map((board) =>{
      if (board.name == currBoard){
        return{
          ...board,
          columns: board.columns.map((column)=>{
            if(column.name == currStatus){
              return{
                ...column,
                tasks: column.tasks.filter(task => task != selectTask)
              }
            }
            if(column.name == newStatus){
              return{
                ...column,
                tasks: [...column.tasks, selectTask]
              }
            }
            return column
          })
        }
      }
      return board
    })
    setData(updatedData)
  }


  const handleAddTask = (currColumn, newTask) =>{
    const updatedData = data.map((board)=>{
      if(board.name === currBoard){
        return{
          ...board,
          columns: board.columns.map((column) =>{
            if(column.name === currColumn){
              return{
                ...column,
                tasks: [...column.tasks, newTask]
              }
            }
            return column
          })
        }
      }
      return board
    })
    setData(updatedData)
  }
  
  const handleDelete = (currColumn, currTask) =>{
    const updatedData = data.map((board)=>{
      if(board.name === currBoard){
        return{
        ...board,
        columns: board.columns.map((column) =>{
          if(column.name === currColumn){
            return{
              ...column,
              tasks: column.tasks.filter(task => task !== currTask)
            }
          }
          return column
        })
        }
      }
      return board
    })
    setData(updatedData)
  }
  const handleEdit = (currColumn, newTask, currTask) =>{
    console.log(currTask);
    const updatedData = data.map((board) =>{
      if(board.name === currBoard){
        return{
          ...board,
          columns: board.columns.map((column)=>{
            if(column.name === currColumn){
              return{
                ...column,
                tasks: column.tasks.map((task) =>{
                  if(task.title === currTask.title){
                    return newTask
                    
                  }
                  return task
                })
              }
            }
            return column
          })
        }
      }
      return board
    })
    setData(updatedData)
  }

  const [statues, setStatues] = useState()
  useEffect(() =>{    
    const getStatues = () =>{
      const statusList = []
      if(data){
        data.map(board =>{
          if(board.name === currBoard){
            board.columns.forEach((column) =>{
              statusList.push(column)
            })
          }
        })
      }
      
      setStatues(statusList) 
    }
    getStatues()     
  },[data, currBoard])

  const addBoard = (newBoard) =>{
    setData([...data, newBoard])   
  }

  const navigateBoard = ()=>{
    console.log(data[0]);
    console.log(data);
    
  }
 
  const [editBoard, setEditBoard] = useState(false)
  const [selectBoard, setSelectBoard] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [type, setType] = useState()
  const [deleteBoard, setDeleteBoard] = useState(false)

  useEffect(() =>{
    if(darkMode){
      document.body.classList.add('darkBg')
    }
    else{
      document.body.classList.remove('darkBg')
    }
  },[darkMode])


  return (
    <Router>
    <div className='mainApp'>
      <Header setSelectBoard={setSelectBoard} 
              setEditBoard={setEditBoard} 
              setAddTask={setAddTask}
              setDarkMode={setDarkMode}
              currBoard={currBoard}
              selectBoard={selectBoard}
              setCurrBoard={setCurrBoard}
              setType={setType}
              setDeleteBoard={setDeleteBoard}
              darkMode={darkMode}/>
      <main>
          <section className='boards'>
        <Routes>
          <Route exact path='/' element={<Navigate replace to={`/${currBoard}`}/>}/>
        {data && data.map((board) =>(
          <Route key={board.name} path={`/${board.name}`} 
            element={
            <Board data={board} 
            handleSubtaskClick={handleSubtaskClick} 
            handleChangeStatus={handleChangeStatus}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            statues = {statues}
            darkMode={darkMode}/>}/>
            
              
        ))}
        </Routes>
        </section>
        
      </main>
      {editBoard && <EditBoard statues={statues} 
                    setData={setData} currBoard={currBoard}
                    addBoard={addBoard}
                    setEditBoard={setEditBoard}
                    type={type}
                    />}
      {selectBoard && <BoardSelect data={data} 
                        setCurrBoard={setCurrBoard}
                        currBoard={currBoard}
                        setDarkMode={setDarkMode} 
                        setSelectBoard={setSelectBoard}
                        setEditBoard={setEditBoard}
                        setType={setType}
                        darkMode={darkMode}/>}
      {addTask && statues && <ManageTask type='add' statues={statues} 
      setTask={setAddTask} handleAddTask={handleAddTask} darkMode={darkMode}/>}
      {deleteBoard && <Confirm type={'board'} 
                      currBoard={currBoard} data={data} setData={setData} 
                      setConfirm={setDeleteBoard} navigate={navigateBoard}/>}
    </div>
    </Router>
  )
}

export default App
