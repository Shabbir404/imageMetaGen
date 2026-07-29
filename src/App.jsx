import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Workspace from './pages/Workspace';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Workspace />} />
      </Route>
    </Routes>
  );
}
