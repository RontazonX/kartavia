import Link from "next/link";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden w-full max-w-xl min-h-[500px]">
        <div className="flex flex-col flex-1 w-full p-8 md:p-12">
          
          <div className="flex flex-col justify-center flex-1 w-full">
            <div className="mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-3xl sm:text-4xl">
                Update Password
              </h1>
              <p className="text-sm text-gray-500">
                Please enter your new secure password below.
              </p>
            </div>
            
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
