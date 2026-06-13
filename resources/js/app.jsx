import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp.jsx';
import './App.css';

console.log("Vite React entry point loaded.");

if (document.getElementById('root')) {
    try {
        console.log("Root element found, mounting React...");
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <MainApp />
            </React.StrictMode>
        );
        console.log("React mounted successfully!");
    } catch (error) {
        console.error("React mounting error:", error);
        document.getElementById('root').innerHTML = `<h1 style="color:red; text-align:center;">React Error: ${error.message}</h1>`;
    }
} else {
    console.error("Root element NOT found!");
}
