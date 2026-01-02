import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Dashboard from "./Dashboard"
import FoodsPage from "./foodsPage"

export default function App() {
	return (
	<>
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Dashboard />}
				/>
				<Route
					path="/foods/:locations"
					element={<FoodsPage />}
				/>
			</Routes>
		</Router>
	</>
	);
}
