
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import EditorPage from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
