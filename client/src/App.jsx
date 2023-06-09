import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './routes/Home';
import { CodeContext, CodeContextProvider } from './context/CodeContext';
const App = () => {
    return (
        <CodeContextProvider>
             <div className='container'>
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
        </CodeContextProvider>
       
    )

}

export default App;