import { HashRouter, Routes, Route } from 'react-router-dom';
import Top from './Top';
import SSH from './SSH';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/ssh/:hostAddress/:hostUserName/:hostUserPassword" element={<SSH />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
