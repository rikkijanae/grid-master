figma.showUI(__html__, { width: 320, height: 760, themeColors: false });

figma.ui.onmessage = async (msg) => {

  // === PERSPECTIVE / FLOOR GRID ===
  if (msg.type === 'create-grid') {
    const { cols, rows, gridWidthPct, gridWidth, gridHeight, angle, vpOffsetX, strokeWeight, showVP, showBorder } = msg;

    const baseWidth = gridWidth * gridWidthPct / 100;
    const gridLeft = (gridWidth - baseWidth) / 2;
    const gridRight = gridLeft + baseWidth;

    const vpX = gridLeft + baseWidth / 2 + vpOffsetX;
    const angleRad = angle * Math.PI / 180;
    const absVpY = (baseWidth / 2) / Math.tan(angleRad);
    const vpY = -absVpY;

    const frame = figma.createFrame();
    frame.name = "Perspective Grid";
    frame.fills = [];
    frame.clipsContent = true;

    let frameTop = 0;
    let frameHeight = gridHeight;
    if (showVP && vpY < 0) {
      frameTop = vpY - 20;
      frameHeight = gridHeight - frameTop;
    }
    const yOffset = -frameTop;
    frame.resize(gridWidth, frameHeight);

    const strokeColor = { r: 0.4, g: 0.4, b: 0.9 };
    const guideColor = { r: 0.9, g: 0.3, b: 0.3 };

    function makeLine(x1, y1, x2, y2, color, weight) {
      const vec = figma.createVector();
      vec.vectorPaths = [{
        windingRule: "NONE",
        data: "M " + x1.toFixed(2) + " " + (y1 + yOffset).toFixed(2) + " L " + x2.toFixed(2) + " " + (y2 + yOffset).toFixed(2)
      }];
      vec.strokes = [{ type: 'SOLID', color: color || strokeColor }];
      vec.strokeWeight = weight || strokeWeight;
      vec.strokeCap = "ROUND";
      frame.appendChild(vec);
      return vec;
    }

    const colSpacing = baseWidth / cols;
    const ratio = (0 - vpY) / (gridHeight - vpY);
    const topColSpacing = colSpacing * ratio;

    const extraLeftBot = Math.ceil(Math.max(0, gridLeft) / colSpacing);
    const extraRightBot = Math.ceil(Math.max(0, gridWidth - gridRight) / colSpacing);
    const topX0 = vpX + (gridLeft - vpX) * ratio;
    const topXN = vpX + (gridRight - vpX) * ratio;
    const extraLeftTop = topColSpacing > 0 ? Math.ceil(Math.max(0, topX0) / topColSpacing) : 0;
    const extraRightTop = topColSpacing > 0 ? Math.ceil(Math.max(0, gridWidth - topXN) / topColSpacing) : 0;
    const extraLeft = Math.max(extraLeftBot, extraLeftTop);
    const extraRight = Math.max(extraRightBot, extraRightTop);

    for (let i = -extraLeft; i <= cols + extraRight; i++) {
      const bottomX = gridLeft + (i / cols) * baseWidth;
      const topX = vpX + (bottomX - vpX) * ratio;
      makeLine(topX, 0, bottomX, gridHeight, strokeColor, strokeWeight);
    }

    for (let j = 0; j <= rows; j++) {
      let y;
      if (j === 0) { y = gridHeight; }
      else if (j === rows) { y = 0; }
      else { y = vpY + (gridHeight - vpY) * (absVpY * rows) / (absVpY * rows + j * gridHeight); }
      const t = (y - vpY) / (gridHeight - vpY);
      const xLeft = Math.min(vpX + (gridLeft - vpX) * t, 0);
      const xRight = Math.max(vpX + (gridRight - vpX) * t, gridWidth);
      makeLine(xLeft, y, xRight, y, strokeColor, strokeWeight);
    }

    if (showBorder) {
      const borderWeight = strokeWeight * 1.5;
      makeLine(gridLeft, gridHeight, gridRight, gridHeight, strokeColor, borderWeight);
      const ratioTop = (0 - vpY) / (gridHeight - vpY);
      const topLeft = vpX + (gridLeft - vpX) * ratioTop;
      const topRight = vpX + (gridRight - vpX) * ratioTop;
      makeLine(topLeft, 0, topRight, 0, strokeColor, borderWeight);
      makeLine(gridLeft, gridHeight, topLeft, 0, strokeColor, borderWeight);
      makeLine(gridRight, gridHeight, topRight, 0, strokeColor, borderWeight);
    }

    if (showVP) {
      const crossSize = 10;
      makeLine(vpX - crossSize, vpY, vpX + crossSize, vpY, guideColor, 1.5);
      makeLine(vpX, vpY - crossSize, vpX, vpY + crossSize, guideColor, 1.5);
      const guideL = makeLine(vpX, vpY, gridLeft, gridHeight, guideColor, 0.5);
      guideL.dashPattern = [4, 4];
      const guideR = makeLine(vpX, vpY, gridRight, gridHeight, guideColor, 0.5);
      guideR.dashPattern = [4, 4];
    }

    frame.x = Math.round(figma.viewport.center.x - gridWidth / 2);
    frame.y = Math.round(figma.viewport.center.y - frameHeight / 2);
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('Perspective grid created!');
  }

  // === FLAT GRID ===
  if (msg.type === 'create-flat-grid') {
    const { cols, rows, frameWidth, frameHeight, cellSize, strokeWeight, strokeOpacity, showBorder } = msg;

    const frame = figma.createFrame();
    frame.name = "Flat Grid";
    frame.fills = [];
    frame.clipsContent = true;
    frame.resize(frameWidth, frameHeight);

    const strokeColor = { r: 0.4, g: 0.4, b: 0.4 };
    const opacity = strokeOpacity / 100;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rect = figma.createRectangle();
        rect.name = "Cell " + (r + 1) + "-" + (c + 1);
        rect.x = c * cellSize;
        rect.y = r * cellSize;
        rect.resize(cellSize, cellSize);
        rect.fills = [];
        rect.strokes = [{ type: 'SOLID', color: strokeColor, opacity: opacity }];
        rect.strokeWeight = strokeWeight;
        rect.strokeAlign = "CENTER";
        frame.appendChild(rect);
      }
    }

    if (showBorder) {
      const border = figma.createRectangle();
      border.name = "Border";
      border.x = 0;
      border.y = 0;
      border.resize(cols * cellSize, rows * cellSize);
      border.fills = [];
      border.strokes = [{ type: 'SOLID', color: strokeColor, opacity: opacity }];
      border.strokeWeight = strokeWeight * 1.5;
      border.strokeAlign = "INSIDE";
      frame.appendChild(border);
    }

    frame.x = Math.round(figma.viewport.center.x - frameWidth / 2);
    frame.y = Math.round(figma.viewport.center.y - frameHeight / 2);
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('Flat grid created!');
  }

  // === DOTTED GRID ===
  if (msg.type === 'create-dotted-grid') {
    const { cols, rows, frameWidth, frameHeight, cellSize, dotSize, strokeOpacity, showBorder, strokeWeight } = msg;

    const frame = figma.createFrame();
    frame.name = "Dotted Grid";
    frame.fills = [];
    frame.clipsContent = true;
    frame.resize(frameWidth, frameHeight);

    const dotColor = { r: 0.4, g: 0.4, b: 0.4 };
    const opacity = strokeOpacity / 100;
    const radius = dotSize / 2;

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const dot = figma.createEllipse();
        dot.name = "Dot " + r + "-" + c;
        dot.x = c * cellSize - radius;
        dot.y = r * cellSize - radius;
        dot.resize(dotSize, dotSize);
        dot.fills = [{ type: 'SOLID', color: dotColor, opacity: opacity }];
        dot.strokes = [];
        frame.appendChild(dot);
      }
    }

    if (showBorder) {
      const border = figma.createRectangle();
      border.name = "Border";
      border.x = 0;
      border.y = 0;
      border.resize(cols * cellSize, rows * cellSize);
      border.fills = [];
      border.strokes = [{ type: 'SOLID', color: dotColor, opacity: opacity }];
      border.strokeWeight = strokeWeight || 1;
      border.strokeAlign = "INSIDE";
      frame.appendChild(border);
    }

    frame.x = Math.round(figma.viewport.center.x - frameWidth / 2);
    frame.y = Math.round(figma.viewport.center.y - frameHeight / 2);
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('Dotted grid created!');
  }

  // === LAYOUT GRID ===
  if (msg.type === 'create-layout-grid') {
    const { cols, rows, frameWidth, frameHeight, gutter, margin, cellW, cellH, strokeWeight, strokeOpacity, showBorder } = msg;

    const frame = figma.createFrame();
    frame.name = "Layout Grid";
    frame.fills = [];
    frame.clipsContent = true;
    frame.resize(frameWidth, frameHeight);

    const strokeColor = { r: 0.4, g: 0.4, b: 0.4 };
    const opacity = strokeOpacity / 100;

    function makLayoutLine(x1, y1, x2, y2) {
      const vec = figma.createVector();
      vec.vectorPaths = [{
        windingRule: "NONE",
        data: "M " + x1.toFixed(2) + " " + y1.toFixed(2) + " L " + x2.toFixed(2) + " " + y2.toFixed(2)
      }];
      vec.strokes = [{ type: 'SOLID', color: strokeColor, opacity: opacity }];
      vec.strokeWeight = strokeWeight;
      vec.strokeCap = "NONE";
      frame.appendChild(vec);
      return vec;
    }

    // Vertical lines — span full frame height
    for (let c = 0; c <= cols; c++) {
      const x = margin + c * (cellW + gutter);
      makLayoutLine(x, 0, x, frameHeight);
      if (c < cols && gutter > 0) {
        const x2 = x + cellW;
        makLayoutLine(x2, 0, x2, frameHeight);
      }
    }

    // Horizontal lines — span full frame width
    for (let r = 0; r <= rows; r++) {
      const y = margin + r * (cellH + gutter);
      makLayoutLine(0, y, frameWidth, y);
      if (r < rows && gutter > 0) {
        const y2 = y + cellH;
        makLayoutLine(0, y2, frameWidth, y2);
      }
    }

    if (showBorder) {
      const border = figma.createRectangle();
      border.name = "Border";
      border.x = 0;
      border.y = 0;
      border.resize(frameWidth, frameHeight);
      border.fills = [];
      border.strokes = [{ type: 'SOLID', color: strokeColor, opacity: opacity }];
      border.strokeWeight = strokeWeight * 1.5;
      border.strokeAlign = "INSIDE";
      frame.appendChild(border);
    }

    frame.x = Math.round(figma.viewport.center.x - frameWidth / 2);
    frame.y = Math.round(figma.viewport.center.y - frameHeight / 2);
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('Layout grid created!');
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
