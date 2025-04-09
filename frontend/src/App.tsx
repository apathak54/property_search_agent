import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropertySearch from './components/PropertySearch';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';

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
          <Route path="/" element={<LandingPage/>} />
          <Route path='/explore' element={<ExplorePage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
