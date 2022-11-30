import { MyNavbar } from "./components";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "./styles/style.css";
import {
	HomePage,
	LoginPage,
	EarningRecordPage,
	EmployeeManagementPage,
	SchedulesPage,
	PunchPage,
	StockManagementPage,
	PurchaseRecordPage,
	StockStatusPage,
	PurchasePage,
	SuppliersPage,
	StoreManagementPage,
	SOPFormPage,
	SOPRecordsPage,
	GuidesPage,
	Logout,
	PasswordPage,
	SaleOrdersPage,
	OrdersPage,
} from "./pages";

function App() {
	return (
		<>
			<MyNavbar />
			<div className="my-5">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />

					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/sales" element={<SaleOrdersPage />} />
					<Route path="/earningRecord" element={<EarningRecordPage />} />

					<Route path="/employeeManagement" element={<EmployeeManagementPage />} />
					<Route path="/punch" element={<PunchPage />} />
					<Route path="/schedules" element={<SchedulesPage />} />

					<Route path="/stockManagement" element={<StockManagementPage />} />
					<Route path="/stockStatus" element={<StockStatusPage />} />
					<Route path="/purchase" element={<PurchasePage />} />
					<Route path="/purchaseRecord" element={<PurchaseRecordPage />} />
					<Route path="/suppliers" element={<SuppliersPage />} />

					<Route path="/storeManagement" element={<StoreManagementPage />} />
					<Route path="/SOPForm" element={<SOPFormPage />} />
					<Route path="/SOPRecord" element={<SOPRecordsPage />} />

					<Route path="/guides" element={<GuidesPage />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/password" element={<PasswordPage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
