import { useEffect, useRef, useState } from "react";
import { initializeFaceExpression, startFaceDetection, stopFaceExpression } from "../utils/utils";
import "../styles/style.scss";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Camera ready");
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

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

  const handleDetect = () => {
    if (isRunning) return;

    setExpression("Detecting...");
    startFaceDetection({
      videoRef,
      landmarkerRef,
      animationRef,
      setExpression,
      setIsRunning,
    });
  };

  return (
    <div className="face-expression">
      <video ref={videoRef} autoPlay playsInline muted className="face-expression__video" />

      <button onClick={handleDetect} disabled={loading || isRunning} className="face-expression__button">
        {loading ? "Starting camera..." : isRunning ? "Detecting..." : "Detect Expression"}
      </button>

      <h2 className="face-expression__result">{loading ? "Loading camera..." : expression}</h2>
    </div>
  );
}