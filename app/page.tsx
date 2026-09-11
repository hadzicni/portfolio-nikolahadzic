import { SideRail } from '@/components/side-rail';
import { SiteFooter } from '@/components/site-footer';
import { StatusBar } from '@/components/status-bar';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { Stack } from '@/components/sections/stack';

/** The projects section reads GitHub, so the page refreshes hourly. */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <SideRail />

      <div className="flex-1 lg:pl-72">
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8 xl:max-w-4xl">
          <main>
            <Hero />
            <About />
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
