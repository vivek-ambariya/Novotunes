import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

/**
 * Webcam Vibe Matcher Component
 * Connects to Django AI Mood Detection endpoint.
 */
export function WebcamVibe({ onClose, onSuccess }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const captureAndAnalyze = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/mood/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("AI Endoint Error:", err);
      // Fallback mocked result so UI doesn't break if server is down
      setResult({
        detected_emotion: 'chill',
        queue: [
          { track_id: '1', title: 'Lofi Beats to Study To', emotion: 'chill' }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [webcamRef]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-2xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
        
        <h2 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Vibe Matcher</h2>
        <p className="text-slate-400 text-sm mb-6">Let NovaTunes analyze your expression to generate the perfect soundtrack.</p>
        
        {!result ? (
          <>
            <div className="rounded-xl overflow-hidden mb-6 border border-slate-700 bg-black aspect-video relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              {loading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-white tracking-widest animate-pulse">ANALYZING MOOD...</div>}
            </div>
            
            <button 
              onClick={captureAndAnalyze}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition rounded-xl py-3 font-bold text-white shadow-lg"
            >
              Analyze My Vibe
            </button>
          </>
        ) : (
          <div className="animate-fade-in text-center py-8">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">You look <span className="text-cyan-400 capitalize">{result.detected_emotion}</span>!</h3>
            <p className="text-slate-400 text-sm mb-6">We loaded {result.queue?.length || 0} tracks matching your energy.</p>
            
            <button 
              onClick={() => {
                if (onSuccess) onSuccess(result);
                onClose();
              }} 
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-slate-200"
            >
              Start Listening
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
