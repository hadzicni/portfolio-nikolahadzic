import { NowPanel } from '@/components/now-panel';
import { SideRail } from '@/components/side-rail';
import { SiteFooter } from '@/components/site-footer';
import { StatusBar } from '@/components/status-bar';
import { About } from '@/components/sections/about';
import { Career } from '@/components/sections/career';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { Stack } from '@/components/sections/stack';
import { profile, stack } from '@/lib/content';

/** The projects section reads GitHub, so the page refreshes hourly. */
export const revalidate = 3600;

/** Who this page is about, for search engines. Built from `lib/content.ts`. */
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: profile.website,
  jobTitle: profile.role,
  description: profile.intro,
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location.split(',')[0],
    addressCountry: 'CH',
  },
  sameAs: [profile.github],
  knowsAbout: stack
    .filter((group) => group.id === 'languages' || group.id === 'frameworks')
    .flatMap((group) => group.items),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaping `<` keeps the payload from closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
      />

      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>

      <SideRail now={<NowPanel />} />

      <div className="flex-1 lg:pl-72">
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8 xl:max-w-4xl">
          <main id="content">
            <Hero />
            <About />
            <Career />
            <Stack />
            <Projects />
            <Contact />
          </main>
          <SiteFooter />
        </div>
      </div>

      <StatusBar />
    </>
  );
}
