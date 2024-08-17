import { useEffect, useRef, useState } from "react"
import cross from '/assets/icon-cross.svg'
import { useNavigate } from "react-router-dom"


function EditBoard(props){
    const {statues, setData, currBoard, addBoard, setEditBoard, type, darkMode} = props

    const [boardName, setBoardName] = useState('')
    const [boardColumn, setBoardColumn] = useState([
        {id: Math.floor(Math.random()*99999999),name: '', tasks: []}
    ])


    useEffect(() =>{
        if(type === 'edit'){
            
            setBoardName(currBoard)
            setBoardColumn(statues)
        }
    },[type])

    const handleName = (colId, newName) =>{
        setBoardColumn(prevState =>
        prevState.map((column)=>(
            column.id === colId ? {...column, name:newName} : column
        )))
    }
    const addColumn = () =>{
        const newColumn = {id: Math.floor(Math.random()*99999999),name:'', tasks:[]}
        setBoardColumn([...boardColumn, newColumn])
    }
    const handleDelete = (id) => {
        setBoardColumn(prevState => prevState.filter(col => col.id !== id))
    }
    
    const navigate = useNavigate()
    const handleSubmit = () =>{
        const newBoard ={
            name: boardName, 
            columns: boardColumn}
        if(type === 'edit'){
            setData(prevState => prevState.map((board) =>(
                board.name === currBoard ? newBoard : board
            )))
            
        }
        else{
            addBoard(newBoard)
        }
        navigate(`/${boardName}`)
        setEditBoard(false)
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
    return(
            <div className='taskBackground' ref={taskBg}>
              <div className={`taskDetails ${darkMode && 'dark'}`}>
                <h4>Edit Board</h4>
                <form action="" className="addForm" onSubmit={(e) => e.preventDefault()}>
                  <div className="inputContainer">
                    <label htmlFor="boardName">Board Name</label>
                    <input autoComplete="off" placeholder="e.g Web design" type="text" name='boardName' value={boardName} onChange={(e) => setBoardName(e.currentTarget.value)}/>
                  </div>

                  <div className="inputContainer">
                    <label htmlFor="boardColumns">Board Columns</label>
                    <ul className="subtaskInputContainer">
                      {boardColumn && boardColumn.map((status)=>(
                        <li className="subtaskInput">
                            <input type="text" value={status.name} onChange={(e) => handleName(status.id, e.currentTarget.value)}/>
                            <img src={cross} className="pointer" alt="" onClick={() => handleDelete(status.id)} />
                        </li>
                      ))}
                    </ul>
                    <button className="addSubtaskBtn pointer" onClick={() => addColumn()}>+Add New Column</button>
                  </div>
                    <button className="addSubtaskBtn pointer subtmitBtn" onClick={handleSubmit}>
                        {type === 'edit' ? 'Save Change' : 'Create New Board'}
                    </button>
                </form>
              </div>
            </div>
    )
}
export default EditBoard