'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const generateVideo = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 640;
      canvas.height = 480;

      const frames = [];
      const frameCount = 60; // 2 seconds at 30fps

      // Generate animated frames with a bouncing cat emoji
      for (let i = 0; i < frameCount; i++) {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bouncing animation
        const x = (Math.sin(i / 10) * 200) + 320;
        const y = (Math.abs(Math.sin(i / 8)) * 150) + 100;
        const rotation = Math.sin(i / 5) * 0.3;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐱', 0, 0);
        ctx.restore();

        // Add sparkles
        for (let j = 0; j < 5; j++) {
          const sparkleX = Math.random() * canvas.width;
          const sparkleY = Math.random() * canvas.height;
          const sparkleSize = Math.random() * 20 + 10;
          ctx.font = `${sparkleSize}px Arial`;
          ctx.fillText('✨', sparkleX, sparkleY);
        }

        frames.push(canvas.toDataURL('image/png'));
      }

      // Create a simple "video" by cycling through frames
      let currentFrame = 0;
      const playFrames = () => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = frames[currentFrame];
        currentFrame = (currentFrame + 1) % frames.length;
      };

      const interval = setInterval(playFrames, 33); // ~30fps

      // Store the interval ID for cleanup
      canvas.dataset.intervalId = interval;

      setVideoUrl('playing');
      setLoading(false);
    } catch (err) {
      setError('Failed to generate cat video');
      setLoading(false);
    }
  };

  const stopVideo = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.dataset.intervalId) {
      clearInterval(parseInt(canvas.dataset.intervalId));
      delete canvas.dataset.intervalId;
    }
    setVideoUrl('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🐱 Cat Video Generator
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Generate an adorable animated cat video instantly!
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <button
            onClick={generateVideo}
            disabled={loading || videoUrl === 'playing'}
            style={{
              background: loading || videoUrl === 'playing'
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '1.1rem',
              borderRadius: '50px',
              cursor: loading || videoUrl === 'playing' ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
              transform: loading ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            {loading ? '🎬 Generating...' : '🎬 Generate Cat Video'}
          </button>

          {videoUrl === 'playing' && (
            <button
              onClick={stopVideo}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.1rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              ⏹️ Stop
            </button>
          )}
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '480px',
          background: '#f9fafb',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: videoUrl === 'playing' ? 'block' : 'none',
              borderRadius: '10px'
            }}
          />
          {!videoUrl && !loading && (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '40px'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🐱</div>
              <p style={{ fontSize: '1.2rem' }}>Click the button above to generate your cat video!</p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>✨ Each video is uniquely animated with bouncing cats and sparkles! ✨</p>
        </div>
      </div>
    </div>
  );
}
