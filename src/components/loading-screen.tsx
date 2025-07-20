import { Loader2, Code } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            {/* Pulsing animation overlay */}
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loading Snipkit
          </span>
        </div>
        
        {/* Progress bar animation */}
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto mb-4">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse transform translate-x-0 transition-transform duration-1000"></div>
        </div>
        
        <p className="text-sm text-gray-400 animate-pulse">
          Setting up your coding workspace...
        </p>
      </div>
    </div>
  );
}
