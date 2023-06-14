import React, {useState, createContext} from "react";

export const CodeContext = createContext();

export  const CodeContextProvider = props => {
    const [typen, setTypen] = useState([])

    return (
        <CodeContext.Provider value={{typen, setTypen}}>
            {props.children}
        </CodeContext.Provider>
    )
}
