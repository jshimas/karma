import { Link } from "react-router-dom";
import SignupForm from "../../components/SignupForm";
import Footer from "../../components/Footer";
import { Toaster } from "../../components/ui/Toast/Toaster";

export default function SignupPage() {
  return (
    <div className="bg-slate-50 flex flex-col h-screen font-nunito">
      <div className="p-6">
        <Link
          to={"/"}
          className="uppercase text-2xl tracking-wide font-light text-teal-900 border-b-2 border-teal-500"
        >
          Karma
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <SignupForm />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
