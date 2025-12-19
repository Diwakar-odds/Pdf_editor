
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import EditorPage from './pages/Editor';
import { ImageToPDFConverter } from './features/converter/ImageToPDFConverter';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="/convert" element={<ImageToPDFConverter />} />
    </Routes>
  );
}

export default App;
