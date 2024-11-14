import { useContext, useEffect, useState } from "react"
import { kanbanContext } from "../context/KanbanContext"
import { json, useNavigate } from "react-router-dom"

function Confirm(props){
    const {column, data,  setTask, setConfirm, type} = props
    const {state, dispatch} = useContext(kanbanContext)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate()
    const [deleteName, setDeleteName] = useState('')
    if(type != 'board'){
        setDeleteName(data.name)
    }
    const deleteTask = async() =>{
        const fetchUrl = async(url) =>{
            setIsLoading(true)
            setIsSuccess(false)
            try{                
                const response = await fetch(url,
                    {credentials:"include",
                        method:'DELETE'
                    }
                )
                if(response.ok){                    
                    setIsLoading(false)
                    setIsSuccess(true)
                    return true
                }
                else{
                    throw new Error(response)
                }
            }catch{
                try{
                    const refresh = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                        {credentials:'include'}
                    )
                    if(refresh.ok){
                        console.log('sec try');
                        
                        const response = await fetch(url,
                            {credentials:"include",
                                method:"DELETE"
                            }
                        )
                        if (response.ok){
                            setIsSuccess(true)             
                            setIsLoading(false)
                            return true
                        }
                        else{
                            throw new Error(response)
                        }
                    }
                    else{
                        throw new Error('Failed to refresh token')
                    }

                }catch(error){
                    console.log(error);
                    setError(error);
                }
            }
            return false
        }
        if(type != 'board'){
            const taskUrl =`https://kanban-task-management-web-app-86h6.onrender.com/task/${data._id}`
            const response =await fetchUrl(taskUrl)
            if(response){
                dispatch({type:'DEL_TASK', payload:{currColumn:column, delTask:deleteName}})
                setTask(false)
            }
        }
        else{
            console.log(state.currBoard);
            
            const boardUrl = `https://kanban-task-management-web-app-86h6.onrender.com/board/${state.currBoard._id}`
            const response = await fetchUrl(boardUrl)
            if(response){
                navigate('/dashboard')
                dispatch({type:'DEL_BOARD', payload:state.currBoard.name})
            }
        }   
        setConfirm(false)
    }
    return(
        <div className="taskBackground">
            <div className={`confirmation taskDetails ${state.darkMode && 'dark'}`}>
                <h4>Delete this task?</h4>
                <p>Are you sure want to delete the 
                    '<span className="bold">{type === 'board' ? state.currBoard.name : data.title}</span>' 
                    {type === 'board' ? 
                    'board ? This action will remove all columns and tasks and cannot be reversed' 
                    :"task and its subtasks? This action cannot be reversed"}</p>
                <div className="buttonChoice">
                    <button className="confirm" onClick={deleteTask}>Delete</button>
                    <button className="cancel" onClick={() => setConfirm(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )

}
export default Confirm