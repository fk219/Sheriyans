import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

const WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export async function initializeFaceExpression({
  videoRef,
  landmarkerRef,
  setExpression,
  setLoading,
}) {
  if (landmarkerRef.current) return;

  try {
    setLoading(true);
    setExpression("Starting camera...");

    const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
    const landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
    });

    landmarkerRef.current = landmarker;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setLoading(false);
    setExpression("Camera ready. Click detect.");
  } catch (error) {
    console.error(error);
    setExpression("Unable to start camera");
    setLoading(false);
  }
}

export function startFaceDetection({
  videoRef,
  landmarkerRef,
  animationRef,
  setExpression,
  setIsRunning,
}) {
  if (!landmarkerRef.current || !videoRef.current) return;

  setIsRunning(true);

  const detect = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const result = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());

    if (result.faceBlendshapes?.length > 0) {
      const blendshapes = result.faceBlendshapes[0].categories;
      setExpression(classifyExpression(blendshapes));
    } else {
      setExpression("No face detected");
    }

    animationRef.current = requestAnimationFrame(detect);
  };

  detect();
}

export function stopFaceExpression({ videoRef, landmarkerRef, animationRef }) {
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }

  if (landmarkerRef.current) {
    landmarkerRef.current.close();
    landmarkerRef.current = null;
  }

  const stream = videoRef.current?.srcObject;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }
}

export function classifyExpression(categories) {
  const getScore = (name) =>
    categories.find((item) => item.categoryName === name)?.score || 0;

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");
  const jawOpen = getScore("jawOpen");
  const browUp = getScore("browInnerUp");
  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");

  if (smileLeft > 0.5 && smileRight > 0.5) {
    return "Happy 😄";
  }

  if (jawOpen > 0.6 && browUp > 0.5) {
    return "Surprised 😲";
  }

  if (frownLeft > 0.5 && frownRight > 0.5) {
    return "Sad 😢";
  }

  return "Neutral 😐";
}

