import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CitiesTable from './component/CitiesTable/CitiesTable';
import WeatherPage from './component/WeatherPage/WeatherPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CitiesTable />} />
          <Route path="/weather/:cityName" element={<WeatherPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
