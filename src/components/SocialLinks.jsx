export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/loredistrict',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@loredistrict',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 3c0 2.8 2.2 5 5 5" />
      </svg>
    ),
  },
];

export default function SocialLinks({ linkStyle, containerStyle }) {
  return (
    <div style={containerStyle}>
      {SOCIAL_LINKS.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} style={linkStyle}>
          {s.icon}
        </a>
      ))}
    </div>
  );
}
