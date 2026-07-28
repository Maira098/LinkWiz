import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LinkWizLanding from './LinkWizLanding'
import LinkWizLogin from './LinkWizLogin'
import LinkWizRegister from './LinkWizRegister'
import LinkWizUserProfile from './LinkWizUserProfile'
import LinkWizViewProfile from './LinkWizViewProfile'
import LinkWizEditProfile from './LinkWizEditProfile'
import LinkWizDashboard from './LinkWizDashboard'
import LinkWizBrowseUsers from './LinkWizBrowseUsers'
import LinkWizSearchResults from './LinkWizSearchResults'
import LinkWizPublicProfile from './LinkWizPublicProfile'
import LinkWizExchangeMessaging from './LinkWizExchangeMessaging'
import LinkWizIncoming from './LinkWizIncoming'
import LinkWizOutgoing from './LinkWizOutgoing'
import LinkWizReviews from './linkwiz-reviews'
import LinkWizSettings from './linkwiz-settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LinkWizLanding />} />
        <Route path="/login" element={<LinkWizLogin />} />
        <Route path="/register" element={<LinkWizRegister />} />
        <Route path="/profile" element={<LinkWizUserProfile />} />
        <Route path="/edit-profile" element={<LinkWizEditProfile />} />
        <Route path="/dashboard" element={<LinkWizDashboard />} />
        <Route path="/browse-users" element={<LinkWizBrowseUsers />} />
        <Route path="/search-results" element={<LinkWizSearchResults />} />
        <Route path="/public-profile" element={<LinkWizPublicProfile />} />
        <Route path="/exchange-messaging" element={<LinkWizExchangeMessaging />} />
        <Route path="/incoming" element={<LinkWizIncoming />} />
        <Route path="/outgoing" element={<LinkWizOutgoing />} />
        <Route path="/reviews" element={<LinkWizReviews />} />
        <Route path="/settings" element={<LinkWizSettings />} />
        <Route path="/view-profile/:id" element={<LinkWizViewProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App