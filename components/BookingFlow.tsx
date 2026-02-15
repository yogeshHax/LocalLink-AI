import React, { useState } from 'react';
import { User, Skill, TransactionType } from '../types';
import { X, Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';

interface BookingFlowProps {
  skill: Skill;
  provider: User;
  seeker: User;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ skill, provider, seeker, onClose, onConfirm }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState('');
  const [paymentType, setPaymentType] = useState<TransactionType | null>(null);

  const canAffordCredits = seeker.credits >= skill.creditValue;

  const handleConfirm = () => {
    setStep(3);
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            {step === 1 && "Schedule Session"}
            {step === 2 && "Payment Method"}
            {step === 3 && "Booking Confirmed"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img src={provider.avatar} className="w-12 h-12 rounded-full object-cover" alt="provider" />
                <div>
                  <p className="text-sm text-gray-500">Service provided by</p>
                  <p className="font-bold text-gray-900">{provider.name}</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-1">{skill.name}</h4>
                <p className="text-sm text-indigo-700">{skill.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="datetime-local" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)} 
                disabled={!date}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">Choose how you want to exchange value for this service.</p>
              
              {/* Option: Monetary */}
              <div 
                onClick={() => setPaymentType(TransactionType.MONETARY)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentType === TransactionType.MONETARY ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-bold text-gray-900">Direct Payment</span>
                  </div>
                  <span className="font-bold text-gray-900">${skill.hourlyRate}</span>
                </div>
                <p className="text-xs text-gray-500 ml-7">Secure payment via Stripe</p>
              </div>

              {/* Option: Credits */}
              <div 
                onClick={() => canAffordCredits && setPaymentType(TransactionType.CREDIT)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                  !canAffordCredits ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50' :
                  paymentType === TransactionType.CREDIT ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-bold text-gray-900">Skill Credits</span>
                  </div>
                  <span className="font-bold text-purple-600">{skill.creditValue} Credits</span>
                </div>
                <p className="text-xs text-gray-500 ml-7">Your Balance: {seeker.credits} Credits</p>
                
                {!canAffordCredits && (
                  <div className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    Insufficient Balance
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button 
                  onClick={handleConfirm}
                  disabled={!paymentType}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Booking
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 text-sm mt-3 hover:text-gray-800"
                >
                  Back to Scheduling
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Requested!</h4>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a notification to {provider.name}. Funds are held in escrow until completion.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
                <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
                <p><strong>Method:</strong> {paymentType === TransactionType.MONETARY ? 'Credit Card' : 'Skill Credits'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;