import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root")

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } else {
    console.error("Root element not found! Make sure there's a div with id 'root' in your HTML.")
  }
})

