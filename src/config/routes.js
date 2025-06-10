import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Home
  }
};

export const routeArray = Object.values(routes);