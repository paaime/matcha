import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const routes = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Get a high level overview of your business.',
  },
  {
    name: 'Team',
    href: '/team',
    icon: UsersIcon,
    description: 'Manage your team members and their roles.',
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderIcon,
    description: 'Manage your projects and project members.',
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon,
    description: 'Schedule a meeting.',
  },
  {
    name: 'Subscriptions',
    href: '/subscriptions',
    icon: DocumentDuplicateIcon,
    description: 'Manage your subscriptions.',
  },
  {
    name: 'Subscriber Only',
    href: '/subscriber-only',
    icon: ChartPieIcon,
    description: 'Get detailed reports.',
  },
];
