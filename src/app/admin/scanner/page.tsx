'use client'

import React, { useState } from 'react'
import { ScanLine, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { checkTicket, markTicketUsed } from './actions'

export default function TicketScannerPage() {
  const [bookingId, setBookingId] = useState('')
  const [ticketData, setTicketData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingId.trim()) return

    setLoading(true)
    setError('')
    setTicketData(null)

    const res = await checkTicket(bookingId.trim())
    if (res.error) {
      setError(res.error)
    } else {
      setTicketData(res.data)
    }
    setLoading(false)
  }

  const handleMarkUsed = async () => {
    if (!ticketData || ticketData.status !== 'paid') return
    
    setActionLoading(true)
    const res = await markTicketUsed(ticketData.id)
    if (res.error) {
      setError(res.error)
    } else {
      setTicketData({ ...ticketData, status: 'used' })
    }
    setActionLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-primary" />
            E-Ticket Scanner
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Scan QR code or manually input Booking ID to verify tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Input Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Verify Ticket</h2>
            
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Booking ID
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:text-white font-mono text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !bookingId.trim()}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? 'Checking...' : 'Check Ticket'}
              </button>
            </form>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
            <strong>Pro Tip:</strong> Most 2D barcode scanners can act as a keyboard input. Focus the input field above and scan the QR code to automatically enter the ID and submit.
          </div>
        </div>

        {/* Result Section */}
        <div className="md:col-span-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-800 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <XCircle className="w-12 h-12 mb-3" />
              <h3 className="text-lg font-bold mb-1">Verification Failed</h3>
              <p>{error}</p>
            </div>
          )}

          {!error && !ticketData && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-slate-500">
              <ScanLine className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter a Booking ID to see ticket details here.</p>
            </div>
          )}

          {ticketData && (
            <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 ${
              ticketData.status === 'paid' ? 'border-green-500' :
              ticketData.status === 'used' ? 'border-slate-300 dark:border-slate-600' :
              'border-orange-500'
            }`}>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Ticket Details</h2>
                  <p className="text-sm font-mono text-slate-500 mt-1">{ticketData.id}</p>
                </div>
                
                {ticketData.status === 'paid' && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> VALID
                  </div>
                )}
                {ticketData.status === 'used' && (
                  <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> USED
                  </div>
                )}
                {ticketData.status === 'pending' && (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> PENDING
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Destination</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{ticketData.destinations?.title}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Date</p>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {new Date(ticketData.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Guests</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{ticketData.guests} Person(s)</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Customer</p>
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {ticketData.users?.raw_user_meta_data?.full_name || ticketData.users?.email}
                  </p>
                </div>
              </div>

              {ticketData.status === 'paid' && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-400">Ready to Check-in</h4>
                    <p className="text-sm text-green-600 dark:text-green-500 mt-1">Ticket is valid for entry.</p>
                  </div>
                  <button
                    onClick={handleMarkUsed}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center"
                  >
                    {actionLoading ? 'Processing...' : 'Mark as Used'} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

              {ticketData.status === 'used' && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-center text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Ticket Already Used</h4>
                    <p className="text-sm mt-0.5">This ticket was previously scanned and cannot be used again.</p>
                  </div>
                </div>
              )}

              {ticketData.status === 'pending' && (
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/50 p-4 rounded-xl flex items-center text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Unpaid Booking</h4>
                    <p className="text-sm mt-0.5">This ticket has not been paid for and is invalid for entry.</p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  )
}
