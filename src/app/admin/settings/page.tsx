import Link from 'next/link'
import { User, Mail, Edit, Upload, Save } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white text-2xl">
          Settings
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium text-gray-500 hover:text-primary dark:text-gray-400" href="/admin">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Settings</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-gray-200 py-4 px-7 dark:border-slate-800">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <User className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary pl-12"
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Admin"
                        defaultValue={user?.user_metadata?.first_name || 'Admin'}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <User className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary pl-12"
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Kartavia"
                        defaultValue={user?.user_metadata?.last_name || 'Kartavia'}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 mb-6">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary pl-12"
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="admin@kartavia.com"
                      defaultValue={user?.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    className="flex justify-center rounded-lg border border-gray-300 py-2 px-6 font-medium text-black hover:shadow-1 dark:border-slate-700 dark:text-white"
                    type="submit"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded-lg bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-gray-200 py-4 px-7 dark:border-slate-800">
              <h3 className="font-medium text-black dark:text-white">
                Your Photo
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                    {user?.user_metadata?.first_name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <span className="mb-1.5 text-black dark:text-white font-medium block">
                      Edit your photo
                    </span>
                    <span className="flex gap-2">
                      <button className="text-sm hover:text-primary dark:text-gray-400">
                        Delete
                      </button>
                      <button className="text-sm hover:text-primary dark:text-gray-400">
                        Update
                      </button>
                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-lg border-2 border-dashed border-primary bg-gray-50 py-4 px-4 dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-700">
                      <Upload className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                    </span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      (max, 800 X 800px)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="flex justify-center rounded-lg border border-gray-300 py-2 px-6 font-medium text-black hover:shadow-1 dark:border-slate-700 dark:text-white"
                    type="submit"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded-lg bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
