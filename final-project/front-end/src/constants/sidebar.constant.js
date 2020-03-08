import WorkSchedule from '../components/pages/User/WorkSchedule/WorkSchedule';

import MoneyCounting from '../components/pages/Cashier/MoneyCounting/MoneyCounting';
import InventoryRequesting from '../components/pages/Cashier/InventoryRequesting/InventoryRequesting';

import ProductManagement from '../components/pages/Importer/ProductManagment/ProductManagement';

import Reporting from '../components/pages/Manager/Reporting/Reporting';
import StaffManagement from '../components/pages/Manager/StaffManagement/StaffManagement';
import WorkAssignment from '../components/pages/Manager/WorkAssignment/WorkAssignment';
import SupplierManagement from '../components/pages/Manager/SupplierManagement/SupplierManagement';

import {
  DollarOutlined, QuestionCircleOutlined, CalendarOutlined, InboxOutlined, BarChartOutlined, TeamOutlined, FileDoneOutlined, RocketOutlined,
} from '@ant-design/icons';

export default [
  {
    role: 'USER',
    pages: [
      {
        title: 'Lịch làm việc',
        path: '/working-schedule',
        icon: CalendarOutlined,
        component: WorkSchedule
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
        title: 'Báo cáo - Thống kê',
        path: '/reporting',
        icon: BarChartOutlined,
        component: Reporting
      },
      {
        title: 'Quản lý nhân sự',
        path: '/staffs',
        icon: TeamOutlined,
        component: StaffManagement
      },
      {
        title: 'Phân công làm việc',
        path: '/work-assignment',
        icon: FileDoneOutlined,
        component: WorkAssignment
      },
      {
        title: 'Nhà cung cấp',
        path: '/suppliers',
        icon: RocketOutlined,
        component: SupplierManagement
      }
    ]
  }
];