import { Route, HashRouter as Router, Routes } from 'react-router-dom'

// pages
import { Home } from './pages/Home'
import { About } from './pages/About'
import { EmailIndex } from './pages/EmailIndex'

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
                        <Route path="/email" element={<EmailIndex />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

export default App
