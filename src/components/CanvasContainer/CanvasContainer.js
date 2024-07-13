import React, { useRef, useEffect, useState } from "react";

const CanvasContainer = ({ imageSrc, scale, rotation }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [ctx, setCtx] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCtx(context);
  }, []);

  useEffect(() => {
    if (!ctx || !imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate rotated dimensions of the image within the canvas
      const rotatedWidth =
        Math.abs(scaledWidth * Math.cos((rotation * Math.PI) / 180)) +
        Math.abs(scaledHeight * Math.sin((rotation * Math.PI) / 180));
      const rotatedHeight =
        Math.abs(scaledHeight * Math.cos((rotation * Math.PI) / 180)) +
        Math.abs(scaledWidth * Math.sin((rotation * Math.PI) / 180));

      // Update canvas size based on rotated image dimensions
      setCanvasSize({ width: rotatedWidth, height: rotatedHeight });

      // Store img object in ref for access in other useEffect
      imgRef.current = img;
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };

    img.src = imageSrc;
  }, [ctx, imageSrc, scale, rotation]); // Setup dependencies: ctx, imageSrc, scale, rotation

  useEffect(() => {
    if (!ctx || !canvasSize.width || !canvasSize.height || !imgRef.current)
      return;

    const img = imgRef.current;

    // Draw on canvas with transformations
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(canvasSize.width / 2, canvasSize.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [ctx, canvasSize, scale, rotation]);

  return (
    <div
      style={{ border: "1px solid transparent" }}
      className="canvasContainer"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
    </div>
  );
};

export default CanvasContainer;
