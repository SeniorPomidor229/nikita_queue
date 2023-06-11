import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import QueueList from './components/QueueList';
import QueueRegistration from './components/QueueRegistration';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <div className="App">

      <Router>

        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<QueueList />} />
            <Route path='/reg' element={<QueueRegistration/>} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </Router>

    </div>
  );
}

export default App;
