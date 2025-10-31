import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, AlertCircle } from 'lucide-react';
import ChatSupport from '../components/ChatSupport';

const Support = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I book a ride?',
      answer: 'Tap "Book a Ride" on your dashboard, select your pickup and dropoff locations, choose your ride type, and confirm. A driver will be assigned shortly.',
    },
    {
      id: 2,
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, digital wallets, and cash payments. You can manage your payment methods in your account settings.',
    },
    {
      id: 3,
      question: 'How do I rate my driver?',
      answer: 'After each ride, you\'ll receive a prompt to rate your driver and share feedback. Your rating helps us maintain service quality.',
    },
    {
      id: 4,
      question: 'Can I schedule a ride in advance?',
      answer: 'Yes! You can schedule rides up to 30 days in advance. Select "Schedule for Later" when booking a ride.',
    },
    {
      id: 5,
      question: 'What should I do if I left something in the car?',
      answer: 'Contact your driver directly through the app within 24 hours. If you can\'t reach them, contact our support team for assistance.',
    },
    {
      id: 6,
      question: 'How are fares calculated?',
      answer: 'Fares are based on distance, time, demand, and ride type. The estimated fare is shown before you book, and the final charge may vary slightly based on actual route.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <img src="/uber-logo.png" alt="Uber" className="h-8 w-auto" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Support & Help</h1>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Chat Support */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Chat Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant help from our support team
            </p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Start Chat
            </button>
          </div>

          {/* Phone Support */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
            <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us 24/7 for assistance
            </p>
            <a href="tel:+923061001040" className="w-full block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
              +92-3061001040
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
            <Mail className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send us an email with your concern
            </p>
            <a href="mailto:support@uberpk.com" className="w-full block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              support@uberpk.com
            </a>
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-12">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">Emergency Support</h3>
              <p className="text-red-800 text-sm">
                For emergencies, please call 911 or your local emergency number first, then contact us at <strong>+92-3061001040</strong>
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition group cursor-pointer"
              >
                <summary className="font-semibold text-gray-900 flex justify-between items-center">
                  {faq.question}
                  <span className="text-gray-600 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </main>

      {/* Chat Support Modal */}
      <ChatSupport isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Support;
