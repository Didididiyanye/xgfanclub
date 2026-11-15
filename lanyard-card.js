(function(){
'use strict';
const THREE = window.THREE;
if (!THREE) throw new Error('Three.js is not loaded');

const CARD_W = 1.58;
const CARD_H = 2.12;
const CARD_RADIUS = 0.11;
const CARD_DEPTH = 0.09;
const SLOT_W = 0.205;
const SLOT_H = 0.05;
const SLOT_FROM_TOP = 0.115;
const ACCENT = '#ff2f3f';
const STRAP_PATH_SEGS = 48;
const STRAP_RADIAL_SEGS = 12;

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

function roundedShape(w, h, r, slot){
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  if (slot){
    const cy = h / 2 - SLOT_FROM_TOP;
    const rr = SLOT_H / 2;
    const left = -SLOT_W / 2;
    const right = SLOT_W / 2;
    const hole = new THREE.Path();
    hole.moveTo(left + rr, cy - rr);
    hole.lineTo(right - rr, cy - rr);
    hole.quadraticCurveTo(right, cy - rr, right, cy);
    hole.quadraticCurveTo(right, cy + rr, right - rr, cy + rr);
    hole.lineTo(left + rr, cy + rr);
    hole.quadraticCurveTo(left, cy + rr, left, cy);
    hole.quadraticCurveTo(left, cy - rr, left + rr, cy - rr);
    shape.holes.push(hole);
  }
  return shape;
}

function shapeGeometry(shape, w, h){
  const geo = new THREE.ShapeGeometry(shape, 18);
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++){
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

function makeStrapTexture(){
  const c = document.createElement('canvas');
  c.width = 256; c.height = 1024;
  const ctx = c.getContext('2d');
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, c.width, c.height);

  /* Woven webbing */
  ctx.lineWidth = 1.4;
  for (let i = -c.height; i < c.width + c.height; i += 5){
    ctx.strokeStyle = i % 10 === 0 ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.16)';
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + c.height, c.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i + c.height, 0); ctx.lineTo(i, c.height); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  ctx.fillRect(0, 0, 5, c.height);
  ctx.fillRect(Math.round(c.width * .5) - 2, 0, 5, c.height);

  /* Text follows the strap length; it is printed on both visible faces. */
  const print = 'XG   ·   ';
  ctx.fillStyle = 'rgba(255,255,255,.94)';
  ctx.font = '700 54px "Arial", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const runW = Math.max(1, ctx.measureText(print).width);
  const runs = Math.max(1, Math.round(c.height / runW));
  const stretch = c.height / (runs * runW);
  for (const u of [.25, .75]){
    ctx.save();
    ctx.translate(c.width * u, 0);
    ctx.rotate(Math.PI / 2);
    ctx.scale(stretch, -1);
    for (let i = 0; i < runs; i++) ctx.fillText(print, i * runW, 0);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1.45);
  tex.anisotropy = 8;
  return tex;
}

function makeTexture(canvas){
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function makeWebbingGeometry(pathSegs, radialSegs){
  const rings = pathSegs + 1;
  const cols = radialSegs + 1;
  const positions = new Float32Array(rings * cols * 3);
  const normals = new Float32Array(rings * cols * 3);
  const uvs = new Float32Array(rings * cols * 2);
  const index = [];
  for (let i = 0; i <= pathSegs; i++){
    for (let j = 0; j <= radialSegs; j++){
      const k = i * cols + j;
      uvs[k * 2] = j / radialSegs;
      uvs[k * 2 + 1] = i / pathSegs;
    }
  }
  for (let i = 0; i < pathSegs; i++){
    for (let j = 0; j < radialSegs; j++){
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      const c = (i + 1) * cols + j + 1;
      const d = i * cols + j + 1;
      index.push(a, b, d, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  return { geometry, positions, normals, pathSegs, radialSegs, cols };
}

function updateWebbing(web, points, camera, halfW, halfT){
  if (points.length < 2) return;
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', .45);
  const tan = new THREE.Vector3();
  const view = new THREE.Vector3();
  const side = new THREE.Vector3();
  const bin = new THREE.Vector3();
  const normal = new THREE.Vector3();
  for (let i = 0; i <= web.pathSegs; i++){
    const t = i / web.pathSegs;
    const point = curve.getPoint(t);
    tan.copy(curve.getTangent(t));
    if (tan.lengthSq() < 1e-8) tan.set(0, -1, 0); else tan.normalize();
    view.subVectors(camera.position, point);
    if (view.lengthSq() < 1e-8) view.set(0, 0, 1); else view.normalize();
    side.crossVectors(tan, view);
    if (side.lengthSq() < 1e-8) side.set(1, 0, 0); else side.normalize();
    bin.crossVectors(tan, side);
    if (bin.lengthSq() < 1e-8) bin.set(0, 0, 1); else bin.normalize();
    for (let j = 0; j <= web.radialSegs; j++){
      const angle = j / web.radialSegs * Math.PI * 2;
      const cx = Math.cos(angle);
      const sy = Math.sin(angle);
      const k = i * web.cols + j;
      web.positions[k * 3] = point.x + side.x * cx * halfW + bin.x * sy * halfT;
      web.positions[k * 3 + 1] = point.y + side.y * cx * halfW + bin.y * sy * halfT;
      web.positions[k * 3 + 2] = point.z + side.z * cx * halfW + bin.z * sy * halfT;
      normal.set(side.x * cx / halfW + bin.x * sy / halfT,
                 side.y * cx / halfW + bin.y * sy / halfT,
                 side.z * cx / halfW + bin.z * sy / halfT);
      if (normal.lengthSq() < 1e-8) normal.copy(side); else normal.normalize();
      web.normals[k * 3] = normal.x;
      web.normals[k * 3 + 1] = normal.y;
      web.normals[k * 3 + 2] = normal.z;
    }
  }
  const pos = web.geometry.getAttribute('position');
  const nor = web.geometry.getAttribute('normal');
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  web.geometry.computeBoundingSphere();
}

function disposeMaterial(material){
  if (!material) return;
  if (material.map) material.map.dispose();
  material.dispose();
}

function createLanyardPass(options){
  const { stage, frontCanvas, backCanvas, getCardRect, onReady, onError } = options;
  if (!stage || !frontCanvas || !backCanvas || !getCardRect) throw new Error('Lanyard options incomplete');

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.domElement.className = 'lanyard-canvas';
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200000);
  const cardGroup = new THREE.Group();
  cardGroup.renderOrder = 2;
  scene.add(cardGroup);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: .34, metalness: .18 });
  const bodyGeo = new THREE.ExtrudeGeometry(roundedShape(CARD_W, CARD_H, CARD_RADIUS, true), {
    depth: CARD_DEPTH, bevelEnabled: true, bevelSegments: 3, steps: 1,
    bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 18
  });
  bodyGeo.translate(0, 0, -CARD_DEPTH / 2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  cardGroup.add(body);

  const faceGeo = shapeGeometry(roundedShape(CARD_W, CARD_H, CARD_RADIUS, true), CARD_W, CARD_H);
  const backGeo = faceGeo.clone();
  const frontMat = new THREE.MeshStandardMaterial({ map: makeTexture(frontCanvas), roughness: .27, metalness: .05, side: THREE.FrontSide });
  const backMat = new THREE.MeshStandardMaterial({ map: makeTexture(backCanvas), roughness: .4, metalness: .03, side: THREE.FrontSide });
  const faceOffset = CARD_DEPTH / 2 + 0.025;
  const front = new THREE.Mesh(faceGeo, frontMat);
  front.position.z = faceOffset;
  front.renderOrder = 3;
  cardGroup.add(front);
  const back = new THREE.Mesh(backGeo, backMat);
  back.rotation.y = Math.PI;
  back.position.z = -faceOffset;
  back.renderOrder = 3;
  cardGroup.add(back);

  /* Grommet around the slot: hides the opening edge and prevents the strap
     from visually cutting through the card surface. */
  const slotY = CARD_H / 2 - SLOT_FROM_TOP;
  const connectorTopY = slotY + 0.185;
  const grommetMat = new THREE.MeshStandardMaterial({ color: 0x303037, roughness: .22, metalness: .9 });
  const grommetGeo = new THREE.TorusGeometry(0.075, 0.014, 10, 28);
  const ringGeo = new THREE.TorusGeometry(0.064, 0.012, 9, 24);
  const linkGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.085, 8);

  const grommet = new THREE.Mesh(grommetGeo, grommetMat);
  grommet.position.set(0, slotY, 0);
  grommet.scale.set(1.28, 0.34, 1);
  grommet.renderOrder = 4;
  cardGroup.add(grommet);

  const connectorRing = new THREE.Mesh(ringGeo, grommetMat);
  connectorRing.position.set(0, slotY + 0.105, 0);
  connectorRing.scale.set(.78, 1.18, 1);
  connectorRing.renderOrder = 4;
  cardGroup.add(connectorRing);

  const connectorLink = new THREE.Mesh(linkGeo, grommetMat);
  connectorLink.position.set(0, slotY + 0.035, 0);
  connectorLink.renderOrder = 4;
  cardGroup.add(connectorLink);

  const lineMat = new THREE.LineBasicMaterial({ color: 0xff2f3f, transparent: true, opacity: .38 });
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo, 32), lineMat);
  cardGroup.add(edges);

  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-220, 260, 420);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff4153, 1.1);
  rim.position.set(260, -80, -200);
  scene.add(rim);

  const strapTex = makeStrapTexture();
  const strapMat = new THREE.MeshStandardMaterial({ map: strapTex, roughness: .72, metalness: .01 });
  const webbing = makeWebbingGeometry(STRAP_PATH_SEGS, STRAP_RADIAL_SEGS);
  const strap = new THREE.Mesh(webbing.geometry, strapMat);
  strap.renderOrder = 1;
  strap.frustumCulled = false;
  scene.add(strap);

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const planeHit = new THREE.Vector3();
  const dragAnchor = new THREE.Vector3();
  const slotWorld = new THREE.Vector3();

  let disposed = false;
  let raf = 0;
  let last = performance.now();
  let W = 1, H = 1, stageRect = stage.getBoundingClientRect();
  let restX = 0, restY = 0, cardX = 0, cardY = 0, targetX = 0, targetY = 0;
  let restStrapLength = 200;
  let velocityX = 0, velocityY = 0, positionReady = false;
  let dragging = false, dragX = 0, dragY = 0, dragYaw = 0, dragPitch = 0;
  let dragCardX = 0, dragCardY = 0, dragLastX = 0, dragLastY = 0, dragLastT = 0;
  let flipBase = 0;
  let targetYaw = 0, targetPitch = 0, yaw = 0, pitch = 0, roll = 0;
  let velocityYaw = 0, velocityPitch = 0;
  let sway = 0, swayV = 0;
  let active = true;

  function updateLayout(){
    stageRect = stage.getBoundingClientRect();
    W = Math.max(1, stageRect.width);
    H = Math.max(1, stageRect.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = 30;
    camera.position.set(W / 2, H / 2, (H / 2) / Math.tan(THREE.MathUtils.degToRad(30 / 2)));
    camera.lookAt(W / 2, H / 2, 0);
    camera.updateProjectionMatrix();

    const r = getCardRect();
    const relTop = r.top - stageRect.top;
    const relLeft = r.left - stageRect.left;
    /* The editing wrapper is already scaled; use its real rect so activation
       does not shrink the card a second time. */
    const sx = r.width / CARD_W;
    const sy = r.height / CARD_H;
    const nextRestX = relLeft + r.width / 2;
    const nextRestY = H - (relTop + r.height / 2);
    if (positionReady){
      cardX += nextRestX - restX;
      cardY += nextRestY - restY;
      targetX += nextRestX - restX;
      targetY += nextRestY - restY;
    } else {
      cardX = targetX = nextRestX;
      cardY = targetY = nextRestY;
      positionReady = true;
    }
    restX = nextRestX;
    restY = nextRestY;
    const anchorHeight = Math.max(40, H * .05);
    restStrapLength = Math.max(120, (H + anchorHeight) - (restY + connectorTopY * sy));
    cardGroup.scale.set(sx, sy, (sx + sy) / 2);
    cardGroup.position.set(cardX, cardY, 0);
  }

  function clampStrapReach(x, y){
    /* 参考组件使用“相对静止位置的位移半径”限制挂绳孔，而不是只看页面边界。
       这能阻止卡片被拖进上方织带，同时保留左右和上下摆动空间。 */
    const travel = W < 420 ? .55 : 1;
    const maxTravel = restStrapLength * .85 * travel;
    let cdx = x - restX;
    let cdy = y - restY;
    const centerDist = Math.hypot(cdx, cdy);
    if (centerDist > maxTravel && centerDist > .001){
      const ck = maxTravel / centerDist;
      x = restX + cdx * ck;
      y = restY + cdy * ck;
    }

    /* 再保证孔位与顶部锚点之间至少有安全绳长，避免织带折返穿过卡片。 */
    const euler = new THREE.Euler(targetPitch, targetYaw, roll, 'XYZ');
    const slotOffset = new THREE.Vector3(0, connectorTopY, 0)
      .applyEuler(euler)
      .multiply(cardGroup.scale);
    const anchor = new THREE.Vector3(W / 2, H + Math.max(40, H * .05), 0);
    const sx = x + slotOffset.x;
    const sy = y + slotOffset.y;
    let dx = sx - anchor.x;
    let dy = sy - anchor.y;
    const d = Math.hypot(dx, dy);
    const minReach = restStrapLength * .72;
    if (d > .001 && d < minReach){
      const k = minReach / d;
      x = anchor.x + dx * k - slotOffset.x;
      y = anchor.y + dy * k - slotOffset.y;
    }
    return { x, y };
  }

  function buildStrap(){
    cardGroup.updateMatrixWorld(true);
    slotWorld.set(0, connectorTopY, 0);
    cardGroup.localToWorld(slotWorld);
    const anchor = new THREE.Vector3(W / 2, H + Math.max(40, H * .05), 0);
    const p1 = anchor.clone().lerp(slotWorld, .27);
    const p2 = anchor.clone().lerp(slotWorld, .52);
    const p3 = anchor.clone().lerp(slotWorld, .77);
    const lateral = sway;
    p1.x += lateral * .62;
    p2.x += lateral * .19;
    p3.x -= lateral * .3;
    p1.y += Math.sin(performance.now() * .0011) * 1.2;
    const halfW = Math.max(7.2, W * .0067);
    const halfT = Math.max(1.45, W * .00125);
    updateWebbing(webbing, [anchor, p1, p2, p3, slotWorld], camera, halfW, halfT);
  }

  function tick(now){
    if (disposed) return;
    const dt = Math.min(34, Math.max(8, now - last)); last = now;
    const frameScale = dt / 16.67;
    const ease = 1 - Math.pow(.84, frameScale);

    if (dragging){
      const safe = clampStrapReach(targetX, targetY);
      targetX = safe.x; targetY = safe.y;
      const follow = 1 - Math.pow(.52, frameScale);
      cardX += (targetX - cardX) * follow;
      cardY += (targetY - cardY) * follow;
    } else {
      velocityX *= Math.pow(.90, frameScale);
      velocityY *= Math.pow(.90, frameScale);
      cardX += velocityX * frameScale;
      cardY += velocityY * frameScale;
      const home = 1 - Math.pow(.925, frameScale);
      cardX += (restX - cardX) * home;
      cardY += (restY - cardY) * home;
      velocityYaw *= Math.pow(.9, frameScale);
      velocityPitch *= Math.pow(.9, frameScale);
      targetYaw += velocityYaw;
      targetPitch += velocityPitch;
    }

    yaw += (targetYaw - yaw) * ease;
    pitch += (targetPitch - pitch) * ease;
    roll += ((-pitch * .12) - roll) * ease;

    const margin = Math.min(W * .22, 120);
    cardX = clamp(cardX, margin, W - margin);
    cardY = clamp(cardY, 90, H - 80);
    cardGroup.position.set(cardX, cardY, Math.sin(now * .0013) * 2.2);
    cardGroup.rotation.set(pitch, yaw, roll);

    const swayTarget = -Math.sin(yaw - flipBase) * 34 - pitch * 16 - velocityX * 1.6;
    swayV += (swayTarget - sway) * .065;
    swayV *= .9;
    sway += swayV;
    buildStrap();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function pointerOnPlane(e, out){
    const r = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
    pointerNdc.y = -((e.clientY - r.top) / (r.height || 1)) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    return raycaster.ray.intersectPlane(dragPlane, out);
  }

  function onPointerMove(e){
    if (!active || dragging) return;
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - .5) * 2;
    const ny = ((e.clientY - r.top) / r.height - .5) * 2;
    targetYaw = flipBase + clamp(nx, -1, 1) * .3;
    targetPitch = clamp(ny, -1, 1) * .2;
  }
  function onPointerLeave(){ if (!dragging && active){ targetYaw = flipBase; targetPitch = 0; } }

  function onDown(e){
    if (!active) return;
    const r = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
    pointerNdc.y = -((e.clientY - r.top) / (r.height || 1)) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    if (!raycaster.intersectObjects([body, front, back], true).length) return;
    if (!pointerOnPlane(e, dragAnchor)) return;
    e.preventDefault();
    dragging = true;
    dragX = e.clientX; dragY = e.clientY;
    dragYaw = targetYaw; dragPitch = targetPitch;
    dragCardX = targetX; dragCardY = targetY;
    dragLastX = dragAnchor.x; dragLastY = dragAnchor.y;
    dragLastT = performance.now();
    renderer.domElement.style.cursor = 'grabbing';
    renderer.domElement.setPointerCapture?.(e.pointerId);
  }

  function onDrag(e){
    if (!dragging) return;
    if (!pointerOnPlane(e, planeHit)) return;
    const dx = planeHit.x - dragAnchor.x;
    const dy = planeHit.y - dragAnchor.y;
    targetYaw = dragYaw + (e.clientX - dragX) * .007;
    targetPitch = clamp(dragPitch + (e.clientY - dragY) * .005, -.62, .62);
    targetX = clamp(dragCardX + dx, 60, W - 60);
    targetY = clamp(dragCardY + dy, 90, H - 80);
    const safe = clampStrapReach(targetX, targetY);
    targetX = safe.x;
    targetY = safe.y;
    const now = performance.now();
    const frames = Math.max(1, (now - dragLastT) / 16.67);
    velocityX = clamp((planeHit.x - dragLastX) / frames, -28, 28);
    velocityY = clamp((planeHit.y - dragLastY) / frames, -28, 28);
    velocityYaw = clamp((e.movementX || 0) * .0008, -.02, .02);
    velocityPitch = clamp((e.movementY || 0) * .0006, -.02, .02);
    dragLastX = planeHit.x; dragLastY = planeHit.y; dragLastT = now;
  }

  function onUp(e){
    if (!dragging) return;
    dragging = false;
    renderer.domElement.style.cursor = 'grab';
    try { if (renderer.domElement.hasPointerCapture?.(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  renderer.domElement.style.cursor = 'grab';
  updateLayout();
  buildStrap();
  window.addEventListener('resize', updateLayout);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointermove', onDrag);
  renderer.domElement.addEventListener('pointerup', onUp);
  renderer.domElement.addEventListener('pointercancel', onUp);

  try { renderer.render(scene, camera); }
  catch (err){ if (onError) onError(err); }

  raf = requestAnimationFrame(tick);
  requestAnimationFrame(() => {
    if (disposed) return;
    renderer.domElement.classList.add('is-visible');
    if (onReady) onReady();
  });

  return {
    canvas: renderer.domElement,
    setActive(v){ active = !!v; },
    flip(isBack){
      flipBase = isBack ? Math.PI : 0;
      targetYaw = flipBase;
      targetPitch = 0;
    },
    reset(){
      flipBase = 0; targetYaw = 0; targetPitch = 0;
      velocityYaw = 0; velocityPitch = 0;
      targetX = restX; targetY = restY; velocityX = 0; velocityY = 0;
    },
    getState(){ return { x:cardX, y:cardY, scaleX:cardGroup.scale.x, scaleY:cardGroup.scale.y, yaw, pitch, targetYaw, targetPitch, flipBase, dragging }; },
    destroy(){
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateLayout);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointermove', onDrag);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointercancel', onUp);
      webbing.geometry.dispose();
      scene.remove(strap);
      disposeMaterial(frontMat); disposeMaterial(backMat); disposeMaterial(bodyMat);
      disposeMaterial(grommetMat); disposeMaterial(strapMat);
      faceGeo.dispose(); backGeo.dispose(); bodyGeo.dispose(); grommetGeo.dispose(); ringGeo.dispose(); linkGeo.dispose();
      edges.geometry.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}

function supportsWebGL(){
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (_) { return false; }
}

window.XGLanyard = { createLanyardPass, supportsWebGL };
})();
