import type { LucideIcon } from 'lucide-react';
import { Boxes, Container, Database, Layers, TerminalSquare } from 'lucide-react';

export const profile = {
  name: 'Nikola Hadzic',
  handle: 'hadzicni',
  role: 'Software Developer',
  location: 'Basel, Switzerland',
  email: 'nikolahadzic7@icloud.com',
  website: 'https://nikolahadzic.dev',
  github: 'https://github.com/hadzicni',
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
 * Everything marked `20XX` is a placeholder — replace those with your real
 * dates, and fill in the education entry, before this goes live.
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
    kind: 'work',
    period: '20XX — present',
    title: 'Software Developer',
    organisation: 'University Hospital Basel',
    location: 'Basel, Switzerland',
    current: true,
    summary:
      'Build and maintain internal applications that clinical and administrative staff rely on during their working day.',
    highlights: [
      'Full stack work end to end, from the database schema and the API to the interface.',
      'Keep long-lived applications maintainable through clear boundaries and consistent structure.',
      'Containerise services and automate builds and releases with Docker and GitHub Actions.',
    ],
  },
  {
    kind: 'education',
    period: '20XX — 20XX',
    title: 'PLACEHOLDER — your qualification',
    organisation: 'PLACEHOLDER — school or university',
    location: 'Switzerland',
    summary:
      'PLACEHOLDER — one sentence on the focus of the programme, or delete this entry.',
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
    name: 'ssh-tunnel-pwsh',
    title: 'SSH Tunnel for PowerShell',
    description:
      'A straightforward PowerShell helper for opening and managing SSH tunnels on Windows.',
    language: 'PowerShell',
    tags: ['PowerShell', 'Networking'],
    repo: 'https://github.com/hadzicni/ssh-tunnel-pwsh',
    icon: TerminalSquare,
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
  ['theme', 'flip between light and dark'],
  ['clear', 'wipe the screen'],
] as const;
