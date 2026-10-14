import { createContext, useState } from "react";
import { createRoot } from 'react-dom/client'
import { AppContextProvider } from "./context/AppContext.jsx";
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
