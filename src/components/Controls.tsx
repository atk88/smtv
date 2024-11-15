import React, { useState } from 'react';
import { Play, Pause, Trash2, Save, Video, Sun, Moon, Star } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import toast from 'react-hot-toast';

export function Controls() {
  const [count, setCount] = useState(1);
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { addVideos, playAll, pauseAll, clearAll, saveLayout, fetchLiveVideo } = useVideoStore();

  const handleGenerate = () => {
    if (!url) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    try {
      const videoId = extractVideoId(url);
      if (!videoId) throw new Error('Invalid YouTube URL');
      addVideos(videoId, count);
      toast.success('Videos generated successfully');
    } catch (error) {
      toast.error('Invalid YouTube URL');
    }
  };

  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v") || urlObj.pathname.split('/').pop();
    } catch {
      return null;
    }
  };

  const handleLiveVideo = async (channelId: string, name: string) => {
    try {
      const videoId = await fetchLiveVideo(channelId);
      if (videoId) {
        addVideos(videoId, count);
        toast.success(`${name} videos added`);
      } else {
        toast.error(`${name} stream not available`);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${name} stream`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        max="160"
        value={count}
        onChange={(e) => setCount(Math.min(160, Math.max(1, parseInt(e.target.value) || 1)))}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded px-2 py-1 w-14 text-white text-sm focus:outline-none focus:border-blue-400/40 transition-all duration-200"
        placeholder="Count"
      />
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105 -translate-y-0.5' : ''}`}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded px-2 py-1 w-48 text-white text-sm focus:outline-none focus:border-blue-400/40 transition-all duration-200"
          placeholder="YouTube URL"
        />
      </div>
      <div className="flex gap-1">
        <Button onClick={handleGenerate} icon={<Video size={14} />} variant="gradient" size="sm">Add</Button>
        <Button onClick={playAll} icon={<Play size={14} />} variant="gradient" size="sm">Play</Button>
        <Button onClick={pauseAll} icon={<Pause size={14} />} variant="gradient" size="sm">Pause</Button>
        <Button onClick={clearAll} icon={<Trash2 size={14} />} variant="gradient" size="sm">Clear</Button>
        <Button onClick={saveLayout} icon={<Save size={14} />} variant="gradient" size="sm">Save</Button>
        <Button onClick={() => addVideos('ZzWBpGwKoaI', count)} icon={<Sun size={14} />} variant="highlight" size="sm">SMTV</Button>
        <Button 
          onClick={() => handleLiveVideo('UCyYoY9S20IXXPLPrQWE5RfA', '40Q')} 
          icon={<Moon size={14} />} 
          variant="highlight" 
          size="sm"
        >40Q</Button>
        <Button 
          onClick={() => handleLiveVideo('UC1vy_AzF3zGK-lde_b-EGGQ', '2K')} 
          icon={<Star size={14} />} 
          variant="highlight" 
          size="sm"
        >2K</Button>
      </div>
    </div>
  );
}

function Button({ 
  children, 
  icon, 
  onClick, 
  variant = 'default',
  size = 'default'
}: { 
  children: React.ReactNode; 
  icon: React.ReactNode; 
  onClick: () => void; 
  variant?: 'default' | 'highlight' | 'gradient';
  size?: 'default' | 'sm';
}) {
  const baseClasses = "flex items-center gap-1.5 rounded font-medium transition-all duration-200";
  const variants = {
    default: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    highlight: "bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-500",
    gradient: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/30"
  };
  const sizes = {
    default: "px-3 py-1.5 text-base",
    sm: "px-2 py-1 text-sm"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {icon}
      {children}
    </button>
  );
}