import { createContext, useReducer } from "react";


export const kanbanContext = createContext()

const kanbanReducer = (state, action) =>{
    switch (action.type){
        case 'SET_DATA':
            return{
            boards: action.payload
        }

        case 'ADD_BOARD':
            return{
                boards: [...state.boards, action.payload]
            }

        case 'EDIT_BOARD':
            const {newBoard} = action.payload
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            board: newBoard
                        }
                    }
                    return board
                })
            }

        case 'DEL_BOARD':
            return{
                boards: state.boards.filter(board => board.name != action.payload)
            }

        case 'ADD_COLUMN':
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            ...board,
                            columns: [...state.columns,action.payload]
                        }
                    }
                    return board
                })
            }

        case 'ADD_TASK':{
            const {currBoard, currColumn, newTask} = action.payload
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column)=>{
                                if(column.name === currColumn){
                                    return{
                                        ...column,
                                        tasks: [...column.task, newTask]
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }
        }

        case 'DEL_TASK':
            const {currBoard, currColumn, delTask} = action.payload
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === currColumn){
                                    return{
                                        ...columns,
                                        tasks: column.task.filter((task) => task.name != delTask)
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }

        case 'EDIT_TASK':
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === currColumn){
                                    return{
                                        ...columns,
                                        tasks: column.task.map((task) =>{
                                            if(task.name === currTask){
                                                return{
                                                    task: newTask
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
            }

        case 'CHANGE_SUBTASK':
            return{
                boards: state.boards.map((board) =>{
                    if(board.name === currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === currColumn){
                                    return{
                                        ...column,
                                        tasks: column.tasks.map((task) =>{
                                            if(task.title === currTask){
                                                return{
                                                    ...task,
                                                    subtasks: task.subtasks.map((subtask) =>{
                                                        if(subtask.title === currSubtask){
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
            }

        default:
            return state
    }
}

export const kanbanContextProvider = ({children}) =>{
const [state, dispatch] = useReducer(kanbanReducer, {
    boards:[],
    currBoard: null
})

    return(
        <kanbanContext.Provider value={{state, dispatch}}>
            {children}
        </kanbanContext.Provider>
    )
}