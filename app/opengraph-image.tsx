import { ImageResponse } from 'next/og';

import { profile } from '@/lib/content';

export const alt = `${profile.name} — ${profile.role} in ${profile.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** The dark theme from `globals.css`, converted to hex — Satori has no oklch. */
const colors = {
  background: '#0e0c09',
  card: '#171411',
  border: '#302d2a',
  foreground: '#f0eeea',
  muted: '#9c9792',
  acid: '#59d483',
};

const domain = profile.website.replace('https://', '');
const headline = 'builds software that stays readable at scale.';
const prompt = `${profile.handle}@basel ~ $ whoami`;
const footer = `${profile.role} · ${profile.location}`;

/**
 * Pulls a TTF subset from Google Fonts, limited to the characters the image
 * actually prints. Without a browser user agent the CSS API answers with
 * TrueType, which is the format Satori reads.
 *
 * A failure is not worth breaking the build over: the image then falls back to
 * the font bundled with `next/og`.
 */
async function loadFont(family: string, weight: 400 | 500 | 700, text: string) {
  try {
    const params = new URLSearchParams({
      family: `${family}:wght@${weight}`,
      text: Array.from(new Set(text)).join(''),
    });
    const css = await fetch(`https://fonts.googleapis.com/css2?${params}`).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;

    const data = await fetch(url).then((res) => res.arrayBuffer());
    return { name: family, data, weight, style: 'normal' as const };
  } catch (error) {
    console.warn(`Could not load ${family} for the Open Graph image`, error);
    return null;
  }
}

const fonts = (
  await Promise.all([
    loadFont('Bricolage Grotesque', 700, profile.name),
    loadFont('Bricolage Grotesque', 500, headline),
    loadFont('JetBrains Mono', 400, domain + prompt + footer + '~/portfolio'),
  ])
).filter((font) => font !== null);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 72px',
          backgroundColor: colors.background,
          // The ruled paper behind the hero.
          backgroundImage: `linear-gradient(to bottom, ${colors.card} 2px, transparent 2px)`,
          backgroundSize: '100% 56px',
          color: colors.foreground,
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 24,
            color: colors.muted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: colors.acid,
            }}
          />
          <span>~/portfolio</span>
          <span style={{ marginLeft: 'auto' }}>{domain}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            fontFamily: 'Bricolage Grotesque',
          }}
        >
          <span style={{ fontSize: 132, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            {profile.name}
          </span>
          <span
            style={{
              marginTop: 18,
              maxWidth: 960,
              fontSize: 60,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: colors.muted,
            }}
          >
            {headline}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 56,
            paddingTop: 28,
            borderTop: `2px solid ${colors.border}`,
            fontSize: 24,
            color: colors.muted,
          }}
        >
          <span style={{ color: colors.acid }}>{prompt}</span>
          <span style={{ marginLeft: 'auto' }}>{footer}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
