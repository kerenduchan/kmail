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
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/email" element={<EmailIndex />}>
                            <Route
                                path="/email/e/:emailId"
                                element={<EmailDetails />}
                            />
                            <Route
                                path="/email/compose"
                                element={<EmailCompose />}
                            />
                            <Route path="/email/inbox" element={null} />
                            <Route path="/email/sent" element={null} />
                            <Route path="/email/all" element={null} />
                        </Route>
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

export default App
