/**
 * Main App component
 */

import { useEffect } from 'react';
import { useAuth } from './hook/useAuth';
import { useWebSocket } from './hook/useWebSocket';

function App() {
  const { authState, isAuthenticated, connectionStatus, qrCode } = useAuth();
  const { isConnected } = useWebSocket();

  useEffect(() => {
    document.title = 'WhatsApp MCP Client';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              WhatsApp MCP Client
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'ready' || connectionStatus === 'connected'
                    ? 'bg-green-500'
                    : connectionStatus === 'connecting'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  WhatsApp: {connectionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated && qrCode && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Scan QR Code to Authenticate
            </h2>
            <div className="flex justify-center">
              <img
                src={qrCode}
                alt="WhatsApp QR Code"
                className="border-4 border-gray-300 rounded"
              />
            </div>
            <p className="text-gray-600 mt-4">
              Open WhatsApp on your phone and scan this code
            </p>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold mb-4">
              ✅ Connected to WhatsApp
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Status:</strong> {connectionStatus}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {authState?.phoneNumber || 'Not available'}
              </p>
              <p className="text-gray-600">
                <strong>Last Connected:</strong>{' '}
                {authState?.lastConnected
                  ? new Date(authState.lastConnected).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Full chat interface coming soon! For now, use the MCP tools through Claude Desktop.
              </p>
            </div>
          </div>
        )}

        {!isAuthenticated && !qrCode && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Connecting to backend...
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Phase 4 - Frontend Foundation
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>✅ Redux Toolkit store configured</p>
            <p>✅ REST API client with Axios</p>
            <p>✅ WebSocket client for real-time updates</p>
            <p>✅ Authentication state management</p>
            <p>🚧 Chat and message UI components (coming next)</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
