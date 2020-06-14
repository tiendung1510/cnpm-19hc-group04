import Profile from '../components/pages/User/Profile/Profile';
import ChangePassword from '../components/pages/User/ChangePassword/ChangePassword';

import CheckoutPanel from '../components/pages/Cashier/CheckoutPanel/CheckoutPanel';

import ProductManagement from '../components/pages/Importer/ProductManagment/ProductManagement';

import Reporting from '../components/pages/Manager/Reporting/Reporting';
import StaffManagement from '../components/pages/Manager/StaffManagement/StaffManagement';
import WorkAssignment from '../components/pages/Manager/WorkAssignment/WorkAssignment';
import ImportingRequest from '../components/pages/Manager/ImportingRequest/ImportingRequest';

import {
  DollarOutlined, InboxOutlined, BarChartOutlined, TeamOutlined, FileDoneOutlined, UserOutlined, LockOutlined, MessageOutlined
} from '@ant-design/icons';

export default [
  {
    role: 'USER',
    pages: [
      {
        title: 'Thông tin cá nhân',
        path: '/profile',
        icon: UserOutlined,
        component: Profile,
        key: 'PROFILE'
      },
      {
        title: 'Đổi mật khẩu',
        path: '/change-password',
        icon: LockOutlined,
        component: ChangePassword,
        key: 'CHANGE_PASSWORD'
      }
    ]
  },
  {
    role: "CASHIER",
    pages: [
      {
        title: 'Quầy thu ngân',
        path: '/checkout',
        icon: DollarOutlined,
        component: CheckoutPanel
      }
    ]
  },
  {
    role: "IMPORTER",
    pages: [
      {
        title: 'Quản lý kho hàng',
        path: '/products',
        icon: InboxOutlined,
        component: ProductManagement
      }
    ]
  },
  {
    role: "MANAGER",
    pages: [
      {
        title: 'Báo cáo - Thống kê',
        path: '/reports',
        icon: BarChartOutlined,
        component: Reporting
      },
      {
        title: 'Tổ chức nhân sự',
        path: '/staffs',
        icon: TeamOutlined,
        component: StaffManagement
      },
      {
        title: 'Phân ca làm việc',
        path: '/work-assignments',
        icon: FileDoneOutlined,
        component: WorkAssignment
      },
      {
        title: 'Yêu cầu nhập hàng',
        path: '/importing-requests',
        icon: MessageOutlined,
        component: ImportingRequest
      }
    ]
  }
];