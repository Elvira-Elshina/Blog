import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BlogApp from './App.tsx'
import { Provider } from "react-redux";
import { store } from './store/store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <BlogApp />
    </Provider>
  </StrictMode>
)
