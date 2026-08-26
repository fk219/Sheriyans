import { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../../home/song.context";
import { getSong } from "../../home/services/song.api";
import { initializeFaceExpression, startFaceDetection, stopFaceExpression } from "../utils/utils";
import "../styles/style.scss";

const moodMap = {
  Happy: "happy",
  Surprised: "surprised",
  Sad: "sad",
  Neutral: "neutral",
};

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastMoodRef = useRef("");

  const [expression, setExpression] = useState("Camera ready");
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Ready to analyze your mood");
  const { setSong, setLoading: setSongLoading } = useContext(SongContext);

  useEffect(() => {
    initializeFaceExpression({
      videoRef,
      landmarkerRef,
      setExpression,
      setLoading,
    });

    return () => {
      stopFaceExpression({
        videoRef,
        landmarkerRef,
        animationRef,
      });
    };
  }, []);

  const handleMoodRequest = async (value) => {
    const mood = moodMap[value] || value?.toLowerCase();
    if (!mood || mood === lastMoodRef.current) return;

    lastMoodRef.current = mood;
    setStatus(`Finding a ${mood} playlist...`);
    setSongLoading(true);

    try {
      const response = await getSong({ mood });
      if (response?.song) {
        setSong({ ...response.song, mood });
        setStatus(`Playlist tuned for ${mood}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("Playlist unavailable right now");
    } finally {
      setSongLoading(false);
    }
  };

  const handleDetect = () => {
    if (isRunning) return;

    lastMoodRef.current = "";
    setExpression("Detecting...");
    setStatus("Scanning your expression...");
    startFaceDetection({
      videoRef,
      landmarkerRef,
      animationRef,
      setExpression,
      setIsRunning,
      onExpressionChange: (value) => {
        if (value && value !== "No face detected" && value !== "Camera ready") {
          handleMoodRequest(value);
        }
      },
    });
  };

  return (
    <div className="face-expression">
      <div className="face-expression__card">
        <div className="face-expression__header">
          <div>
            <p className="face-expression__eyebrow">Live emotion scan</p>
            <h2>Let the room set the soundtrack</h2>
          </div>
          <span className="face-expression__pill">{status}</span>
        </div>

        <div className="face-expression__stage">
          <video ref={videoRef} autoPlay playsInline muted className="face-expression__video" />

          <div className="face-expression__panel">
            <p className="face-expression__label">Current mood</p>
            <h3>{loading ? "Preparing camera..." : expression}</h3>
            <button onClick={handleDetect} disabled={loading || isRunning} className="face-expression__button">
              {loading ? "Starting camera..." : isRunning ? "Reading..." : "Detect mood"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}