import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 這裡我們直接啟動 App，不做任何額外的路由設定，確保畫面一定出得來
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
