import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import QueueList from './components/QueueList';
import QueueRegistration from './components/QueueRegistration';
import AdminPanel from './components/AdminPanel';
import CancelRegistration from './components/CancelRegistration';
import background from './imgs/background.jpg'

function App() {
  return (
    <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', height: '100vh' }} className="App">

      <Router>

        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<QueueList />} />
            <Route path='/reg' element={<QueueRegistration/>} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/cancel" element={<CancelRegistration />} />
          </Routes>
        </main>
      </Router>

    </div>
  );
}

export default App;
