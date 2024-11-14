import { useState } from "react"

const useGetData = () =>{
    const [isSuccess, setisSuccess] = useState(false)
    const [fetchResult, setFetchResult] = useState('')
    const fetchData = async() =>{
        setisSuccess(false)
        setFetchResult('')
        try{
            const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/getData',
                {credentials:'include'}
            )
            const json = await response.json()
            if(response.ok){
                setisSuccess(true)
                setFetchResult(json)
            }else{
                throw new Error('failed to fetch data')
            }
        }catch{
            try{
                const refreshToken = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/refreshToken',
                    {credentials:'include'}
                )
                if(refreshToken.ok){
                    const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/getData',
                        {credentials:'include'}
                    )
                    const json = await response.json()
                    if(response.ok){
                        setisSuccess(true)
                        setFetchResult(json)
                    }else{
                        throw new Error('failed to fetch data')
                    }
                }
            }catch(error){
                console.log(error);
                
            }
        }

    }
    return {fetchData, fetchResult, isSuccess}
}

export default useGetData