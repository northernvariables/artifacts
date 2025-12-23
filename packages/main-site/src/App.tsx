import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { NVHeader, NVFooter } from '@design-system/components'
import '@design-system/styles/index.css'
import './index.css'

// Import components
import { ChatWidget } from './components/ChatWidget'

// Import pages
import { Home } from './pages/Home'
import { Perspectives } from './pages/Perspectives'
import { About } from './pages/About'
import { Contributors } from './pages/Contributors'
import { Artifacts } from './pages/Artifacts'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'

function AppContent() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show header on non-homepage routes */}
      {!isHomePage && <NVHeader linkTo="main" />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perspectives" element={<Perspectives />} />
          <Route path="/about" element={<About />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/artifacts" element={<Artifacts />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>

      <NVFooter
        customLinks={[
          {
            label: 'Home',
            sublabel: 'Main Site',
            href: '/',
            isExternal: false,
            scaleIcon: true,
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            )
          },
          {
            label: 'Newsletter',
            sublabel: 'Substack',
            href: 'https://substack.northernvariables.ca',
            isExternal: true,
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
              </svg>
            )
          },
          {
            label: 'Artifacts',
            sublabel: 'Explore',
            href: '/artifacts',
            isExternal: false,
            scaleIcon: true,
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.75 6.25 12 2l7.25 4.25v8.5L12 19l-7.25-4.25v-8.5Zm2.5 1.443v5.365L12 15.69l4.75-2.632V7.693L12 5.06 7.25 7.693ZM12 22l-7.25-4.25 1.5-.879L12 20.25l5.75-3.379 1.5.879L12 22Z" />
              </svg>
            )
          },
          {
            label: 'CanadaGPT',
            sublabel: 'AI Analysis',
            href: 'https://canadagpt.ca',
            isExternal: true,
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L9.5 8.5L3 8.5L7.5 12.5L5.5 19L12 15L18.5 19L16.5 12.5L21 8.5L14.5 8.5L12 2Z" />
              </svg>
            )
          }
        ]}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
