import React, { useState } from 'react';
import { AlertCircle, Phone, Heart, MessageCircle } from 'lucide-react';

const EmergencyHelp: React.FC = () => {
  const [alertSent, setAlertSent] = useState(false);

  const sendEmergencyAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000); // Reset after 5 seconds
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Help</h1>
        <p className="text-gray-600">Get immediate assistance when you need it most</p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-8">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">In Case of Emergency</h2>
            <p className="text-red-700">
              If you are in immediate danger or require urgent help, please contact your local emergency
              services immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={sendEmergencyAlert}
          className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Send Emergency Alert
        </button>
        {alertSent && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg animate-pulse">
            🚨 Alert sent to your emergency contacts!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Phone className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Services</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="font-medium mr-2">United States:</span>
              <a href="tel:911" className="text-blue-600 hover:text-blue-800">911</a>
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-2">United Kingdom:</span>
              <a href="tel:112" className="text-blue-600 hover:text-blue-800">112</a>
            </li>
            <li className="flex items-center">
              <span className="font-medium mr-2">India:</span>
              <a href="tel:112" className="text-blue-600 hover:text-blue-800">112</a>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Heart className="w-8 h-8 text-pink-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health Support</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Lifeline (US):</span>
              <br />
              <a href="tel:18002738255" className="text-blue-600 hover:text-blue-800">
                1-800-273-TALK (8255)
              </a>
            </li>
            <li>
              <span className="font-medium">Samaritans (UK):</span>
              <br />
              <a href="tel:116123" className="text-blue-600 hover:text-blue-800">116 123</a>
            </li>
            <li>
              <span className="font-medium">iCall (India):</span>
              <br />
              <a href="tel:+919152987821" className="text-blue-600 hover:text-blue-800">
                +91 9152987821
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start">
          <MessageCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Additional Support</h3>
            <p className="text-blue-800">
              Remember, you can always reach out to a mental health helpline or a trusted friend.
              You're not alone, and help is available 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyHelp;