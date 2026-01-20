'use client'

/**
 * RandomButton Component
 * Clean, theme-aware 3D circular button
 * Uses system color variables for perfect dark/light mode harmony
 *
 * @param {Object} props
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Disable button state
 * @param {string} props.className - Additional CSS classes
 */
export default function RandomButton({
  onClick,
  disabled = false,
  className = '',
}) {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`random-button group ${className}`}
      aria-label="Random Shuffle"
    >
      <span className="button-shadow" aria-hidden="true" />
      <span className="button-face">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
        >
          <path d="M2 18h1.4c1.3 0 2.5-.6 3.2-1.6l10.8-11.2c.7-1 1.9-1.6 3.2-1.6h1.4" />
          <path d="M2 6h1.4c1.3 0 2.5.6 3.2 1.6l2.5 2.6" />
          <path d="M14.9 15.4l2.5 2.6c.7 1 1.9 1.6 3.2 1.6h1.4" />
          <path d="M15 6h6" />
          <path d="M18 3v6" />
          <path d="M15 18h6" />
          <path d="M18 15v6" />
        </svg>
      </span>

      <style jsx>{`
        .random-button {
          position: relative;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 4rem; /* w-16 */
          height: 4rem;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        /* 
           3D Shadow/Depth Layer 
           Positioned absolutely behind the face
        */
        .button-shadow {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background-color: hsl(var(--primary));
          filter: brightness(0.7); /* Darker shade of primary for depth */
          transform: translateY(6px);
          transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 
           Main Button Face 
           The clickable top layer
        */
        .button-face {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          transform: translateY(0);
          transition:
            transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
            filter 150ms ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Hover State */
        .random-button:hover .button-face {
          transform: translateY(2px); /* Slight press */
          filter: brightness(1.05); /* Subtle glowing effect */
        }

        /* Active/Click State */
        .random-button:active .button-face {
          transform: translateY(6px); /* Full press meeting the shadow */
          filter: brightness(1);
        }

        .random-button:active .button-shadow {
          transform: translateY(6px); /* Shadow stays or adjusts slightly */
        }

        /* Disabled State */
        .random-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .random-button:disabled:active .button-face {
          transform: translateY(0);
        }
      `}</style>
    </button>
  )
}
