import React from 'react'

interface NVHeaderProps {
  /** Optional custom className for additional styling */
  className?: string
  /** Whether to link to main site or artifacts */
  linkTo?: 'main' | 'artifacts'
}

/**
 * Northern Variables unified header component
 * Features gradient background, logo banner, and accessible link
 */
export const NVHeader: React.FC<NVHeaderProps> = ({
  className = '',
  linkTo = 'main'
}) => {
  const href = linkTo === 'main'
    ? '/'
    : 'https://artifacts.northernvariables.ca'

  return (
    <header
      className={`nv-header ${className}`}
      style={{
        background: 'linear-gradient(135deg, #091a30 0%, #163b6b 55%, #ff6719 100%)',
        borderBottom: '4px solid rgba(255, 255, 255, 0.25)',
        padding: '2.25rem 1.5rem',
        boxShadow: '0 10px 30px rgba(9, 26, 48, 0.25)',
      }}
    >
      <div
        className="nv-header-inner"
        style={{
          maxWidth: '360px',
          margin: '0 auto',
          padding: '3px',
          background: 'rgba(255, 255, 255, 0.86)',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(9, 26, 48, 0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <a
          href={href}
          style={{
            display: 'block',
            borderRadius: 'inherit',
          }}
          aria-label="Northern Variables Home"
        >
          <img
            src="https://northernvariables.ca/wp-content/uploads/2025/10/Northern-Variables.jpg"
            alt="Northern Variables logo"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: 'inherit',
            }}
          />
        </a>
      </div>
    </header>
  )
}

export default NVHeader
