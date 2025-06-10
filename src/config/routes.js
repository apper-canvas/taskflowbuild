import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import NotesPage from '@/components/pages/NotesPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: HomePage
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    path: '/notes',
    icon: 'FileText',
    component: NotesPage
  }
};

export const routeArray = Object.values(routes);