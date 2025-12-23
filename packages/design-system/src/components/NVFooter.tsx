import React from 'react'

interface FooterLink {
  label: string
  sublabel: string
  href: string
  icon: React.ReactNode
  isExternal?: boolean
  scaleIcon?: boolean
}

interface NVFooterProps {
  /** Optional custom className for additional styling */
  className?: string
  /** Copyright year */
  year?: number
  /** Custom footer links (defaults to standard NV links) */
  customLinks?: FooterLink[]
}

/**
 * Northern Variables unified footer component
 * Features gradient background, navigation links, and copyright
 */
export const NVFooter: React.FC<NVFooterProps> = ({
  className = '',
  year = new Date().getFullYear(),
  customLinks
}) => {
  const defaultLinks: FooterLink[] = [
    {
      label: 'Northern Variables',
      sublabel: 'Website',
      href: 'https://northernvariables.ca/',
      isExternal: true,
      scaleIcon: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm6.93 8h-2.764c-.186-2.278-.891-4.312-1.983-5.712A8.027 8.027 0 0 1 18.93 10zM12 4.063c1.155 1.251 1.946 3.52 2.119 5.937H9.881C10.054 7.583 10.845 5.314 12 4.063zM4.5 14a7.95 7.95 0 0 1 0-4h2.708a17.69 17.69 0 0 0 0 4H4.5zm.57 2h2.764c.186 2.278.89 4.312 1.983 5.712A8.027 8.027 0 0 1 5.07 16zm2.764-8H5.07A8.027 8.027 0 0 1 9.317 4.288C8.224 5.688 7.52 7.722 7.334 10zM12 19.937c-1.155-1.251-1.946-3.52-2.119-5.937h4.238C13.946 16.417 13.155 18.686 12 19.937zM14.119 14H9.881a15.73 15.73 0 0 1 0-4h4.238a15.73 15.73 0 0 1 0 4zm.567 5.712c1.093-1.4 1.797-3.434 1.983-5.712h2.764a8.027 8.027 0 0 1-4.747 5.712z" />
        </svg>
      )
    },
    {
      label: 'Northern Variables',
      sublabel: 'Substack',
      href: 'https://axorc.substack.com',
      isExternal: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4.75C4 3.784 4.784 3 5.75 3h12.5C19.216 3 20 3.784 20 4.75v2.5c0 .966-.784 1.75-1.75 1.75H5.75C4.784 9 4 8.216 4 7.25v-2.5Zm0 5.75 8 4.5 8-4.5v8.75A1.75 1.75 0 0 1 18.25 21H5.75A1.75 1.75 0 0 1 4 19.25V10.5Zm8 2.75L4 8.75V7.25C4 6.284 4.784 5.5 5.75 5.5h12.5C19.216 5.5 20 6.284 20 7.25v1.5l-8 4.5Z" />
        </svg>
      )
    },
    {
      label: 'Artifacts Library',
      sublabel: 'Explore',
      href: 'https://artifacts.northernvariables.ca/',
      isExternal: false,
      scaleIcon: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.75 6.25 12 2l7.25 4.25v8.5L12 19l-7.25-4.25v-8.5Zm2.5 1.443v5.365L12 15.69l4.75-2.632V7.693L12 5.06 7.25 7.693ZM12 22l-7.25-4.25 1.5-.879L12 20.25l5.75-3.379 1.5.879L12 22Z" />
        </svg>
      )
    }
  ]

  const links = customLinks || defaultLinks

  return (
    <footer
      className={`nv-footer ${className}`}
      style={{
        background: 'linear-gradient(120deg, #091a30 0%, #0f2747 60%, #d85612 100%)',
        color: '#f8fafc',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        boxShadow: '0 -12px 24px rgba(15, 39, 71, 0.3)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="nv-footer-links"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '1rem',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.isExternal ? '_blank' : '_self'}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="nv-footer-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                fontWeight: 600,
                letterSpacing: '0.02em',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.18)',
                transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                whiteSpace: 'nowrap',
                color: '#ffd7c2',
                textDecoration: 'none',
              }}
            >
              <span
                className={`nv-footer-link-icon ${link.scaleIcon ? 'nv-footer-link-icon--scale' : ''}`}
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 23, 42, 0.18)',
                  color: '#fff7ed',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
                }}
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    display: 'inline-flex',
                    transform: link.scaleIcon ? 'scale(1.18)' : 'scale(1)',
                  }}
                >
                  {link.icon}
                </span>
              </span>
              <span
                className="nv-footer-link-text"
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: 1.2,
                }}
              >
                <span>{link.label}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: 0.85,
                  }}
                >
                  {link.sublabel}
                </span>
              </span>
            </a>
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}>
          &copy; {year} Northern Variables. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default NVFooter
