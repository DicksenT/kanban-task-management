import { createContext, useReducer } from "react";


export const kanbanContext = createContext()

const kanbanReducer = (state, action) =>{
    const {payload} = action
    switch (action.type){
        case 'SET_DATA':
            return{
            ...state,
            boards: payload
        }

        case 'SET_DARKMODE':
            return{
                ...state,
                darkMode: !state.darkMode
            }

        case 'SET_CURRBOARD':
            return{
                ...state,
                currBoard: payload
            }

        case 'ADD_BOARD':
            return{
                boards: [...state.boards, payload]
            }

        case 'EDIT_BOARD':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            board: payload
                        }
                    }
                    return board
                })
            }

        case 'DEL_BOARD':
            return{
                ...state,
                boards: state.boards.filter(board => board.name != payload)
            }

        case 'ADD_COLUMN':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            ...board,
                            columns: [...state.columns,payload]
                        }
                    }
                    return board
                })
            }

        case 'ADD_TASK':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column)=>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: [...column.task, payload.newTask]
                                    }
                                }
                                return column
                            })
                        }
                    }
                    return board
                })
            }
        

        case 'DEL_TASK':
            return{
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...columns,
                                        tasks: column.task.filter((task) => task.name != payload.delTask)
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
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...columns,
                                        tasks: column.task.map((task) =>{
                                            if(task.name === payload.currTask){
                                                return{
                                                    task: payload.newTask
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
                ...state,
                boards: state.boards.map((board) =>{
                    if(board.name === state.currBoard){
                        return{
                            ...board,
                            columns: board.columns.map((column) =>{
                                if(column.name === payload.currColumn){
                                    return{
                                        ...column,
                                        tasks: column.tasks.map((task) =>{
                                            if(task.title === payload.currTask){
                                                return{
                                                    ...task,
                                                    subtasks: task.subtasks.map((subtask) =>{
                                                        if(subtask.title === payload.currSubtask){
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

export const KanbanContextProvider = ({children}) =>{
const [state, dispatch] = useReducer(kanbanReducer, {
    boards:[],
    currBoard: null,
    darkMode: false
})

useEffect(() =>{
    const fetchData = async()=>{
        try{
            const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/board/getData',{
                credentials: "include"
            })
            const json = await response.json()
            if(response.ok){
                dispatch({type:'SET_DATA', payload:json})
            }
        }catch{
            try{
                const refresh = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                    {credentials: "include"}
                )
                if(refresh.ok){
                    const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/board/getData',
                        {credentials: "include"}
                    )
                    const json = await response.json()
                    if(response.ok){
                        dispatch({type:'SET_DATA', payload:json})
                    }
                }
            }catch{
                console.log('User unauthorized or session expired, please login or signup');
            }
        }
    }
    fetchData()
},[])

    return(
        <kanbanContext.Provider value={{state, dispatch}}>
            {children}
        </kanbanContext.Provider>
    )
}