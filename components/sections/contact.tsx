import { Reveal } from '@/components/reveal';
import { SayHello } from '@/components/say-hello';
import { SectionHeading } from '@/components/section-heading';

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="05"
        command="./say-hello.sh"
        title="Let's talk"
        description="Open to interesting projects, collaboration and a good argument about architecture. Write right here, and your mail app takes it from there."
      />

      <Reveal delay={80} className="mt-12">
        <SayHello />
      </Reveal>
    </section>
  );
}
