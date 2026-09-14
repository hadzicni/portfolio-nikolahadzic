import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  Container,
  Database,
  Layers,
  ShieldAlert,
  TerminalSquare,
  WholeWord,
} from 'lucide-react';

export const profile = {
  name: 'Nikola Hadzic',
  handle: 'hadzicni',
  role: 'Software Developer',
  location: 'Basel, Switzerland',
  email: 'nikolahadzic7@icloud.com',
  website: 'https://nikolahadzic.dev',
  github: 'https://github.com/hadzicni',
  repo: 'https://github.com/hadzicni/portfolio-nikolahadzic',
  tagline: 'I build software that stays readable at scale.',
  intro:
    'Full stack developer working across TypeScript, Java and Python. I care about clean architecture, honest abstractions and interfaces that feel obvious to use.',
  quote: 'Build what you love.',
  about: [
    'I build and maintain internal applications that people rely on during their working day. That context shapes how I work: correctness first, then clarity, then speed.',
    'Most of my time goes into full stack work — designing APIs with Spring Boot, Express or FastAPI, and putting a considered UI in front of them with Next.js. I like systems that are easy to reason about six months later.',
    'Outside of work I run a homelab, write shell tooling and keep my editor config in far too much detail. Kyvora, my control plane for self-hosted infrastructure, grew out of exactly that habit.',
  ],
} as const;

export const facts = [
  { label: 'Based in', value: 'Basel, CH' },
  { label: 'Focus', value: 'Full stack' },
  { label: 'Mostly', value: 'TypeScript' },
  { label: 'Open to', value: 'Collaboration' },
] as const;

/**
 * The career timeline, newest first.
 *
 * Everything marked `20XX` or PLACEHOLDER still needs your real values.
 */
export type CareerEntry = {
  kind: 'work' | 'education';
  /** Shown on the left. Use "present" for the running position. */
  period: string;
  title: string;
  /** Employer or school. */
  organisation: string;
  location: string;
  summary: string;
  highlights?: string[];
  /** Marks the entry as still running, which highlights it in the timeline. */
  current?: boolean;
};

export const career: CareerEntry[] = [
  {
    kind: 'education',
    period: '2023 — present',
    title: 'Informatiker EFZ, Applikationsentwicklung',
    organisation: 'University Hospital Basel / BBZBL',
    location: 'Basel, Switzerland',
    summary:
      'Swiss federal diploma of vocational education and training in computer science, specialising in application development. Four years of working and studying in parallel, which is where the habit of building things end to end comes from.',
    current: true,
  },
];

export type StackGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  items: string[];
};

export const stack: StackGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    icon: TerminalSquare,
    description: 'The languages I reach for, roughly in order of how often.',
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'C#', 'Swift', 'Bash', 'PowerShell'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    icon: Layers,
    description: 'What I use to ship APIs and interfaces.',
    items: ['Next.js', 'React', 'Spring Boot', 'Express.js', 'FastAPI'],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: Database,
    description: 'Relational by default, document stores when they earn it.',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Container,
    description: 'Everything around the code that keeps a project moving.',
    items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Neovim'],
  },
];

export type Project = {
  name: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  repo: string;
  demo?: string;
  icon: LucideIcon;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: 'kyvora',
    title: 'Kyvora',
    description:
      'An open-source control plane for homelabs. One dashboard to manage, monitor and operate self-hosted infrastructure, instead of a dozen browser tabs and a pile of SSH sessions.',
    language: 'TypeScript',
    tags: ['Next.js', 'TypeScript', 'Docker', 'Self-hosted'],
    repo: 'https://github.com/hadzicni/kyvora',
    demo: 'https://kyvora.nikolahadzic.dev',
    icon: Boxes,
    featured: true,
  },
  {
    name: 'ollama-api-bruno-collection',
    title: 'Ollama API Bruno Collection',
    description:
      'A comprehensive Bruno collection for the Ollama REST API - local, on your network, or via Ollama Cloud.',
    language: 'Bruno YML',
    tags: ['Bruno Collection'],
    repo: 'https://github.com/hadzicni/ollama-api-bruno-collection',
    icon: Boxes,
  },
  {
    name: 'wordle',
    title: 'Wordle',
    description: '',
    language: 'TypeScript',
    tags: ['Next.js', 'TypeScript', 'Docker', 'Self-hosted'],
    repo: 'https://github.com/hadzicni/wordle',
    icon: WholeWord,
  },
  {
    name: 'next-404-page',
    title: 'Next 404 Page',
    description:
      'A customizable 404 page built with Next.js, designed to provide a user-friendly experience for visitors who encounter a 404 error on a website.',
    language: 'TypeScript',
    tags: ['Next.js', 'TypeScript', 'Docker', 'Self-hosted'],
    repo: 'https://github.com/hadzicni/next-404-page',
    icon: ShieldAlert,
  },
];

export const principles = [
  {
    title: 'Clean architecture',
    body: 'Boundaries that hold. Business logic that does not know or care which framework is calling it.',
  },
  {
    title: 'Readable code',
    body: 'Written once, read many times. I optimise for the person who opens the file next.',
  },
  {
    title: 'Performance that matters',
    body: 'Measure before tuning, then fix the thing that actually costs the user time.',
  },
  {
    title: 'Always learning',
    body: 'New tools get a fair trial, and are kept only when they earn their place.',
  },
];

export const navigation = [
  { href: '#whoami', label: 'whoami', index: '01' },
  { href: '#career', label: 'career', index: '02' },
  { href: '#stack', label: 'stack', index: '03' },
  { href: '#projects', label: 'projects', index: '04' },
  { href: '#contact', label: 'contact', index: '05' },
] as const;

/** Scrolling banner strings. Two rows, running in opposite directions. */
export const tickerTop = [
  'TYPESCRIPT',
  'SPRING BOOT',
  'POSTGRESQL',
  'DOCKER',
  'NEXT.JS',
  'PYTHON',
  'FASTAPI',
  'LINUX',
];

export const tickerBottom = [
  'CLEAN ARCHITECTURE',
  'READABLE CODE',
  'SHIP IT',
  'MEASURE FIRST',
  'NO MAGIC',
  'BUILD WHAT YOU LOVE',
];

/** Lines printed by the fake boot sequence before the page appears. */
export const bootLines = [
  'nh-portfolio v1.0.0 :: cold boot',
  'mounting /dev/curiosity ......... ok',
  'loading typescript runtime ...... ok',
  'loading jvm ..................... ok',
  'checking coffee levels .......... critical',
  'resolving basel, ch ............. ok',
  'starting interface .............. ok',
];

export const neofetch = {
  user: 'nikola@basel',
  rows: [
    ['OS', 'Human (developer edition)'],
    ['Host', 'Basel, Switzerland'],
    ['Shell', 'zsh + neovim'],
    ['Uptime', 'still learning'],
    ['Packages', 'typescript, java, python'],
    ['Terminal', 'always open'],
  ],
} as const;

/** Everything the interactive terminal knows how to answer. */
export const terminalHelp = [
  ['help', 'list every command'],
  ['whoami', 'the short version'],
  ['stack', 'languages, frameworks, databases, tools'],
  ['projects', 'what I have shipped'],
  ['contact', 'how to reach me'],
  ['neofetch', 'system info, sort of'],
  ['uptime', 'which build is running, and since when'],
  ['theme', 'flip between light and dark'],
  ['clear', 'wipe the screen'],
] as const;
