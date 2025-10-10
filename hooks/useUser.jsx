import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';


export function useUser() {
    const context = useContext(UserContext)

    if(!context){
        throw new Error("useUser must be used within Provider");
    }
    //console.log("user context: ", context)
    return context
}
