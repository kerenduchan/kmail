import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

// pages
import { Home } from './pages/Home'
import { About } from './pages/About'
import { EmailIndex } from './pages/EmailIndex'
import { EmailDetails } from './pages/EmailDetails'
import { UserMsg } from './cmps/UserMsg'

function App() {
    return (
        <ChakraProvider>
            <Router>
                <main className="app">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/email/:folderId?"
                            element={<EmailIndex />}
                        >
                            <Route
                                path="/email/:folderId/:emailId"
                                element={<EmailDetails />}
                            />
                        </Route>
                    </Routes>
                    <UserMsg />
                </main>
            </Router>
        </ChakraProvider>
    )
}

export default App
