import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bio from './pages/designer/Bio';
import './index.css';
import './assets/css/animation.css'; // Bio.jsx uses this

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Production route served by Laravel */}
                <Route path="/@:username" element={<Bio />} />

                {/* Fallback debug route */}
                <Route path="/:username" element={<Bio />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);
