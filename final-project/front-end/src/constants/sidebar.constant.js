import Profile from '../components/pages/User/Profile/Profile';
import ChangePassword from '../components/pages/User/ChangePassword/ChangePassword';

import MoneyCounting from '../components/pages/Cashier/MoneyCounting/MoneyCounting';
import InventoryRequesting from '../components/pages/Cashier/InventoryRequesting/InventoryRequesting';

import ProductManagement from '../components/pages/Importer/ProductManagment/ProductManagement';

import Reporting from '../components/pages/Manager/Reporting/Reporting';
import StaffManagement from '../components/pages/Manager/StaffManagement/StaffManagement';
import WorkAssignment from '../components/pages/Manager/WorkAssignment/WorkAssignment';
import SupplierManagement from '../components/pages/Manager/SupplierManagement/SupplierManagement';

import {
  DollarOutlined, QuestionCircleOutlined, InboxOutlined, BarChartOutlined, TeamOutlined, FileDoneOutlined, UserOutlined, LockOutlined, ShopOutlined
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
        title: 'Tính tiền cho khách',
        path: '/money-counting',
        icon: DollarOutlined,
        component: MoneyCounting
      },
      {
        title: 'Yêu cầu nhập hàng',
        path: '/inventory-requesting',
        icon: QuestionCircleOutlined,
        component: InventoryRequesting
      }
    ]
  },
  {
    role: "IMPORTER",
    pages: [
      {
        title: 'Quản lý sản phẩm',
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
        title: 'Quản lý nhân viên',
        path: '/staffs',
        icon: TeamOutlined,
        component: StaffManagement
      },
      {
        title: 'Phân ca làm việc',
        path: '/work-assignment',
        icon: FileDoneOutlined,
        component: WorkAssignment
      },
      {
        title: 'Liên hệ nhà cung cấp',
        path: '/suppliers',
        icon: ShopOutlined,
        component: SupplierManagement
      },
      {
        title: 'Báo cáo - thống kê',
        path: '/reporting',
        icon: BarChartOutlined,
        component: Reporting
      }
    ]
  }
];