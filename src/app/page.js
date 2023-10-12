"use client";
import { useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
    const videoRef = useRef();
    const canvasRef = useRef();

    // OPEN YOU FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // LOAD MODELS FROM FACE API

    const faceMyDetect = () => {
        setInterval(async () => {
            // const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options());
            // .withFaceLandmarks()
            // .withFaceExpressions();

            // console.log("deteksi muka ", detections);
            if (!detections) {
                console.log("tidak terdeteksi wajah, tidak mengirim");
            } else {
                if (detections?.classScore) {
                    console.log("terdeteksi wajah");
                    // DRAW YOU FACE IN WEBCAM
                    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
                    faceapi.matchDimensions(canvasRef.current, {
                        width: 650,
                        height: 600,
                    });

                    const resized = faceapi.resizeResults(detections, {
                        width: 650,
                        height: 600,
                    });

                    faceapi.draw.drawDetections(canvasRef.current, resized);
                    //Running Logic
                }
            }

            // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
            // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }, 1000);
    };

    // LOAD FROM USEEFFECT
    useEffect(() => {
        const loadModels = () => {
            Promise.all([
                // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
                // faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
                // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
            ]).then(() => {
                faceMyDetect();
            });
        };
        startVideo();
        if (videoRef) {
            loadModels();
        }
    }, []);

    return (
        <div className="myapp">
            <h1>FAce Detection</h1>
            <div className="appvide">
                <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
            </div>
            <canvas ref={canvasRef} width="650" height="600" className="appcanvas" />
        </div>
    );
}
