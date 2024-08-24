import { useEffect, useRef, useState } from 'react'
import Board from './Board'
import axios from 'axios'
import {useLocation,Link,Navigate,BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import EditBoard from './EditBoard'
import BoardSelect from './BoardSelect'
import ManageTask from './ManageTask'
import Header from './Header'
import Confirm from './Confim'
import openSide from '/assets/icon-show-sidebar.svg'

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

  /* List of all Function where it mapped Json to change the value */
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

  /* get all column or status on currBoard */
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

  /* Update the width when window resizing */
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() =>{
    const handleWidth = () =>{
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleWidth)
    return()=>{
      window.removeEventListener('resize',handleWidth)
    }
  },[])
  

  /*Function For Drag Scrolling*/
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const scrollLeft = useRef(0)
  const scrollTop = useRef(0)


  /*Run When mouse is Clicked,
  Start x and y is to know location of the cursor where
  pageX/Y is where it located in the screen minus where container is located
  
  scroll is to know how far the container been scrolled X/Y axis*/
  const handleMouseDown = (e) =>{
    isDragging.current = true
    startX.current = e.pageX - containerRef.current.offsetLeft
    startY.current = e.pageY - containerRef.current.offsetTop
    scrollLeft.current = containerRef.current.scrollLeft
    scrollTop.current = containerRef.current.scrollTop
    containerRef.current.style.cursor = 'grabbing'
    console.log(startX);
    
  }
  const handleMouseUp = () =>{
    isDragging.current = false

  }
  const handleMouseLeave = () =>{
    isDragging.current = false

  }
  const handleMouseMove = (e) =>{
    if(!isDragging.current) return

    const x = e.pageX - containerRef.current.offsetLeft
    const y = e.pageY - containerRef.current.offsetTop
    const walkX = x - startX.current
    const walkY = y - startY.current

    containerRef.current.scrollLeft = scrollLeft.current - walkX
    containerRef.current.scrollTop = scrollTop.current - walkY
  }

  return (
    <Router>
    {/* sidebar or boardSelect located here because >768 px layout */}
    <div className="sidebarAndMain">     
    {selectBoard && <BoardSelect data={data} 
                        setCurrBoard={setCurrBoard}
                        currBoard={currBoard}
                        setDarkMode={setDarkMode} 
                        setSelectBoard={setSelectBoard}
                        setEditBoard={setEditBoard}
                        setType={setType}
                        darkMode={darkMode}
                        width={width >= 768}
                        />}

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
              darkMode={darkMode}
              width={width}/>
              
      
      <main ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} 
      onMouseMove={handleMouseMove}>
          <section className='boards'>
        <Routes>

          <Route exact path='/' element={<Navigate replace to={`/${currBoard}`}/>}/>

        {/* mapped data so each board get the path based on their name */}
        {data && data.map((board) =>(
          <Route key={board.name} path={`/${board.name}`} 
            element={
            <Board data={board} 
            handleSubtaskClick={handleSubtaskClick} 
            handleChangeStatus={handleChangeStatus}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            statues = {statues}
            darkMode={darkMode}
            width={width}
            setEditBoard={setEditBoard}
            setType={setType}/>}/>
            
              
        ))}
        </Routes>
        </section>
        {selectBoard || width < 768 ? '':
        <div className='openSidebar pointer' onClick={() => setSelectBoard(true)}>
          <img src={openSide} alt="" />
        </div>}
      </main>
      </div>

      {/*Bunch of click popup, should be okay to put it anywhere */}
      {editBoard && <EditBoard statues={statues} 
                    setData={setData} currBoard={currBoard}
                    addBoard={addBoard}
                    setEditBoard={setEditBoard}
                    type={type}
                    darkMode={darkMode}
                    />}
      
      {addTask && statues && <ManageTask type='add' statues={statues} 
      setTask={setAddTask} handleAddTask={handleAddTask} darkMode={darkMode}/>}
      {deleteBoard && <Confirm type={'board'} 
                      currBoard={currBoard} data={data} setData={setData} 
                      setConfirm={setDeleteBoard}
                      darkMode={darkMode}/>}
    </div>
    </Router>
  )
}

export default App
