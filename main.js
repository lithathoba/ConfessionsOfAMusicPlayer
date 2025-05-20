const canvas = document.getElementById("circle");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const orbits = [
  { radius: 65, dotCount: 26 },
  { radius: 55, dotCount: 22 },
  { radius: 45, dotCount: 18 },
  { radius: 35, dotCount: 14 },
  { radius: 25, dotCount: 10 },
  { radius: 15, dotCount: 6 }
];

const gradientColors = [
  { r: 0, g: 102, b: 255 },
  { r: 153, g: 51, b: 255 },
  { r: 255, g: 102, b: 204 }
];

function interpolateColor(color1, color2, factor) {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor)
  };
}

function getGradientColor(position) {
  const scaledPos = position * (gradientColors.length - 1);
  const index = Math.floor(scaledPos);
  const factor = scaledPos - index;

  const color1 = gradientColors[index];
  const color2 = gradientColors[Math.min(index + 1, gradientColors.length - 1)];

  return interpolateColor(color1, color2, factor);
}

function drawFrame(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(centerX, centerY, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  orbits.forEach((orbit) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "transparent";
    ctx.stroke();

    for (let i = 0; i < orbit.dotCount; i++) {
      const angle = (i / orbit.dotCount) * 2 * Math.PI;
      const x = centerX + orbit.radius * Math.cos(angle);
      const y = centerY + orbit.radius * Math.sin(angle);

      const diagPos = (x + y) / (canvas.width + canvas.height);
      const pulse = Math.sin(2 * Math.PI * diagPos - time / 100);
      const scale = 0.6 + 0.4 * pulse;

      const { r, g, b } = getGradientColor(diagPos);
      ctx.beginPath();
      ctx.arc(x, y, (orbit.radius / 15) * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + 0.6 * scale})`;
      ctx.fill();
    }
  });

  requestAnimationFrame(drawFrame);
}

requestAnimationFrame(drawFrame);

const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const centerX2 = canvas2.width / 2;
const centerY2 = canvas2.height / 2;

let angle2 = 0;

function drawSpiralSquares() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.save();
  ctx2.translate(centerX2, centerY2);

  let size = 200;
  const gap = 5;
  let i = 0;
  let currentAngle = angle2;

  while (size > 0) {
    ctx2.save();
    ctx2.rotate(currentAngle);

    if (i % 2 === 0) {
      const grad = ctx2.createLinearGradient(
        -size / 2,
        -size / 2,
        size / 2,
        size / 2
      );
      grad.addColorStop(0, "orange");
      grad.addColorStop(1, "yellow");
      ctx2.strokeStyle = grad;
    } else {
      ctx2.strokeStyle = "black";
    }

    ctx2.lineWidth = 2;
    ctx2.strokeRect(-size / 2, -size / 2, size, size);
    ctx2.restore();

    size -= gap;
    currentAngle += 0.1;
    i++;
  }

  ctx2.restore();
  angle2 += 0.01;
  requestAnimationFrame(drawSpiralSquares);
}

drawSpiralSquares();

const canvasThree = document.getElementById("canvas3");
const ctx3 = canvasThree.getContext("2d");

const textCanvas = document.createElement("canvas");
textCanvas.width = canvasThree.width;
textCanvas.height = canvasThree.height;
const textCtx = textCanvas.getContext("2d");

textCtx.font = "28px sans-serif";
textCtx.fillStyle = "#4DB6AC";
textCtx.fillText("my baby's got", 10, 50);
textCtx.fillStyle = "#EF9A9A";
textCtx.fillText("a secret", 10, 90);

ctx3.fillStyle = "#4DB6AC";
ctx3.fillRect(0, 0, canvasThree.width, canvasThree.height);

ctx3.globalCompositeOperation = "destination-out";
ctx3.lineWidth = 40;
ctx3.lineCap = "round";

let drawing = false;

function getMousePos(evt) {
  const rect = canvasThree.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function endDrawing() {
  drawing = false;
  ctx3.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const { x, y } = getMousePos(e);
  ctx3.lineTo(x, y);
  ctx3.stroke();
  ctx3.beginPath();
  ctx3.moveTo(x, y);
}

canvasThree.addEventListener("mousedown", startDrawing);
canvasThree.addEventListener("mouseup", endDrawing);
canvasThree.addEventListener("mousemove", draw);

canvasThree.style.background = `url(${textCanvas.toDataURL()})`;

const playBtn = document.querySelector("body > div.footer > button.btn-box");

playBtn.addEventListener("click", musicPlayer);

function musicPlayer() {
  const aside = document.querySelector("aside.square-1");
  if (!document.querySelector(".video-wrapper")) {
    const videoWrapper = document.createElement("div");
    videoWrapper.className = "video-wrapper";
    videoWrapper.innerHTML = `
      <iframe width="100%" height="200" src="https://www.youtube.com/embed/EDwb9jOVRtU?autoplay=1" 
              frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;
    aside.appendChild(videoWrapper);
  }
}

const aside = document.querySelector("aside.square-1");

// Default content
const defaultContent = `
  This is a story about love. Some call it religion. Would you like to try?
  <div class="video-wrapper">
    <iframe width="100%" height="200" src="https://www.youtube.com/embed/EDwb9jOVRtU?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
`;

const canvasContent = {
  circle: `This is a story about love. Some call it religion. Would you like to try?
  <div class="video-wrapper">
    <iframe width="100%" height="200" src="https://www.youtube.com/embed/EDwb9jOVRtU?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
`,
  canvas2: `<p class="square-2">Why Should I Be Sad?</p><div class="video-wrapper">
    <iframe width="100%" height="200" src="https://www.youtube.com/embed/u4FF6MpcsRw?si=qskMmixxx_JaHyqH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>`,
  canvas3: `<p class="square-3">you take my love for granted, why oh why? the show is over say goodbye</p><div class="video-wrapper"><iframe width="100%" height="200" src="https://www.youtube-nocookie.com/embed/XDeiovnCv1o?si=jrtw5Sd3usOlFpOj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`
};

function updateAside(content) {
  aside.innerHTML = content;
}

document.getElementById("circle").addEventListener("mouseover", () => updateAside(canvasContent.circle));
document.getElementById("canvas2").addEventListener("mouseover", () => updateAside(canvasContent.canvas2));
document.getElementById("canvas3").addEventListener("mouseover", () => updateAside(canvasContent.canvas3));


["circle", "canvas2", "canvas3"].forEach(id => {
  document.getElementById(id).addEventListener("mouseout", () => updateAside(defaultContent));
});
