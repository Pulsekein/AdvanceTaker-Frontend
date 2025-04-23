import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Details from './components/DetailBooking';
import History from './components/History';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/details/:id" element={<Details/>} />
        <Route path="/history" element={<History/>} />
      </Routes>
    </Router>
  );
}

export default App;
