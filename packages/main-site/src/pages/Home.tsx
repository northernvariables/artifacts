import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface SubstackPost {
  title: string
  url: string
  pubDate: string
  description: string
  imageUrl?: string
}

// Decode HTML entities in text
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

export function Home() {
  const [posts, setPosts] = useState<SubstackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Fetch Substack RSS feed via CORS proxy
    const fetchSubstackFeed = async () => {
      try {
        // Use a CORS proxy to fetch the RSS feed
        const feedUrl = 'https://substack.northernvariables.ca/feed'
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`

        const response = await fetch(proxyUrl)
        if (!response.ok) throw new Error('Feed fetch failed')

        const text = await response.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(text, 'text/xml')
        const items = xml.querySelectorAll('item')

        const parsedPosts: SubstackPost[] = Array.from(items).slice(0, 5).map(item => {
          // Extract description and clean HTML tags
          const rawDescription = item.querySelector('description')?.textContent || ''
          const cleanDescription = rawDescription.replace(/<[^>]*>/g, '').trim()

          // Extract image from enclosure or content:encoded
          let imageUrl: string | undefined

          // Try to get image from enclosure first (Substack puts hero images here)
          const enclosure = item.querySelector('enclosure')
          if (enclosure) {
            const enclosureUrl = enclosure.getAttribute('url')
            if (enclosureUrl) {
              imageUrl = enclosureUrl
            }
          }

          // If no enclosure, try to extract from content:encoded
          if (!imageUrl) {
            const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent || ''
            const imgMatch = contentEncoded.match(/<img[^>]+src=["']([^"']+)["']/)
            if (imgMatch) {
              imageUrl = imgMatch[1]
            }
          }

          // Decode HTML entities in title and description
          const rawTitle = item.querySelector('title')?.textContent || ''
          const decodedTitle = decodeHtmlEntities(rawTitle)
          const decodedDescription = decodeHtmlEntities(cleanDescription)

          return {
            title: decodedTitle,
            url: item.querySelector('link')?.textContent || '',
            pubDate: item.querySelector('pubDate')?.textContent || '',
            description: decodedDescription.length > 200
              ? decodedDescription.substring(0, 200) + '...'
              : decodedDescription,
            imageUrl
          }
        })

        setPosts(parsedPosts)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching Substack feed:', error)
        setLoading(false)
      }
    }

    fetchSubstackFeed()
  }, [])

  return (
    <div className="font-sans">
      {/* Accessibility - Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0f2747]/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-gradient-to-b from-black/50 to-transparent py-5'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-3 items-center">
            {/* Logo */}
            <div className="flex justify-start">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="https://northernvariables.ca/wp-content/uploads/2025/10/Northern-Variables.jpg"
                  alt="Northern Variables"
                  className="h-11 w-11 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                />
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center justify-center gap-8">
              <a
                href="https://canadagpt.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <span>🍁</span>
                <span>CanadaGPT</span>
              </a>
              <Link
                to="/artifacts"
                className="text-white/90 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                Artifacts
              </Link>
              <Link
                to="/contributors"
                className="text-white/90 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                Contributors
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-end gap-3">
              <a
                href="https://www.threads.net/@northernvariables"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
                aria-label="Threads"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.082-1.168 3.59-1.324.89-.093 1.83-.063 2.794.092a6.86 6.86 0 00-.063-.803c-.174-1.334-.758-1.878-1.73-2.108-.803-.19-1.778-.085-2.737.296l-.768-1.862c1.24-.494 2.6-.69 3.835-.555 1.818.2 3.16 1.153 3.503 3.123.093.534.138 1.147.133 1.837 1.024.593 1.83 1.393 2.341 2.355.76 1.427.893 3.503-.64 5.433C19.11 22.588 16.127 23.964 12.186 24zm-1.14-7.963c-1.797.164-2.604 1.003-2.552 2.066.028.541.274.98.713 1.271.494.328 1.166.474 1.897.44 1.089-.058 1.9-.457 2.41-1.186.388-.554.618-1.295.685-2.216-.8-.165-1.6-.22-2.368-.173z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/Northernvariables"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://x.com/Northernvar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://substack.northernvariables.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
                aria-label="Substack"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
              </a>
            </div>
          </div>
      </nav>

      {/* Hero Section */}
      <header
        className="relative w-full min-h-[600px] md:min-h-[700px] flex flex-col bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/aurora-banner.jpg)'
        }}
      >
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-4xl">
            <h1 className="font-serif text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl mb-5">
              Northern Variables
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto tracking-wide">
              Independent Canadian Political Analysis, Media Literacy, and Economic Context
            </p>

            {/* Subscribe CTA */}
            <a
              href="https://substack.northernvariables.ca/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff6719] hover:bg-[#ff7a33] text-white rounded-full font-semibold text-lg transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(255,103,25,0.4)] hover:-translate-y-0.5"
            >
              <span>Subscribe Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-[960px] mx-auto pt-8 pb-20 px-6 md:px-12">
        {/* Mission Statement */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] text-[#0f2747] font-semibold mb-6 leading-snug tracking-tight max-w-3xl mx-auto">
            Understanding not just what is happening in Canadian politics, but why.
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
            Evidence-based reporting on power, policy, and narrative. Context and institutional reality over partisan spin.
          </p>
        </div>

        {/* What We Cover */}
        <div className="mb-20">
          <h3 className="font-serif text-xl font-semibold text-[#0f2747] mb-8 text-center">What We Cover</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#0f2747]/20 transition-colors">
              <h4 className="font-semibold text-[#0f2747] mb-2 text-sm">Federal Politics & Elections</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">Leadership, party strategy, and how policy declarations translate into governance.</p>
            </div>
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#0f2747]/20 transition-colors">
              <h4 className="font-semibold text-[#0f2747] mb-2 text-sm">Economic Policy & Finance</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">Fiscal policy, central banking, and fact-based debunking of economic misinformation.</p>
            </div>
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#0f2747]/20 transition-colors">
              <h4 className="font-semibold text-[#0f2747] mb-2 text-sm">Media & Political Messaging</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">How digital media and closed-loop messaging systems shape public opinion.</p>
            </div>
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#0f2747]/20 transition-colors">
              <h4 className="font-semibold text-[#0f2747] mb-2 text-sm">Democratic Institutions</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">Constitutional norms, the Charter, and risks of democratic erosion.</p>
            </div>
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#0f2747]/20 transition-colors">
              <h4 className="font-semibold text-[#0f2747] mb-2 text-sm">Global Influence Networks</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">How Canadian politics connects to international ideological movements.</p>
            </div>
            <div className="p-5 border border-[#e2e8f0] rounded-xl hover:border-[#ff6719]/30 transition-colors bg-[#ff6719]/5">
              <h4 className="font-semibold text-[#ff6719] mb-2 text-sm">Long-Form Analysis</h4>
              <p className="text-sm text-[#64748b] leading-relaxed">Articles designed for durability beyond the daily news cycle.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Current Perspectives Section - Magazine Layout */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 mb-24" aria-labelledby="perspectives-heading">
        <div className="text-center mb-12">
          <h2 id="perspectives-heading" className="font-serif text-3xl md:text-4xl font-semibold text-[#0f2747] mb-3 tracking-tight">
            Current Perspectives
          </h2>
          <p className="text-[#64748b]">Latest analysis and commentary</p>
        </div>

        {loading ? (
          <div className="text-center text-[#64748b] py-16" role="status" aria-live="polite">
            <div className="inline-block w-10 h-10 border-3 border-[#0f2747] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Loading latest articles...</p>
          </div>
        ) : posts.length > 0 ? (
          <div>
            {/* Featured Article - First Post */}
            <article className="mb-12">
              <a
                href={posts[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div
                  className="relative rounded-2xl p-8 md:p-12 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  {/* Background image with overlay */}
                  {posts[0].imageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${posts[0].imageUrl})` }}
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 ${posts[0].imageUrl ? 'bg-gradient-to-br from-[#0f2747]/95 via-[#163b6b]/90 to-[#1e4a7a]/85' : 'bg-gradient-to-br from-[#0f2747] via-[#163b6b] to-[#1e4a7a]'}`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1.5 bg-[#ff6719] text-white text-xs font-bold uppercase tracking-widest rounded mb-6">
                      Latest
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold mb-5 leading-tight group-hover:text-[#ff6719] transition-colors drop-shadow-lg">
                      {posts[0].title}
                    </h3>
                    <p className="text-white text-lg leading-relaxed mb-8 max-w-3xl drop-shadow-md">
                      {posts[0].description}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/20 pt-6">
                      <time className="text-white/70 text-sm font-medium" dateTime={posts[0].pubDate}>
                        {new Date(posts[0].pubDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <span className="inline-flex items-center gap-2 text-[#ff6719] font-semibold text-sm group-hover:gap-3 transition-all">
                        Read article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </article>

            {/* Article Grid - Remaining Posts */}
            {posts.length > 1 && (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {posts.slice(1).map((post, index) => (
                  <article key={index} className="group">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-full rounded-xl border border-[#e2e8f0] p-7 hover:border-[#0f2747]/20 hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden"
                    >
                      {/* White base */}
                      <div className="absolute inset-0 bg-white" />
                      {/* Background image - subtle watermark effect */}
                      {post.imageUrl && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-30 transition-opacity duration-300"
                          style={{ backgroundImage: `url(${post.imageUrl})` }}
                        />
                      )}

                      {/* Content */}
                      <div className="relative z-10">
                        <time className="text-xs text-[#94a3b8] uppercase tracking-widest font-medium" dateTime={post.pubDate}>
                          {new Date(post.pubDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                        <h3 className="font-serif text-xl font-semibold text-[#0f2747] mt-3 mb-3 line-clamp-2 group-hover:text-[#ff6719] transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-[#64748b] text-sm line-clamp-3 mb-5 leading-relaxed">
                          {post.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2747] group-hover:text-[#ff6719] transition-colors">
                          Read more
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            )}

            {/* View All Link */}
            <div className="text-center">
              <a
                href="https://substack.northernvariables.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0f2747] text-[#0f2747] rounded-full font-semibold hover:bg-[#0f2747] hover:text-white transition-all"
              >
                View all on Substack
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#64748b] py-16 bg-[#f8fafc] rounded-2xl">
            <p className="mb-6 text-lg">No articles found. Visit our Substack for the latest perspectives.</p>
            <a
              href="https://substack.northernvariables.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#0f2747] text-white rounded-full font-semibold hover:bg-[#163b6b] transition-colors"
            >
              Visit Substack
            </a>
          </div>
        )}
      </section>

      {/* Explore Section */}
      <section className="bg-gradient-to-b from-[#f8fafc] to-white py-20">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2747] mb-12 text-center tracking-tight">
            Explore More
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/artifacts"
              className="group block p-8 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#0f2747]/20 hover:shadow-xl transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 bg-[#0f2747]/5 rounded-xl flex items-center justify-center group-hover:bg-[#0f2747]/10 transition-colors">
                <svg className="w-7 h-7 text-[#0f2747]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0f2747] mb-2">Artifacts</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">Interactive tools and data visualizations</p>
            </Link>
            <Link
              to="/contributors"
              className="group block p-8 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#0f2747]/20 hover:shadow-xl transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 bg-[#0f2747]/5 rounded-xl flex items-center justify-center group-hover:bg-[#0f2747]/10 transition-colors">
                <svg className="w-7 h-7 text-[#0f2747]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0f2747] mb-2">Contributors</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">Meet the team behind the analysis</p>
            </Link>
            <a
              href="https://substack.northernvariables.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#0f2747]/20 hover:shadow-xl transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 bg-[#ff6719]/10 rounded-xl flex items-center justify-center group-hover:bg-[#ff6719]/20 transition-colors">
                <svg className="w-7 h-7 text-[#ff6719]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0f2747] mb-2">Newsletter</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">Subscribe for weekly updates</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
