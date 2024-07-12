
import Navbar from './components/Navbar'
import { Route,Routes,BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import InfographicsDownloadPage from './pages/InfographicsDownloadPage'
import SearchPage from './pages/SearchResult'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <ToastContainer/>
        <Routes>
          <Route path="/" element={<><Home/></>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/download/:id" element={<><InfographicsDownloadPage/></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
