import { Route, HashRouter as Router, Routes } from 'react-router-dom'

// pages
import { Home } from './pages/Home'
import { About } from './pages/About'
import { EmailIndex } from './pages/EmailIndex'
import { EmailDetails } from './pages/EmailDetails'
import { EmailCompose } from './pages/EmailCompose'

// components
import { AppHeader } from './cmps/AppHeader'

function App() {
    return (
        <Router>
            <section className="app">
                <AppHeader />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/email/:folderId?"
                            element={<EmailIndex />}
                        >
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
                </main>
            </section>
        </Router>
    )
}

export default App
