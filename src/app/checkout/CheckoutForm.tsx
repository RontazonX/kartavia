'use client'

import { useState } from 'react'
import { MapPin, Calendar, Users, ShieldCheck, CreditCard, Mail, Check, Wallet, QrCode, Landmark, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { processPayment, confirmPayment } from './actions'
import PhoneInput from './PhoneInput'
import Button from '@/components/ui/button/Button'

export default function CheckoutForm({ user, detail, destination_id, date, guests, total_price }: any) {
  const [state, setState] = useState<{ success?: boolean; bookingId?: string; method?: string; error?: string } | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    const result = await processPayment(null, formData)
    setState(result)
    setIsPending(false)
  }

  const handleConfirm = async () => {
    if (!state?.bookingId) return
    setIsConfirming(true)
    
    // Simulate payment processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success state in modal
    setPaymentSuccess(true)
    
    // Wait 1.5 seconds so user can see the success state
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    await confirmPayment(state.bookingId)
  }

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32">
        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Checkout</h1>
        
        <form action={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          <input type="hidden" name="destination_id" value={destination_id} />
          <input type="hidden" name="booking_date" value={date} />
          <input type="hidden" name="guests" value={guests} />
          <input type="hidden" name="total_price" value={total_price} />
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-foreground mb-8">Payment Method</h2>
              
              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Holder</label>
                    <div className="flex items-center border border-gray-200 rounded-2xl p-3 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <Users className="h-5 w-5 text-gray-900 mr-2.5 shrink-0" strokeWidth={1.5} />
                      <input type="text" name="holder_name" defaultValue={user.user_metadata?.full_name || user.email?.split('@')[0]} className="w-full bg-transparent focus:outline-none text-[15px] text-gray-900 font-medium truncate" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                    <div className="flex items-center border border-gray-200 rounded-2xl p-3 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <Mail className="h-5 w-5 text-gray-900 mr-2.5 shrink-0" strokeWidth={1.5} />
                      <input type="email" name="contact_email" defaultValue={user.email} className="w-full bg-transparent focus:outline-none text-[15px] text-gray-900 font-medium truncate" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone number</label>
                    <PhoneInput />
                  </div>
                </div>
              </div>



              {/* Select Method */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Select Method</h3>
                
                {/* E-Wallet */}
                <div className="mb-4 rounded-2xl border border-gray-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mr-3"></div>
                      <span className="font-semibold text-sm text-gray-800">E-Wallet</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="dana" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Wallet className="w-7 h-7 text-blue-500" />
                        <span className="font-semibold text-gray-800 text-sm">DANA</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>
                    
                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="gopay" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Wallet className="w-7 h-7 text-green-500" />
                        <span className="font-semibold text-gray-800 text-sm">GoPay</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>

                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="shopeepay" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Wallet className="w-7 h-7 text-orange-500" />
                        <span className="font-semibold text-gray-800 text-sm">ShopeePay</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>
                    
                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="ovo" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Wallet className="w-7 h-7 text-purple-600" />
                        <span className="font-semibold text-gray-800 text-sm">OVO</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>

                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="qris" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <QrCode className="w-7 h-7 text-red-500" />
                        <span className="font-semibold text-gray-800 text-sm">QRIS</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="mb-4 rounded-2xl border border-gray-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 mr-3"></div>
                      <span className="font-semibold text-sm text-gray-800">Bank Transfer</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="bca" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Landmark className="w-7 h-7 text-blue-700" />
                        <span className="font-semibold text-gray-800 text-sm">BCA</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>

                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="mandiri" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <Landmark className="w-7 h-7 text-yellow-500" />
                        <span className="font-semibold text-gray-800 text-sm">Mandiri</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* International Tourist Options */}
                <div className="mb-4 rounded-2xl border border-gray-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 mr-3"></div>
                      <span className="font-semibold text-sm text-gray-800">International Tourists</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="credit_card" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center text-gray-500">
                        <CreditCard className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-bold tracking-tight">Credit Card</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>

                    <label className="relative flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 bg-white aspect-[4/3]">
                      <input type="radio" name="payment_method" value="paypal" className="peer hidden" required />
                      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-1.5">
                        <CreditCard className="w-7 h-7 text-blue-500" />
                        <span className="font-semibold text-gray-800 text-sm">PayPal</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    </label>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Order Summary (Right) */}
          <div className="lg:w-[380px]">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 md:p-8">
                <div className="text-xs text-gray-500 mb-1">Order ID</div>
                <div className="font-semibold text-gray-900 mb-5">ID-KTVA-{destination_id.substring(0,6).toUpperCase()}</div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-xl bg-gray-200 relative overflow-hidden shrink-0 shadow-inner">
                     {detail.image_url ? (
                       <Image width={100} height={100} src={detail.image_url} alt={detail.title} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                     )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-tight line-clamp-2">{detail.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center font-medium">
                      <MapPin className="h-3 w-3 mr-1 text-primary" /> {detail.location}
                    </p>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Payment Summary</h4>
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <div>
                      <div className="font-medium text-gray-800 line-clamp-1">{detail.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{guests} {Number(guests) === 1 ? 'Guest' : 'Guests'} x Rp {Number(detail.price).toLocaleString('id-ID')}</div>
                    </div>
                    <span className="font-medium">Rp {Number(total_price).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-gray-400">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-primary text-xl tracking-tight">Rp {Number(total_price).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button disabled={isPending} type="submit" className="w-full bg-primary text-white font-bold text-base py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 cursor-pointer flex items-center justify-center active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : `Pay Rp ${Number(total_price).toLocaleString('id-ID')}`}
                </button>
                <div className="mt-5 flex items-center justify-center text-xs font-medium text-gray-400">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Payments are secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Payment Modal Popup */}
        {state?.success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <button onClick={() => setState(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8 flex flex-col items-center text-center transition-all">
                {paymentSuccess ? (
                  <div className="py-8 flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500 text-sm">Redirecting to your booking details...</p>
                  </div>
                ) : (
                  <>
                    {state.method === 'qris' ? (
                      <>
                        <QrCode className="w-16 h-16 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Scan to Pay</h3>
                        <p className="text-gray-500 text-sm mb-6">Open your GoPay, OVO, DANA, or mobile banking app and scan this QR code to complete the payment.</p>
                        
                        {/* Mock QR Code Image */}
                        <div className="w-48 h-48 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <QrCode className="w-24 h-24 text-gray-400" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-16 h-16 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                        <p className="text-gray-500 text-sm mb-6">You selected <strong>{state.method?.toUpperCase()}</strong>. Please follow the instructions in your provider's app to complete the transaction.</p>
                      </>
                    )}

                    <Button onClick={handleConfirm} disabled={isConfirming} className="w-full py-4 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white border-none">
                      {isConfirming ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2 inline" /> Processing Payment...</>
                      ) : (
                        'I have completed payment'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

