import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden w-full max-w-xl min-h-[500px]">
        <div className="flex flex-col flex-1 w-full p-8 md:p-12">
          <div className="w-full mb-8">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
          
          <div className="flex flex-col justify-center flex-1 w-full">
            <div className="mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-3xl sm:text-4xl">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
