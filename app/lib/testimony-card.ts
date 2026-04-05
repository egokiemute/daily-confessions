import type { TestimonyRecord } from "@/app/lib/testimony-types";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });
}

function toBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to generate testimony card."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export async function generateTestimonyCard(
  testimony: TestimonyRecord,
  fontFamily: string,
) {
  await document.fonts.ready;

  const [logo, lowerThird] = await Promise.all([
    loadImage("/bcm/bcm-logo.png"),
    loadImage("/bcm/lowerthird.png"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available.");
  }

  const background = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  background.addColorStop(0, "#2e0d07");
  background.addColorStop(0.46, "#53170e");
  background.addColorStop(1, "#120502");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const sunGlow = ctx.createRadialGradient(220, 160, 40, 220, 160, 540);
  sunGlow.addColorStop(0, "rgba(255, 196, 71, 0.34)");
  sunGlow.addColorStop(1, "rgba(255, 196, 71, 0)");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.drawImage(logo, 240, 38, 600, 430);
  ctx.restore();

  ctx.save();
  roundRect(ctx, 66, 262, 948, 760, 28);
  ctx.clip();

  const panel = ctx.createLinearGradient(66, 262, 1014, 1022);
  panel.addColorStop(0, "rgba(34, 9, 4, 0.80)");
  panel.addColorStop(1, "rgba(86, 24, 13, 0.76)");
  ctx.fillStyle = panel;
  ctx.fillRect(66, 262, 948, 760);

  ctx.strokeStyle = "rgba(255, 182, 67, 0.72)";
  ctx.lineWidth = 3;
  roundRect(ctx, 66, 262, 948, 760, 28);
  ctx.stroke();

  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 205, 135, 0.92)";
  ctx.fillText("BCM 2026 TESTIMONY", 112, 330);
  ctx.fillText(
    new Date(testimony.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    780,
    330,
  );

  ctx.font = `800 44px ${fontFamily}`;
  ctx.fillStyle = "#fff4e5";
  ctx.fillText(testimony.fullName, 112, 395);

  ctx.font = `600 22px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 215, 176, 0.82)";
  const metaParts = [testimony.location, testimony.session].filter(Boolean);
  ctx.fillText(metaParts.join("  //  ") || "Believers' Camp Meeting", 112, 432);

  ctx.font = `500 40px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 208, 127, 0.9)";
  ctx.fillText("“", 108, 504);

  ctx.font = `500 31px ${fontFamily}`;
  ctx.fillStyle = "#fff8ef";
  const lines = wrapText(ctx, testimony.testimony, 840);
  const cappedLines = lines.slice(0, 12);

  cappedLines.forEach((line, index) => {
    ctx.fillText(line, 138, 512 + index * 48);
  });

  if (lines.length > cappedLines.length) {
    ctx.fillText("...", 138, 512 + cappedLines.length * 48);
  }

  ctx.restore();

  ctx.drawImage(lowerThird, 0, 1065, 1080, 186);

  ctx.font = `700 34px ${fontFamily}`;
  ctx.fillStyle = "#fff3e3";
  ctx.fillText("Believers' Camp Meeting", 118, 1158);

  ctx.font = `600 24px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 228, 201, 0.9)";
  ctx.fillText("Deliverers' Camp Meeting", 118, 1198);
  ctx.fillText("Shared from the BCM testimony wall", 118, 1234);

  return toBlob(canvas);
}
