import { Cog, Globe, HomeIcon, LucideIcon, User } from 'lucide-react';

export type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

type AdditionalLinks = {
  title: string;
  links: LinkItem[];
};

export const defaultLinks: LinkItem[] = [
  { href: '/dashboard', title: 'Home', icon: HomeIcon },
  { href: '/account', title: 'Account', icon: User },
  { href: '/settings', title: 'Settings', icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Entities',
    links: [
      {
        href: '/employees',
        title: 'Employees',
        icon: Globe,
        adminOnly: true,
      },
      {
        href: '/performance-reviews',
        title: 'Performace Reviews',
        icon: Globe,
      },
    ],
  },
];
