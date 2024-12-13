// ./kernel.js

export const kernelFunction = function (width, height, hue) {
  // Determine the thread index and compute pixel coordinates
  const i = this.thread.x; // Current thread index
  const y = Math.floor(i / (width * 4)); // Y-coordinate
  const x = Math.floor(i / 4 - y * width); // X-coordinate
  const channel = i % 4; // Channel (R, G, B, A)
  
  // Normalize coordinates
  const normalizedX = x / width; // Range: [0, 1]
  const normalizedY = y / height; // Range: [0, 1]

  // Compute the radial distance from the center
  const centerX = 0.5; // Center of pentagon
  const centerY = 0.5;
  const dx = normalizedX - centerX;
  const dy = normalizedY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy); // Radial distance

  // Hue-based RGB calculation (smooth transitions across the spectrum)
  const angle = Math.atan2(dy, dx) / (2 * Math.PI) + 0.5;
  const hueOffset = (hue + angle) % 1;

  // Convert hue to RGB (simple HSV to RGB conversion)
  const primaryColor = Math.floor(hueOffset * 6);
  const fractionalPart = hueOffset * 6 - primaryColor;
  const t = fractionalPart;
  const v = 1.0;
  const p = 0.0;

  let r = 0, g = 0, b = 0;
  switch (primaryColor) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = 1 - t; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = 1 - t; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = 1 - t; break;
  }

  // Apply vertical and horizontal gradients
  const gradientFactor = 1 - Math.abs(2 * (distance - 0.5)); // Fade at edges
  r *= gradientFactor;
  g *= gradientFactor;
  b *= gradientFactor;

  // Handle RGBA channels
  if (channel === 0) return r * 255; // Red channel
  if (channel === 1) return g * 255; // Green channel
  if (channel === 2) return b * 255; // Blue channel
  if (channel === 3) return 255; // Alpha channel (fully opaque)
};

