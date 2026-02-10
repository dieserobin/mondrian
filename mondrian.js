let blocks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  strokeCap(SQUARE); // Sharp corners are essential for this style
  generateMondrian();
}

function mousePressed() {
  generateMondrian();
}

function generateMondrian() {
  // 1. Reset: Start with a single block covering the whole canvas
  blocks = [{ x: 0, y: 0, w: width, h: height, c: "#F0F0F0" }];

  // 2. The "Cut" Phase
  // Instead of infinite recursion, we only make 5 to 9 cuts total.
  // This ensures the image remains clean and not "busy."
  let totalCuts = floor(random(5, 10));
  for (let i = 0; i < totalCuts; i++) {
    splitLargestBlock();
  }

  // 3. The "Color" Phase
  // We assign colors *after* the geometry is done to ensure balance.
  assignColors();

  // 4. Draw
  background(240);
  stroke(15);      // Nearly black
  strokeWeight(12); // Iconic thick lines

  for (let b of blocks) {
    fill(b.c);
    rect(b.x, b.y, b.w, b.h);
  }
}

function splitLargestBlock() {
  // Find a list of blocks that are actually big enough to split.
  // Mondrian didn't split tiny squares; he left them as accents.
  let candidates = blocks.filter(b => b.w > 150 && b.h > 150);

  // If no blocks are big enough, stop early.
  if (candidates.length === 0) return;

  // Pick a random large block to split
  let index = floor(random(candidates.length));
  let r = candidates[index];
  
  // Find where this block lives in the main list so we can replace it
  let mainIndex = blocks.indexOf(r);

  // Decide split direction based on shape
  // If it's very wide, cut it vertically. Very tall, cut horizontally.
  let splitHoriz = random() > 0.5;
  if (r.w > r.h * 1.5) splitHoriz = false; 
  if (r.h > r.w * 1.5) splitHoriz = true; 

  let newB1, newB2;

  if (splitHoriz) {
    let splitY = floor(random(0.3, 0.7) * r.h);
    newB1 = { x: r.x, y: r.y, w: r.w, h: splitY, c: "#F0F0F0" };
    newB2 = { x: r.x, y: r.y + splitY, w: r.w, h: r.h - splitY, c: "#F0F0F0" };
  } else {
    let splitX = floor(random(0.3, 0.7) * r.w);
    newB1 = { x: r.x, y: r.y, w: splitX, h: r.h, c: "#F0F0F0" };
    newB2 = { x: r.x + splitX, y: r.y, w: r.w - splitX, h: r.h, c: "#F0F0F0" };
  }

  // Remove the old big block and add the two new smaller ones
  blocks.splice(mainIndex, 1, newB1, newB2);
}

function assignColors() {
  // Shuffle the blocks so we don't always color the top-left one
  let shuffled = blocks.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // STRICT COLOR BUDGET
  // Mondrian rarely used more than one block of each primary color.
  // We assign exactly one of each, provided we have enough blocks.
  
  if (shuffled.length > 0) shuffled[0].c = "#E10600"; // One Red
  if (shuffled.length > 1) shuffled[1].c = "#034AA6"; // One Blue
  if (shuffled.length > 2) shuffled[2].c = "#F2C500"; // One Yellow
  
  // Optional: A small black block (common in his later works)
  if (shuffled.length > 5 && random() > 0.5) {
    shuffled[3].c = "#111111";
  }
}