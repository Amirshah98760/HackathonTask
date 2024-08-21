
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Private from './pages/Private'
import { ProtectedRoute } from './components/ProtectedRoute'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useState , useEffect} from 'react'
import Home from './pages/Home'
// import Spinner from 'react-bootstrap/Spinner';

function App() {
const [user, setUser] = useState(null)
const [isFetching, setIsFetching] = useState(true)

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      if (user) {
        setUser(user)
        setIsFetching(false)
        return
      }
      setUser(null)
      setIsFetching(false)
    })
    return ()=>unsubscribe()
}, [])
if(isFetching){
  return <h2>Loading...</h2>
}
  return (
    <BrowserRouter>
    <Routes>
      <Route index path='/' element = {<Home/>}></Route>
      <Route path='/Private' element = {<ProtectedRoute user={user}>
        <Private />
      </ProtectedRoute>}> </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App

