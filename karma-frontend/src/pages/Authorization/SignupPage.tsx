import { Link } from "react-router-dom";
import SignupForm from "../../components/SignupForm";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";

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
      <div className="flex-1 flex flex-col items-center pt-32 bg-gray-50">
        <h2 className="text-3xl font-semibold mb-8">Sign up</h2>
        <SignupForm />
        <p className="text-slate-600 text-sm mt-6 text-center">
          Already have an account?
          <Link to={"/login"}>
            <Button variant={"link"}>Log in here</Button>
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
