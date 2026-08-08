'use client'

import { useState } from 'react'
import { QrCode, CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { confirmPayment } from '../../actions'
import Button from '@/components/ui/button/Button'

export default function PaymentForm({ bookingId }: { bookingId: string }) {
  const [selectedMethod, setSelectedMethod] = useState('qris')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Call server action to mark as paid
    await confirmPayment(bookingId)
  }

  const methods = [
    { id: 'qris', title: 'QRIS', icon: QrCode, desc: 'Pay with Gopay, OVO, Dana, LinkAja, BCA Mobile, etc.' },
    { id: 'card', title: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB, Amex.' },
    { id: 'wallet', title: 'E-Wallet', icon: Wallet, desc: 'Gopay, OVO, ShopeePay.' },
    { id: 'va', title: 'Virtual Account', icon: Smartphone, desc: 'BCA, Mandiri, BNI, BRI.' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Select Payment Method</h2>
        <p className="text-sm text-gray-500">Powered by Midtrans Simulation</p>
      </div>
      
      <div className="p-6 space-y-4">
        {methods.map(method => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <div 
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${isSelected ? 'text-brand-900' : 'text-gray-900'}`}>{method.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
              </div>
              <div className="pt-2">
                 <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                 </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="p-6 bg-gray-50/50 border-t border-gray-100">
        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="w-full py-4 text-lg"
        >
          {isProcessing ? 'Processing Payment...' : `Pay Securely with ${methods.find(m => m.id === selectedMethod)?.title}`}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3" /> This is a sandbox environment. No real money will be charged.
        </p>
      </div>
    </div>
  )
}
