import { useEffect, useRef, useState } from "react"
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import chevronUp from '/assets/icon-chevron-up.svg'
import Confirm from "./Confim"
import ManageTask from "./ManageTask"

function Board(props){
    const {data, handleSubtaskClick, handleChangeStatus, 
        statues, handleDelete, handleEdit, 
        darkMode, width, setEditBoard, setType} = props
    const [taskClicked, setTaskClicked] = useState(false)
    const taskDetails= useRef(null)
    const [currentTask, setCurrentTask] = useState()

    const openTask = (task) =>{
        setTaskClicked(true)
        setCurrentTask(task.title)
    }

    useEffect(() =>{
        const handleClick = (event) =>{
            if(taskDetails.current && taskDetails.current == event.target){
                setTaskClicked(false)
            }
            if(ellipsisRef.current && !ellipsisRef.current.contains(event.target)){
                setEllipsisClicked(false)
            }
        }
        window.addEventListener('click', handleClick)
        return()=>{
            window.removeEventListener('click', handleClick)
        }
    },[])
    
    
    const [statusClick, setStatusClick] = useState(false)
    
    const [deleteTask, setDeleteTask] = useState(false)

    const [ellipsisClicked, setEllipsisClicked] = useState(false)
    
    const ellipsisRef = useRef(null)

    const [editTask, setEditTask] = useState(false)

    const handleAddNewColumn = () =>{
        setEditBoard(true)
        setType('edit')
    }

    
    return(
    <>
    <ul className="statusList" style={{width: data.columns.length === 0 && '100%'}}>
            {data.columns.length > 0 ? data.columns.map((column) =>(
                <li className={`status ${darkMode ? 'darkStatus' : ''}`}>
                    <h2>{column.name} ({column.tasks.length})</h2>
                    <ul className="tasks">
                        {column.tasks.map((task) =>(
                            <li className={`task ${darkMode ? 'dark' : ''}`} onClick={() => openTask(task, column.name)}>
                                <h3 className="title">
                                    {task.title}
                                </h3>
                                <h4 className="subtasksNum">
                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length} subtasks
                                </h4>
                                {taskClicked && task.title == currentTask ? 
                                    <div className="taskBackground" ref={taskDetails}>
                                        <div className={`taskDetails ${darkMode ? 'dark' : ''}`} >


                                            <div className="taskTitle">
                                                <h3 className="title">{task.title}</h3>
                                                <div className="taskSetting" ref={ellipsisRef}>
                                                    <img src={ellipsis} alt="" onClick={() => setEllipsisClicked(prevState => !prevState)}  />
                                                    {ellipsisClicked && <div className="settingSelect">
                                                        <p onClick={() => setEditTask(true)}>Edit</p>
                                                        <p onClick={() => setDeleteTask(true)} className="red">Delete</p>
                                                    </div>}
                                                    
                                                </div>
                                            </div>

                                            {editTask && <ManageTask type='edit' statues={statues} 
                                                            setTask={setEditTask} data={task} status={column.name}
                                                            handleEdit={handleEdit} darkMode={darkMode}/>}
                                        
                                            {deleteTask && <Confirm darkMode={darkMode} data={task} column={column.name} handleDelete={handleDelete} setTask={setTaskClicked}
                                            setConfirm={setDeleteTask}/>}

                                            {task.description && <p className="taskDescription">
                                                {task.description}
                                            </p>}


                                            {task.subtasks.length > 0 && <div className="taskSubtasks">
                                                <h4 className="subtasksNum">
                                                    Subtasks (
                                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length}
                                                    )
                                                </h4>


                                                <ul className="subtasks">
                                                    {task.subtasks.map((subtask) => (
                                                        <label className={`subtask ${darkMode ? 'darkCheckBox' : ''}`}>
                                                            <input type="checkbox"
                                                            checked={subtask.isCompleted}
                                                            onChange={() => handleSubtaskClick(column.name, task.title, subtask.title)} />
                                                            <h4 className={subtask.isCompleted ? 'complete' : ''}>{subtask.title}</h4>
                                                        </label>
                                                    ))}
                                                </ul>
                                            </div>}
                                            <div className="taskCurrStatus">
                                                <p>Current Status</p>
                                                <ul className={`statusTask ${statusClick ? 'statusSelect' : ''}`}>
                                                    <div onClick={() => setStatusClick(prevState => !prevState)} className="statusClick">
                                                        <li >{column.name}</li>
                                                        <img src={statusClick ? chevronUp : chevronDown} alt="" className="chevron"/>
                                                    </div>
                                                    {statues.map((status) =>{
                                                        if(status.name != column.name){
                                                            return <li className="otherStatus" onClick={() => handleChangeStatus(status.name, column.name, task)}>{status.name}</li>
                                                        }
                                                    })}
                                                </ul>
                                                
                                            </div>
                                        </div>
                                    </div> : 
                                    ''}
                            </li>
                        ))}
                    </ul>
                </li>
            )) :
            <div className="noColumnContainer">
                <div className="noColumn">
                    <p>This board is empty, create new column to get started.</p>
                    <button className="addTask addTaskWidth" onClick={handleAddNewColumn}>+Add New Column</button>
                </div>
            </div>}
           {data.columns && width >= 1440 ? 
            <div className="addNewColumn pointer" onClick={handleAddNewColumn}>
                <p>+ New Column</p>
           </div> : ''}
           
        
    </ul>
    
    </>
    )
}
export default Board