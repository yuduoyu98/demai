import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import {isAuthenticated} from './utils/auth';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated() ? (
                            <div>{<DashBoard/>}</div>
                        ) : (
                            <Navigate to="/login" replace/>
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </Router>
    );
};

export default App;