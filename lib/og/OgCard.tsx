/** Shared 1200 x 630 link-preview card for `next/og` image routes. */
export function OgCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #fdf8f5 0%, #f5e6e8 50%, #e8d4e0 100%)',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.85)',
          border: '2px solid #e8a5a5',
          maxWidth: '900px',
        }}
      >
        <p style={{ fontSize: 28, color: '#e91e8c', margin: 0, letterSpacing: '0.15em' }}>
          BLOOM
        </p>
        <p style={{ fontSize: 52, color: '#3d2f2f', margin: '24px 0 12px', textAlign: 'center' }}>
          {title}
        </p>
        <p style={{ fontSize: 28, color: '#3d2f2f99', margin: 0, textAlign: 'center' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
