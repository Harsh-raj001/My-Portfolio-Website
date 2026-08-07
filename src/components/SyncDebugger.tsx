"use client";
import React, { useRef } from 'react';
import { useScroll, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';

// Expected trajectory formulas (from cinematic design spec):
//   Camera Z  = 15 - progress * 515
//   Ship Z    = -progress * 350
// We measure actual vs expected to isolate interpolation/timing errors.

export function SyncDebugger() {
  const scroll = useScroll();
  const { camera, scene } = useThree();

  const displayRef = useRef<HTMLDivElement>(null);

  // Stats — accumulated until __resetSyncStats() called
  const maxCamErr  = useRef(-Infinity);
  const minCamErr  = useRef(Infinity);
  const maxShipErr = useRef(-Infinity);
  const minShipErr = useRef(Infinity);
  const maxDeltaErr = useRef(-Infinity);
  const minDeltaErr = useRef(Infinity);

  // FPS tracking
  const frameCount = useRef(0);
  const fpsTimer   = useRef(0);
  const lastFps    = useRef(0);
  const minFps     = useRef(9999);
  const fpsSamples = useRef<number[]>([]);

  // Velocity / phase tracking
  const prevOffset  = useRef(0);
  const velHistory  = useRef<number[]>([]);

  useFrame((_, delta) => {
    // --- FPS ---
    frameCount.current += 1;
    fpsTimer.current += delta;
    if (fpsTimer.current >= 0.5) {
      const fps = Math.round(frameCount.current / fpsTimer.current);
      lastFps.current = fps;
      if (fps < minFps.current) minFps.current = fps;
      fpsSamples.current.push(fps);
      if (fpsSamples.current.length > 20) fpsSamples.current.shift();
      frameCount.current = 0;
      fpsTimer.current   = 0;
    }

    // --- Core measurements ---
    const progress = scroll.offset;
    const actualCamZ  = camera.position.z;

    let actualShipZ = 0;
    const spacecraft = scene.getObjectByName('spacecraft');
    if (spacecraft) actualShipZ = spacecraft.position.z;

    // Expected positions per cinematic formula
    const expectedCamZ  = 15 - progress * 515;
    const expectedShipZ = -progress * 350;

    const cameraError = actualCamZ  - expectedCamZ;
    const shipError   = actualShipZ - expectedShipZ;

    const actualDelta   = actualShipZ  - actualCamZ;
    const expectedDelta = expectedShipZ - expectedCamZ;
    const deltaError    = actualDelta  - expectedDelta;

    // --- Accumulate error extremes ---
    if (cameraError  > maxCamErr.current)  maxCamErr.current  = cameraError;
    if (cameraError  < minCamErr.current)  minCamErr.current  = cameraError;
    if (shipError    > maxShipErr.current) maxShipErr.current = shipError;
    if (shipError    < minShipErr.current) minShipErr.current = shipError;
    if (deltaError   > maxDeltaErr.current) maxDeltaErr.current = deltaError;
    if (deltaError   < minDeltaErr.current) minDeltaErr.current = deltaError;

    // --- Phase detection ---
    const vel = (progress - prevOffset.current) / Math.max(delta, 0.001);
    prevOffset.current = progress;
    velHistory.current.push(vel);
    if (velHistory.current.length > 10) velHistory.current.shift();
    const avgVel = velHistory.current.reduce((a, b) => a + b, 0) / velHistory.current.length;
    const absVel = Math.abs(avgVel);
    let phase = 'IDLE';
    if      (absVel > 0.5)  phase = avgVel > 0 ? 'FAST\u2193' : 'FAST\u2191';
    else if (absVel > 0.05) phase = avgVel > 0 ? 'SLOW\u2193' : 'SLOW\u2191';
    else if (absVel > 0.005) phase = 'RELEASE';

    // --- Console log every 60 frames ---
    if (frameCount.current % 60 === 0) {
      console.log(
        `[SYNC] ${phase} | p=${progress.toFixed(4)} | camZ=${actualCamZ.toFixed(2)} (err=${cameraError.toFixed(2)}) | shipZ=${actualShipZ.toFixed(2)} (err=${shipError.toFixed(2)}) | \u0394err=${deltaError.toFixed(2)} | fps=${lastFps.current}`
      );
    }

    // --- Browser console helpers ---
    if (typeof window !== 'undefined') {
      (window as any).__resetSyncStats = () => {
        maxCamErr.current  = -Infinity; minCamErr.current  = Infinity;
        maxShipErr.current = -Infinity; minShipErr.current = Infinity;
        maxDeltaErr.current = -Infinity; minDeltaErr.current = Infinity;
        minFps.current = 9999;
        fpsSamples.current = [];
        console.log('[SYNC] Stats reset \u2014 start next test');
      };
      (window as any).__getSyncStats = () => {
        const avgFps = fpsSamples.current.length
          ? Math.round(fpsSamples.current.reduce((a, b) => a + b, 0) / fpsSamples.current.length)
          : null;
        const stats = {
          cameraError:  { min: +minCamErr.current.toFixed(2),   max: +maxCamErr.current.toFixed(2),   spread: +(maxCamErr.current - minCamErr.current).toFixed(2) },
          shipError:    { min: +minShipErr.current.toFixed(2),  max: +maxShipErr.current.toFixed(2),  spread: +(maxShipErr.current - minShipErr.current).toFixed(2) },
          deltaError:   { min: +minDeltaErr.current.toFixed(2), max: +maxDeltaErr.current.toFixed(2), spread: +(maxDeltaErr.current - minDeltaErr.current).toFixed(2) },
          fps:          { min: minFps.current, avg: avgFps },
        };
        console.table({ ...stats.cameraError });
        console.table({ ...stats.shipError });
        console.table({ ...stats.deltaError });
        console.table({ ...stats.fps });
        return stats;
      };
    }

    // --- DOM-direct overlay update (zero React setState) ---
    if (!displayRef.current) return;

    const errColor = (v: number) => Math.abs(v) < 1 ? '#10b981' : Math.abs(v) < 5 ? '#facc15' : '#f87171';
    const fpsColor = lastFps.current < 50 ? '#ffaa55' : '#10b981';

    const camErrSp  = maxCamErr.current  === -Infinity ? '\u2014' : (maxCamErr.current  - minCamErr.current).toFixed(2);
    const shipErrSp = maxShipErr.current === -Infinity ? '\u2014' : (maxShipErr.current - minShipErr.current).toFixed(2);
    const dErrSp    = maxDeltaErr.current=== -Infinity ? '\u2014' : (maxDeltaErr.current- minDeltaErr.current).toFixed(2);

    displayRef.current.innerHTML = `
<div style="font-weight:bold;margin-bottom:6px;color:#fff;font-size:11px;letter-spacing:1px">SYNC DIAGNOSTIC</div>
<div style="color:#888;font-size:10px">Phase: <b style="color:#facc15">${phase}</b>  FPS: <b style="color:${fpsColor}">${lastFps.current}</b>  (min ${minFps.current === 9999 ? '\u2014' : minFps.current})</div>
<div style="margin-top:6px;border-top:1px solid #333;padding-top:4px">
  <div style="color:#aaa">Progress:  <b style="color:#fff">${progress.toFixed(4)}</b></div>
</div>
<div style="margin-top:6px;border-top:1px solid #333;padding-top:4px">
  <div>Camera Z:  <b>${actualCamZ.toFixed(2)}</b></div>
  <div style="color:#888">Expected:  ${expectedCamZ.toFixed(2)}</div>
  <div>Cam Err:   <b style="color:${errColor(cameraError)}">${cameraError.toFixed(2)}</b>  <span style="color:#555">(spread ${camErrSp})</span></div>
</div>
<div style="margin-top:6px;border-top:1px solid #333;padding-top:4px">
  <div>Ship Z:    <b>${actualShipZ.toFixed(2)}</b></div>
  <div style="color:#888">Expected:  ${expectedShipZ.toFixed(2)}</div>
  <div>Ship Err:  <b style="color:${errColor(shipError)}">${shipError.toFixed(2)}</b>  <span style="color:#555">(spread ${shipErrSp})</span></div>
</div>
<div style="margin-top:6px;border-top:1px solid #333;padding-top:4px">
  <div>Actual \u0394:  <b>${actualDelta.toFixed(2)}</b></div>
  <div style="color:#888">Expected \u0394: ${expectedDelta.toFixed(2)}</div>
  <div style="color:${errColor(deltaError)};font-weight:bold">\u0394 Error:   ${deltaError.toFixed(2)}  <span style="color:#555">(spread ${dErrSp})</span></div>
</div>
<div style="margin-top:4px;font-size:10px;color:#444">__resetSyncStats() / __getSyncStats()</div>`;
  });

  return (
    <Html
      center={false}
      position={[0, 0, 0]}
      zIndexRange={[9999, 10000]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={displayRef}
        id="sync-debugger"
        style={{
          position:   'fixed',
          bottom:     '20px',
          left:       '20px',
          background: 'rgba(0,0,0,0.90)',
          color:      '#00F0FF',
          padding:    '12px 16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize:   '12px',
          border:     '1px solid rgba(0,240,255,0.25)',
          pointerEvents: 'none',
          whiteSpace: 'pre',
          zIndex:      9999,
          minWidth:   '230px',
          lineHeight: '1.65',
        }}
      />
    </Html>
  );
}


