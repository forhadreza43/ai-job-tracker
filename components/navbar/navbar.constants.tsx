import { LayoutDashboard} from 'lucide-react';

export type MenuItem = {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
};

export const logo = {
  url: '/logo.png',
  alt: 'Brang Logo',
  title: 'APPLI-TRACT',
  subtitle: 'AI Personal Assistant',
  width: 32,
  height: 32,
};

export const menu: MenuItem[] = [
  // { title: 'Home', url: '/', icon: <House size={16} /> },
  // { title: 'Jobs', url: '/jobs', icon: <UsersRound size={16} /> },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <LayoutDashboard size={16} />,
  },
];

export const auth = {
  login: { title: 'Login', url: '/login' },
  signup: { title: 'Sign up', url: '/signup' },
};
