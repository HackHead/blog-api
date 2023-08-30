// component
import { HomeIcon, KeyIcon, GlobeAltIcon, QueueListIcon, DocumentTextIcon, IdentificationIcon } from '@heroicons/react/24/solid'
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'Главная',
  //   path: '/dashboard/app',
  //   icon: <HomeIcon style={{width: '22px', height: '22px'}}/>,
  // },
  {
    title: 'Токены',
    path: '/token',
    icon: <KeyIcon style={{width: '22px', height: '22px'}}/>,
  },
  {
    title: 'домены',
    path: '/domain',
    icon: <GlobeAltIcon style={{width: '22px', height: '22px'}}/>,
  },
  {
    title: 'Категории',
    path: '/category',
    icon: <QueueListIcon style={{width: '22px', height: '22px'}}/>,
  },
  {
    title: 'Статьи',
    path: '/article',
    icon: <DocumentTextIcon style={{width: '22px', height: '22px'}}/>,
  },
  
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
