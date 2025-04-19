import { useContext, useEffect, useRef, useState } from "react"
import cross from '/assets/icon-cross.svg'
import { useNavigate } from "react-router-dom"
import { kanbanContext } from "../context/KanbanContext"
import usePostFetch from "../Hooks/usePostFetch"


function EditBoard(props){
    const {setEditBoard, type} = props
    const {state, dispatch} = useContext(kanbanContext)
    const [boardName, setBoardName] = useState('')
    const [boardColumn, setBoardColumn] = useState([])


    useEffect(() =>{
        if(type === 'edit'){
            setBoardName(state.currBoard.name)
            setBoardColumn(state.currBoard.columns)
        }
    },[type])

    const handleName = (col, newName) =>{
        setBoardColumn(prevState =>
        prevState.map((column)=>(
            column === col ? {...column, name:newName} : column
        )))
    }

    /* only delete based on id or name */
    const handleDelete = (id, newId) => {
        setBoardColumn(prevState => prevState.filter(col => '_id' in col ? col._id !== id : col.newId !== newId))
    }

    const [emptyName, setEmptyName] = useState(false)
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
            if(boardName === ''){
                setEmptyName(true)
            }
            if(checkEmpty()){
                setSubError(true)
            }
            return true
        }
    }

    const {fetchingUrl,error, isLoading, isSuccess, fetchResult} = usePostFetch()

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const newBoard ={
            name: boardName, 
            columns: boardColumn
        }
        //only submit if no error
        if(!errorCheck()){
            console.log(newBoard);
            await fetchingUrl(
                `board/${type === 'edit' ? `${state.currBoard._id}` : 'addBoard'}`,
                newBoard,
                type === 'edit' ? 'PATCH' : 'POST')
        }
    }

    useEffect(() =>{
        if(isSuccess){
            dispatch({type: type ==='edit' ? 'EDIT_BOARD' : 'ADD_BOARD', payload:fetchResult})
            if(type !== 'edit'){
                dispatch({type: 'SET_CURRBOARD', payload: fetchResult})
            }
            
            setTimeout(() =>{
                navigate(`/${fetchResult.name}`)
            },500)        
            setEditBoard(false)
        }
    },[fetchResult])

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
            const newColumn = {name:'', tasks:[], newId:Math.floor(Math.random() * 9999999)}
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
                    <input autoComplete="off" placeholder={emptyName ? 'please enter Board name':"e.g Web design"} 
                    className={emptyName && 'error'} onClick={() =>setEmptyName(false)}
                    type="text" name='boardName' value={boardName} onChange={(e) => setBoardName(e.currentTarget.value)}/>
                  </div>

                  <div className="inputContainer">
                    <label htmlFor="boardColumns">Board Columns</label>
                    <ul className="subtaskInputContainer">
                      {boardColumn && boardColumn.map((column)=>(
                        <li className="subtaskInput">
                            <input type="text" value={column.name} 
                            onChange={(e) => handleName(column, e.currentTarget.value)}
                            className={subError && 'error'} placeholder={subError ? 'Please Enter Column name or remove Column': ''}
                            onClick={() => setSubError(false)}/>
                            <img src={cross} className="pointer" alt="" onClick={() => handleDelete(column._id, column.newId)} />
                        </li>
                      ))}
                    </ul>
                    <button type="button" className={`addSubtaskBtn pointer`} 
                    onClick={handleAddColumn}>+Add New Column</button>
                  </div>
                    <button className="addSubtaskBtn pointer subtmitBtn" type="submit">
                        {type === 'edit' ? 'Save Change' : 'Create New Board'}
                    </button>
                </form>
              </div>
            </div>
    )
}
export default EditBoard