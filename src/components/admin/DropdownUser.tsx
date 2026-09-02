"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative">
      <Link prefetch={false}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Admin Kartavia
          </span>
          <span className="block text-xs text-slate-500">Super Admin</span>
        </span>

        <span className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          A
        </span>

        <ChevronDown className="hidden fill-current sm:block w-4 h-4 text-slate-500" />
      </Link>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-lg border border-slate-200 bg-white shadow-default dark:border-slate-800 dark:bg-slate-900`}
        >
          <ul className="flex flex-col gap-5 border-b border-slate-200 dark:border-slate-800 px-6 py-7.5">
            <li>
              <Link prefetch={false}
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-slate-600 dark:text-slate-300"
              >
                <User className="h-5 w-5" />
                My Profile
              </Link>
            </li>
            <li>
              <Link prefetch={false}
                href="/admin/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-slate-600 dark:text-slate-300"
              >
                <Settings className="h-5 w-5" />
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
