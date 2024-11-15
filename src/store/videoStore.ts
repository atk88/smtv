import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoStore {
  videos: string[];
  addVideos: (videoId: string, count: number) => void;
  playAll: () => void;
  pauseAll: () => void;
  clearAll: () => void;
  saveLayout: () => void;
  fetchLiveVideo: (channelId: string) => Promise<string | null>;
}

const API_KEYS = [
  'AIzaSyBGNTWKfd5ZLwamAFHGoL8vkgejarHCLCQ',
  'AIzaSyBgMSkcO2bzEL-t8PYGExdopxZxFQ8LtE0',
  'AIzaSyBqmItrG5AfvTdymHNKhZHedyx3uPIRPqI',
  'AIzaSyA_wiYnVQqXobQ52Xkya3Dk_VetYNjDF4c',
  'AIzaSyBSGKku6wCR_cUBlhXYwjmJgRZUbT8gUFM',
  'AIzaSyD4G6wFBNcOzp0yq7CVCtjVcfeUUsBt0b8',
  'AIzaSyAyd6Dpu2995ccm550XUiuUTUdrFCK8olY',
  'AIzaSyBqpUcTK4FZhSlw9yXLZ10D5Lonnx2DxUE',
  'AIzaSyC5hSnt6Geo7JvfwGTijxysgXn3r9DIZc8'
];

let currentKeyIndex = 0;

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      addVideos: (videoId, count) => {
        set(state => ({
          videos: [...state.videos, ...Array(count).fill(videoId)]
        }));
      },
      playAll: () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        });
      },
      pauseAll: () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
      },
      clearAll: () => {
        set({ videos: [] });
        localStorage.removeItem('videoSettings');
      },
      saveLayout: () => {
        const { videos } = get();
        const settings = videos.reduce((acc, videoId) => {
          acc[videoId] = (acc[videoId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        localStorage.setItem('videoSettings', JSON.stringify(
          Object.entries(settings).map(([videoId, count]) => ({ videoId, count }))
        ));
      },
      fetchLiveVideo: async (channelId: string) => {
        const cacheKey = `liveVideo_${channelId}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiry = localStorage.getItem(`${cacheKey}_expiry`);
        
        if (cachedData && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
          return JSON.parse(cachedData);
        }

        const apiKey = API_KEYS[currentKeyIndex];
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`
          );

          if (!response.ok) throw new Error('API request failed');

          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            localStorage.setItem(cacheKey, JSON.stringify(videoId));
            localStorage.setItem(`${cacheKey}_expiry`, String(Date.now() + 5 * 60 * 1000)); // 5 minutes cache
            return videoId;
          }
          return null;
        } catch (error) {
          console.error('Error fetching live video:', error);
          return null;
        }
      }
    }),
    {
      name: 'video-storage'
    }
  )
);