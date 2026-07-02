import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [result, setResult] = useState({
    emotion: "",
    confidence: 0,
  });

  useEffect(() => {
    initialize();
    return stopCamera;
  }, []);

  async function initialize() {
    try {
      // Load MediaPipe
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      detectorRef.current =
        await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },

          runningMode: "IMAGE",

          numFaces: 1,

          outputFaceBlendshapes: true,
        });

      // Open camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 640,
          height: 480,
        },
      });

      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject;

    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());
  }

  function blend(name, categories) {
    return (
      categories.find((c) => c.categoryName === name)?.score || 0
    );
  }

  function detectEmotion(categories) {
    const get = (name) =>
      categories.find((c) => c.categoryName === name)?.score || 0;
  
    const smile =
      (get("mouthSmileLeft") + get("mouthSmileRight")) / 2;
  
    const frown =
      (get("mouthFrownLeft") + get("mouthFrownRight")) / 2;
  
    const browDown =
      (get("browDownLeft") + get("browDownRight")) / 2;
  
    const browUp = get("browInnerUp");
  
    const eyeSquint =
      (get("eyeSquintLeft") + get("eyeSquintRight")) / 2;
  
    const jawOpen = get("jawOpen");
  
    const mouthPress =
      (get("mouthPressLeft") + get("mouthPressRight")) / 2;
  
    // 😊 Happy
    if (smile > 0.45) {
      return {
        emotion: "😊 Happy",
        confidence: smile,
      };
    }
  
    // 😲 Surprise
    if (jawOpen > 0.45 && browUp > 0.30) {
      return {
        emotion: "😲 Surprise",
        confidence: Math.max(jawOpen, browUp),
      };
    }
  
    // 😠 Angry
    if (browDown > 0.35 && eyeSquint > 0.20) {
      return {
        emotion: "😠 Angry",
        confidence: Math.max(browDown, eyeSquint),
      };
    }
  
    // 😢 Sad
    if (
      smile < 0.15 &&
      browUp > 0.18 &&
      (frown > 0.05 || mouthPress > 0.12)
    ) {
      return {
        emotion: "😢 Sad",
        confidence: Math.max(frown, mouthPress, browUp),
      };
    }
  
    // 😐 Neutral
    return {
      emotion: "😐 Neutral",
      confidence: 0.9,
    };
  }


  async function analyzeMood() {
    if (!detectorRef.current) return;

    setAnalyzing(true);

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const result =
      detectorRef.current.detect(canvas);

    if (
      !result.faceBlendshapes ||
      result.faceBlendshapes.length === 0
    ) {
      setResult({
        emotion: "No Face Detected",
        confidence: 0,
      });

      setAnalyzing(false);
      return;
    }

    const emotion = detectEmotion(
      result.faceBlendshapes[0].categories
    );

    setResult(emotion);

    setAnalyzing(false);
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          borderRadius: 20,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      <button
        disabled={loading || analyzing}
        onClick={analyzeMood}
        style={{
          marginTop: 25,
          padding: "14px 32px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        {loading
          ? "Loading..."
          : analyzing
          ? "Analyzing..."
          : "Analyze Mood"}
      </button>

      {result.emotion && (
        <div
          style={{
            marginTop: 30,
            padding: 25,
            borderRadius: 16,
            background: "#f5f5f5",
          }}
        >
          <h2>{result.emotion}</h2>

          <p>
            Confidence:
            {" "}
            {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}