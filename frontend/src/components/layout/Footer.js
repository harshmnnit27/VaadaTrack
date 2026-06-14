import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-blue-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-2">🗳️ VaadaTrack</h3>
            <p className="text-sm">Hold political parties accountable. Track election promises, verify fulfillment, demand transparency.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Explore</h3>
            <div className="flex flex-col gap-1 text-sm">
              <Link to="/parties" className="hover:text-white">Parties</Link>
              <Link to="/promises" className="hover:text-white">Promises</Link>
              <Link to="/manifestos" className="hover:text-white">Manifestos</Link>
              <Link to="/compare" className="hover:text-white">Compare</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">AI Features</h3>
            <div className="flex flex-col gap-1 text-sm">
              <Link to="/chat" className="hover:text-white">AI Chat</Link>
              <Link to="/manifestos" className="hover:text-white">Ask Manifesto</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-light mt-6 pt-4 text-sm text-center">
          VaadaTrack © {new Date().getFullYear()} — Built for transparency in Indian democracy
        </div>
      </div>
    </footer>
  );
}
