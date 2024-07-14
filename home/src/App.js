import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Page from './Page/Page';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="*" name="Home" element={<Page />} />
  </Routes>
  </BrowserRouter>
  );
}

export default App;
