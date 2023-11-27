import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-slate-50 flex flex-col h-screen">
      <div className="p-6">
        <Link
          to={"/"}
          className="uppercase text-2xl tracking-wide font-light text-teal-900 border-b-2 border-teal-500"
        >
          Karma
        </Link>
      </div>
      <div className="flex-1">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
}
