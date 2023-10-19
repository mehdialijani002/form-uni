import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorBoundary from "./component/ErrorBoundry/errorBoundry.component";
const FormInput = lazy(() => import("./component/form/form.component"));
const Login = lazy(() => import("./component/login/login.component"));
const FormTable = lazy(() =>
  import("./component/formTable/formTable.component")
);
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense
          fallback={<div className="text-center mt-2">در حال بارگزاری...</div>}
        >
          <Routes>
            <Route path="/" element={<FormInput />} />
            <Route path="/form-table" element={<FormTable />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
