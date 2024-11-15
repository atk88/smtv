import React from 'react';
import { Toaster } from 'react-hot-toast';
import { VideoGrid } from './components/VideoGrid';
import { Header } from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <VideoGrid />
      <Toaster position="bottom-center" />
    </div>
  );
}