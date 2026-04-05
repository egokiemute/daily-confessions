import type { ConfessionEntry } from "@/app/confessions";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;
const PADDING_X = 82;
const TOP_META_Y = 112;
const FOOTER_HEIGHT = 170;

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
): string[] {
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

function drawWrappedLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to generate image."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export async function generateShareCard(
  entry: ConfessionEntry,
  fontFamily: string,
): Promise<Blob> {
  await document.fonts.ready;

  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }

  const background = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  background.addColorStop(0, "#fff8f2");
  background.addColorStop(0.32, "#fff1e5");
  background.addColorStop(1, "#f6eee5");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const cardGradient = ctx.createLinearGradient(120, 140, 920, 1210);
  cardGradient.addColorStop(0, "#ff8a70");
  cardGradient.addColorStop(0.18, entry.palette.card);
  cardGradient.addColorStop(1, "#98291d");

  ctx.save();
  ctx.translate(540, 675);
  ctx.rotate((-3.25 * Math.PI) / 180);

  const cardX = -370;
  const cardY = -500;
  const cardWidth = 740;
  const cardHeight = 980;

  ctx.shadowColor = "rgba(111, 33, 16, 0.22)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 28;
  ctx.fillStyle = cardGradient;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 42);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.save();
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 42);
  ctx.clip();

  const highlight = ctx.createRadialGradient(-80, -520, 60, 40, -460, 820);
  highlight.addColorStop(0, "rgba(255,255,255,0.18)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

  ctx.strokeStyle = "rgba(255, 246, 239, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 30, cardY + 108);
  ctx.lineTo(cardX + cardWidth - 30, cardY + 108);
  ctx.stroke();

  ctx.font = `700 22px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 246, 239, 0.78)";
  ctx.fillText(
    `${entry.category.toUpperCase()} // ${entry.theme.toUpperCase()}`,
    cardX + 38,
    cardY + 62,
  );
  ctx.fillText(entry.reference.toUpperCase(), cardX + 38, cardY + 90);

  ctx.font = `800 58px ${fontFamily}`;
  ctx.fillStyle = "#fff6ef";
  ctx.textAlign = "right";
  ctx.fillText(entry.number, cardX + cardWidth - 38, cardY + 78);

  ctx.textAlign = "left";
  ctx.font = `800 56px ${fontFamily}`;
  const titleLines = wrapText(ctx, entry.title, cardWidth - 90);
  drawWrappedLines(ctx, titleLines, cardX + 38, cardY + 170, 64);

  const titleBottom = cardY + 170 + titleLines.length * 64;

  ctx.font = `400 29px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 246, 239, 0.86)";
  const verseLines = wrapText(ctx, entry.verse, cardWidth - 90);
  drawWrappedLines(ctx, verseLines, cardX + 38, titleBottom + 28, 40);

  let cursorY = titleBottom + 28 + verseLines.length * 40 + 54;

  ctx.font = `500 29px ${fontFamily}`;
  ctx.fillStyle = "#fff6ef";
  for (const line of entry.confession) {
    const confessionLines = wrapText(ctx, line, cardWidth - 120);
    drawWrappedLines(ctx, confessionLines, cardX + 38, cursorY, 38);
    cursorY += confessionLines.length * 38 + 16;
  }

  ctx.strokeStyle = "rgba(255, 246, 239, 0.22)";
  ctx.beginPath();
  ctx.moveTo(cardX + 38, cardY + cardHeight - FOOTER_HEIGHT);
  ctx.lineTo(cardX + cardWidth - 38, cardY + cardHeight - FOOTER_HEIGHT);
  ctx.stroke();

  ctx.font = `500 22px ${fontFamily}`;
  ctx.fillStyle = "rgba(255, 246, 239, 0.76)";
  ctx.fillText("BCM DAILY CONFESSIONS", cardX + 38, cardY + cardHeight - 108);
  ctx.fillText("BLOOD OF JESUS", cardX + 38, cardY + cardHeight - 76);

  ctx.font = `700 24px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff6ef";
  roundRect(ctx, cardX + 388, cardY + cardHeight - 124, 314, 64, 32);
  ctx.strokeStyle = "rgba(255, 246, 239, 0.36)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillText("Share Card", cardX + 545, cardY + cardHeight - 82);

  ctx.restore();
  ctx.restore();

  ctx.fillStyle = "rgba(16, 23, 33, 0.05)";
  ctx.font = `800 310px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillText(entry.number, CANVAS_WIDTH / 2, 1225);

  ctx.textAlign = "left";
  ctx.font = `700 20px ${fontFamily}`;
  ctx.fillStyle = "rgba(16, 23, 33, 0.54)";
  ctx.fillText("BCM DAILY CONFESSIONS", PADDING_X, TOP_META_Y);
  ctx.fillText("BELIEVERS' CAMP MEETING", PADDING_X, TOP_META_Y + 30);
  ctx.textAlign = "right";
  ctx.fillText("REV. 12:11", CANVAS_WIDTH - PADDING_X, TOP_META_Y);

  return toBlob(canvas);
}
