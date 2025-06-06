import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
//import PropertySearch from './components/PropertySearch';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PropertyList from './pages/PropertyList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/property" element={<PropertyList />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
