import { useContext, useEffect, useRef, useState } from "react"
import cross from '/assets/icon-cross.svg'
import { useNavigate } from "react-router-dom"
import { kanbanContext } from "./context/KanbanContext"


function EditBoard(props){
    const {statues,  addBoard, setEditBoard, type} = props
    const {state, dispatch} = useContext(kanbanContext)
    const [boardName, setBoardName] = useState('')
    const [boardColumn, setBoardColumn] = useState([
        {name: '', tasks: []}
    ])


    useEffect(() =>{
        if(type === 'edit'){
            setBoardName(state.currBoard)
            setBoardColumn(statues)
        }
    },[type])

    const handleName = (colId, newName) =>{
        setBoardColumn(prevState =>
        prevState.map((column)=>(
            column.id === colId ? {...column, name:newName} : column
        )))
    }

    /* only delete based on id or name */
    const handleDelete = (id, name) => {
        setBoardColumn(prevState => prevState.filter(col => 'id' in col ? col.id !== id : col.name !== name))
    }

    const [error, setError] = useState(false)
    const [subError, setSubError] = useState(false)
    
    const navigate = useNavigate()


    /* check newest/latest column input if it's empty */
    const checkEmpty=() =>{
        if(boardColumn.length > 0 && boardColumn[boardColumn.length -1].name === ''){
            return true
        }
        return false
    }

    //function to check if the title and latest column input is not empty
    const errorCheck = () =>{
        if(boardName && !checkEmpty()){
            return false
        }
        else{
            console.log('check here');
            
            if(boardName === ''){
                setError(true)
            }
            if(checkEmpty()){
                setSubError(true)
            }
            return true
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        const newBoard ={
            name: boardName, 
            columns: boardColumn
        }
        //only submit if no error
        if(!errorCheck()){
            dispatch({type: type === 'edit' ? "EDIT_BOARD" : 'ADD_BOARD', action:{newBoard: newBoard}})
            navigate(`/${boardName}`)
            setEditBoard(false)
        }
    }

    const taskBg = useRef(null)
    useEffect(() =>{
        const handleClick = (e) =>{
            if(taskBg.current && e.target === taskBg.current){
                setEditBoard(false)
            }
        }
        window.addEventListener('click', handleClick)
        return()=>{
            window.removeEventListener('click', handleClick)
        }
    },[])


    //function to add new column input
    const handleAddColumn = () =>{
        if(!checkEmpty()){
            const newColumn = {name:'', id:Math.floor(Math.random() * 999999), tasks:[]}
            setBoardColumn([...boardColumn, newColumn])
        }
    }

    return(
            <div className='taskBackground' ref={taskBg}>
              <div className={`taskDetails ${state.darkMode && 'dark'}`}>
                <h4>Edit Board</h4>
                <form action="" className="addForm" onSubmit={(e) => handleSubmit(e)}>
                  <div className="inputContainer">
                    <label htmlFor="boardName">Board Name</label>
                    <input autoComplete="off" placeholder={error ? 'please enter Board name':"e.g Web design"} 
                    className={error && 'error'} onClick={() =>setError(false)}
                    type="text" name='boardName' value={boardName} onChange={(e) => setBoardName(e.currentTarget.value)}/>
                  </div>

                  <div className="inputContainer">
                    <label htmlFor="boardColumns">Board Columns</label>
                    <ul className="subtaskInputContainer">
                      {boardColumn && boardColumn.map((status)=>(
                        <li className="subtaskInput">
                            <input type="text" value={status.name} 
                            onChange={(e) => handleName(status.id, e.currentTarget.value)}
                            className={subError && 'error'} placeholder={subError ? 'Please Enter Column name or remove Column': ''}
                            onClick={() => setSubError(false)}/>
                            <img src={cross} className="pointer" alt="" onClick={() => handleDelete(status.id, status.name)} />
                        </li>
                      ))}
                    </ul>
                    <button className={`addSubtaskBtn pointer`} 
                    onClick={handleAddColumn}>+Add New Column</button>
                  </div>
                    <button className="addSubtaskBtn pointer subtmitBtn">
                        {type === 'edit' ? 'Save Change' : 'Create New Board'}
                    </button>
                </form>
              </div>
            </div>
    )
}
export default EditBoard