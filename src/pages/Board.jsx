import { useContext, useEffect, useRef, useState } from "react"
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import chevronUp from '/assets/icon-chevron-up.svg'
import Confirm from "../component/Confim"
import ManageTask from "../component/ManageTask"
import { kanbanContext } from "../context/KanbanContext"
import usePostFetch from "../Hooks/usePostFetch"

function Board(props){
    const {data, handleChangeStatus, 
        statues,  width, setEditBoard, setType} = props
    const [taskClicked, setTaskClicked] = useState(false)
    const taskDetails= useRef(null)
    const [currentTask, setCurrentTask] = useState()
    const {state, dispatch} = useContext(kanbanContext)
    const [currentStatus, setCurrentStatus] = useState('')

    const openTask = (task, column) =>{
        setTaskClicked(true)
        setCurrentTask(task.title)
        setCurrentStatus(column)
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


    /* activate editBoard component */
    const handleAddNewColumn = () =>{
        setEditBoard(true)
        setType('edit')
    }


    const [change, setChange] = useState('')
    const [payload, setPayload] = useState({})
    //change subtask and/or status
    const {fetchingUrl, isSuccess, fetchResult} = usePostFetch()
    const changeSubtask = async(id, currColumn, currTask) =>{
        setPayload({currColumn: currColumn, currTask:currTask, currSubtask:fetchResult})
        setChange('CHANGE_SUBTASK')
        await fetchingUrl(`task/changeSubtask/${id}`,
        {},
        'PATCH'
        )
    }
    const changeStatus = async(task, newCol, currColumn) =>{
        setPayload({currColumn: currColumn, currTask: task, newCol: newCol.name})
        setChange('CHANGE_STATUS')
        const body = {
            newCol: newCol._id
        }
        await fetchingUrl(`task/changeStatus/${task._id}`,
            body,
            'PATCH'
        )
    }
    useEffect(() =>{    
        if(isSuccess){
            console.log('success here');
            dispatch({type:change, payload: {...payload, currSubtask: fetchResult}})
        }
    },[fetchResult])

    return(
    <>
    <ul className="statusList" style={{width: data.columns.length === 0 && '100%'}}>
            {data.columns.length > 0 ? data.columns.map((column) =>(
                <li className={`status ${state.darkMode && 'darkStatus'}`}>
                    <h2>{column.name} ({column.tasks.length})</h2>
                    <ul className="tasks">
                        {column.tasks.map((task) =>(
                            <li className={`task ${state.darkMode && 'dark'}`} onClick={() => openTask(task, column.name)}>
                                <h3 className="title">
                                    {task.title}
                                </h3>
                                {task.subtasks && 
                                <h4 className="subtasksNum">
                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length} subtasks
                                </h4>}
                                
                                {taskClicked && task.title == currentTask ? 
                                    <div className="taskBackground" ref={taskDetails}>
                                        <div className={`taskDetails ${state.darkMode && 'dark'}`} >
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
                                                            setTask={setEditTask} data={task} status={column}/>}
                                        
                                            {deleteTask && <Confirm data={task} column={column.name} setTask={setTaskClicked} 
                                            setConfirm={setDeleteTask}/>}

                                            {task.description && <p className="taskDescription">
                                                {task.description}
                                            </p>}


                                            {task.subtasks && task.subtasks.length > 0 && <div className="taskSubtasks">
                                                <h4 className="subtasksNum">
                                                    Subtasks (
                                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length}
                                                    )
                                                </h4>
                                                <ul className="subtasks">
                                                    {task.subtasks.map((subtask) => (
                                                        <label className={`subtask ${state.darkMode ? 'darkCheckBox' : ''}`}>
                                                            <input type="checkbox"
                                                            checked={subtask.isCompleted}
                                                            onClick={() => changeSubtask(subtask._id, column.name, task.title)} />
                                                            <h4 className={subtask.isCompleted && 'complete'}>{subtask.title}</h4>
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
                                                    {state.currBoard.columns.map((status) =>{
                                                        if(status.name != column.name){
                                                            return <li className="otherStatus" onClick={() => changeStatus(task, status, column.name)}>{status.name}</li>
                                                        }
                                                    })}
                                                </ul>
                                                
                                            </div>
                                        </div>
                                    </div> 
                                    : 
                                    ''
                                }
                            </li>
                        ))}
                    </ul>
                </li>
            )) :
            <div className="noColumnContainer">
                <div className={`noColumn ${state.darkMode && 'darkStatus'}`} >
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