// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Главная',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Токены',
    path: '/dashboard/token',
    icon: icon('ic_user'),
  },
  {
    title: 'Категории',
    path: '/dashboard/category',
    icon: icon('ic_cart'),
  },
  {
    title: 'Статьи',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Авторизация',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
