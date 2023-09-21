import { Route, HashRouter as Router, Routes } from 'react-router-dom'

// pages
import { Home } from './pages/Home'
import { About } from './pages/About'
import { EmailIndex } from './pages/EmailIndex'
import { EmailDetails } from './pages/EmailDetails'
import { EmailCompose } from './pages/EmailCompose'
import { UserMsg } from './cmps/UserMsg'

function App() {
    return (
        <Router>
            <main className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/email/:folderId?" element={<EmailIndex />}>
                        <Route
                            path="/email/:folderId/compose/:emailId?"
                            element={<EmailCompose />}
                        />
                        <Route
                            path="/email/:folderId/:emailId"
                            element={<EmailDetails />}
                        />
                    </Route>
                </Routes>
                <UserMsg />
            </main>
        </Router>
    )
}

export default App
