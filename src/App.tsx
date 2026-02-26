import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import Billing from './pages/dashboard/Billing';
import Companies from './pages/admin/Companies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="dashboard/billing" element={<Billing />} />
          <Route path="super-admin/companies" element={<Companies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
