/* @ds-bundle: {"format":3,"namespace":"OdysseusDesignSystem_02180e","components":[{"name":"THEMES","sourcePath":"themes.ts"},{"name":"THEME_KEYS","sourcePath":"themes.ts"},{"name":"DEFAULT_THEME","sourcePath":"themes.ts"}],"sourceHashes":{"compare/design-canvas.jsx":"bd8746af6e58","themes.ts":"50c0747d16f8","ui_kits/putty-app/App.tsx":"46531d3b1fd3","ui_kits/putty-app/Composer.tsx":"78ed5bb82bcd","ui_kits/putty-app/Login.tsx":"a64dc47aaf5e","ui_kits/putty-app/Messages.tsx":"c00a5c030196","ui_kits/putty-app/Sidebar.tsx":"27769fca595e","ui_kits/putty-app/controls.tsx":"dd05ae6448e1","ui_kits/putty-app/data.tsx":"cf46b4ad0bc1","ui_kits/putty-app/icons.tsx":"f7c6773abb1c","ui_kits/putty-app/overlays.tsx":"e7e6cbf6ded5","ui_kits/putty-app/showcase.tsx":"62aee51080f2"},"inlinedExternals":[],"unexposedExports":[{"name":"applyTheme","sourcePath":"themes.ts"}]} */

(() => {

const __ds_ns = (window.OdysseusDesignSystem_02180e = window.OdysseusDesignSystem_02180e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// compare/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "compare/design-canvas.jsx", error: String((e && e.message) || e) }); }

// themes.ts
try { (() => {
// themes.ts — the full built-in theme set, lifted verbatim from the source app
// (pewdiepie-archdaemon/odysseus → static/js/theme.js, `export const THEMES`).
//
// Each theme is defined by FIVE base colors — bg, fg, panel, border, accent
// (the source calls the accent `red`) — exactly as the product stores them.
// Optional `advanced` overrides specific component colors (only `gpt` uses them).
// `meta` carries the source app's default background pattern / effect settings.
//
// To apply a theme, set `data-theme="<key>"` on a container and load `themes.css`
// (which contains the fully-derived token set per theme), or call applyTheme().

// Order mirrors the source app's swatch grid. "dark" is the original default.
const THEMES = {
  putty: {
    key: 'putty',
    label: 'putty (mono)',
    light: false,
    colors: {
      bg: '#0e0e10',
      fg: '#eaeaec',
      panel: '#1b1c1f',
      border: '#313338',
      accent: '#e06c75'
    },
    meta: {
      pattern: 'dots'
    }
  },
  'putty-light': {
    key: 'putty-light',
    label: 'putty (light)',
    light: true,
    colors: {
      bg: '#f5f5f6',
      fg: '#1b1c1f',
      panel: '#ffffff',
      border: '#e3e3e6',
      accent: '#c2454f'
    },
    meta: {
      pattern: 'dots'
    }
  },
  dark: {
    key: 'dark',
    label: 'Original',
    light: false,
    colors: {
      bg: '#282c34',
      fg: '#9cdef2',
      panel: '#111111',
      border: '#355a66',
      accent: '#e06c75'
    },
    meta: {
      pattern: 'none'
    }
  },
  light: {
    key: 'light',
    label: 'Light',
    light: true,
    colors: {
      bg: '#f0ebe3',
      fg: '#5a5248',
      panel: '#faf6f0',
      border: '#d4cdc2',
      accent: '#c47d5a'
    },
    meta: {
      pattern: 'dots'
    }
  },
  midnight: {
    key: 'midnight',
    label: 'Midnight',
    light: false,
    colors: {
      bg: '#0d1117',
      fg: '#c9d1d9',
      panel: '#161b22',
      border: '#30363d',
      accent: '#f85149'
    },
    meta: {
      pattern: 'rain',
      effectColor: '#ffffff',
      intensity: 0.5
    }
  },
  paper: {
    key: 'paper',
    label: 'Paper',
    light: true,
    colors: {
      bg: '#faf8f5',
      fg: '#3b3836',
      panel: '#ffffff',
      border: '#d5d0c8',
      accent: '#c5ac4a'
    },
    meta: {
      pattern: 'dots'
    }
  },
  cyberpunk: {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    light: false,
    colors: {
      bg: '#0a0a0f',
      fg: '#0ff0fc',
      panel: '#12101a',
      border: '#9b30ff',
      accent: '#e040fb'
    },
    meta: {
      pattern: 'synapse'
    }
  },
  retrowave: {
    key: 'retrowave',
    label: 'Retrowave',
    light: false,
    colors: {
      bg: '#1a1a2e',
      fg: '#e94560',
      panel: '#16213e',
      border: '#533483',
      accent: '#e94560'
    },
    meta: {
      pattern: 'embers'
    }
  },
  forest: {
    key: 'forest',
    label: 'Forest',
    light: false,
    colors: {
      bg: '#1b2a1b',
      fg: '#a8d5a2',
      panel: '#142414',
      border: '#3d6b3d',
      accent: '#7cb871'
    },
    meta: {
      pattern: 'petals'
    }
  },
  ocean: {
    key: 'ocean',
    label: 'Ocean',
    light: false,
    colors: {
      bg: '#0b1a2c',
      fg: '#64d2ff',
      panel: '#091422',
      border: '#1e5074',
      accent: '#4facfe'
    },
    meta: {
      pattern: 'constellations'
    }
  },
  ume: {
    key: 'ume',
    label: 'Ume',
    light: false,
    colors: {
      bg: '#2b1b2e',
      fg: '#f5c2e7',
      panel: '#1e1420',
      border: '#6c4675',
      accent: '#f5a0c0'
    },
    meta: {
      pattern: 'petals',
      effectColor: '#f5a0c0'
    }
  },
  copper: {
    key: 'copper',
    label: 'Copper',
    light: false,
    colors: {
      bg: '#1c1410',
      fg: '#e8c39e',
      panel: '#140f0a',
      border: '#7a5533',
      accent: '#d4764e'
    }
  },
  terminal: {
    key: 'terminal',
    label: 'Terminal',
    light: false,
    colors: {
      bg: '#000000',
      fg: '#00ff41',
      panel: '#0a0a0a',
      border: '#003b00',
      accent: '#00ff41'
    },
    meta: {
      pattern: 'perlin-flow',
      intensity: 0.8
    }
  },
  organs: {
    key: 'organs',
    label: 'Organs',
    light: false,
    colors: {
      bg: '#0a0406',
      fg: '#efe1c8',
      panel: '#15080a',
      border: '#3a1519',
      accent: '#c83240'
    },
    meta: {
      pattern: 'rain',
      effectColor: '#451616',
      intensity: 0.65
    }
  },
  lavender: {
    key: 'lavender',
    label: 'Lavender',
    light: true,
    colors: {
      bg: '#f3eef8',
      fg: '#3d3551',
      panel: '#faf7ff',
      border: '#cec3de',
      accent: '#9b6dcc'
    },
    meta: {
      frosted: true
    }
  },
  gpt: {
    key: 'gpt',
    label: 'GPT',
    light: false,
    colors: {
      bg: '#212121',
      fg: '#ececec',
      panel: '#171717',
      border: '#424242',
      accent: '#949494'
    },
    advanced: {
      sendBtnBg: '#949494',
      sendBtnHover: '#7f7f7f',
      userBubbleBg: '#2f2f2f',
      aiBubbleBg: '#171717',
      inputBg: '#2f2f2f'
    }
  },
  claude: {
    key: 'claude',
    label: 'Claude',
    light: false,
    colors: {
      bg: '#262624',
      fg: '#f5f4f0',
      panel: '#30302e',
      border: '#4a4a47',
      accent: '#c6613f'
    }
  },
  cute: {
    key: 'cute',
    label: 'Cute',
    light: true,
    colors: {
      bg: '#fff0f5',
      fg: '#d4608a',
      panel: '#fff8fa',
      border: '#f0c0d0',
      accent: '#ff6b9d'
    },
    meta: {
      pattern: 'sparkles',
      effectColor: '#ff8cb8'
    }
  }
};
const THEME_KEYS = Object.keys(THEMES);
const DEFAULT_THEME = 'putty';

/**
 * Apply a theme by toggling `data-theme` on the given element (defaults to
 * <html>). Requires `themes.css` to be loaded. Returns the resolved Theme.
 */
function applyTheme(key, el = document.documentElement) {
  const theme = THEMES[key] || THEMES[DEFAULT_THEME];
  el.dataset.theme = theme.key;
  return theme;
}
Object.assign(__ds_scope, { THEMES, THEME_KEYS, DEFAULT_THEME, applyTheme });
})(); } catch (e) { __ds_ns.__errors.push({ path: "themes.ts", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/App.tsx
try { (() => {
// App.tsx — assembles the putty-ai workspace into a click-through prototype.
// Flow: login → welcome → type a message → session is created, assistant "streams" a reply.

// A few brand-flavored canned replies so the demo feels alive (no backend).
const REPLIES = ["Hey — warmed up and running locally on your hardware. Nothing leaves this machine unless you point me at an external endpoint. What are we building?", "Good question. In `Agent` mode I can plan the task, call tools — `bash`, files, web search, memory — and work through it end to end. Want me to take it from here?", "I can serve that model for you from the `Cookbook` — it scans your VRAM, scores the fit, and starts a llama.cpp or vLLM server. Say the word and I'll spin it up."];
let uid = 0;
const nextId = () => 'm' + ++uid;

// All built-in themes from the source app (see /themes.ts and /themes.css).
// `putty` is the monochrome house brand and the default.
const THEME_LIST = [{
  key: 'putty',
  label: 'putty (mono)'
}, {
  key: 'putty-light',
  label: 'putty (light)'
}, {
  key: 'dark',
  label: 'Original'
}, {
  key: 'light',
  label: 'Light'
}, {
  key: 'midnight',
  label: 'Midnight'
}, {
  key: 'paper',
  label: 'Paper'
}, {
  key: 'cyberpunk',
  label: 'Cyberpunk'
}, {
  key: 'retrowave',
  label: 'Retrowave'
}, {
  key: 'forest',
  label: 'Forest'
}, {
  key: 'ocean',
  label: 'Ocean'
}, {
  key: 'ume',
  label: 'Ume'
}, {
  key: 'copper',
  label: 'Copper'
}, {
  key: 'terminal',
  label: 'Terminal'
}, {
  key: 'organs',
  label: 'Organs'
}, {
  key: 'lavender',
  label: 'Lavender'
}, {
  key: 'gpt',
  label: 'GPT'
}, {
  key: 'claude',
  label: 'Claude'
}, {
  key: 'cute',
  label: 'Cute'
}];
function ThemeSwitcher({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "theme-switch",
    title: "Theme"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2a7 7 0 0 0 0 20 4 4 0 0 1 0-8 4 4 0 0 0 0-8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "9",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "14",
    r: "1.3",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    "aria-label": "Select theme"
  }, THEME_LIST.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.key,
    value: t.key
  }, t.label))));
}
function App() {
  const [userName, setUserName] = React.useState(null);
  const [sessions, setSessions] = React.useState([]);
  const [activeId, setActiveId] = React.useState(null);
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState('agent');
  const [webOn, setWebOn] = React.useState(false);
  const [shellOn, setShellOn] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [model] = React.useState('llama-3.1-8b');
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem('putty-kit-theme') || 'putty';
    } catch {
      return 'putty';
    }
  });
  const replyIdx = React.useRef(0);

  // Apply the theme by toggling data-theme on <html> (themes.css does the rest).
  // Suppress transitions for one frame so switching themes can't leave a
  // var()-based background/color stuck mid-fade.
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    root.dataset.theme = theme;
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.removeAttribute('data-theme-switching')));
    try {
      localStorage.setItem('putty-kit-theme', theme);
    } catch {/* ignore */}
    return () => window.cancelAnimationFrame(id);
  }, [theme]);
  const active = sessions.find(s => s.id === activeId) || null;
  const messages = active ? active.messages : [];
  const patchSession = (id, fn) => setSessions(prev => prev.map(s => s.id === id ? fn(s) : s));
  const streamReply = sessionId => {
    const full = REPLIES[replyIdx.current % REPLIES.length];
    replyIdx.current += 1;
    const aiId = nextId();
    patchSession(sessionId, s => ({
      ...s,
      messages: [...s.messages, {
        id: aiId,
        role: 'ai',
        text: '',
        streaming: true
      }]
    }));
    const words = full.split(' ');
    let i = 0;
    const tick = () => {
      i += 1;
      const partial = words.slice(0, i).join(' ');
      const done = i >= words.length;
      patchSession(sessionId, s => ({
        ...s,
        messages: s.messages.map(m => m.id === aiId ? {
          ...m,
          text: partial,
          streaming: !done
        } : m)
      }));
      if (!done) window.setTimeout(tick, 38 + Math.random() * 34);
    };
    window.setTimeout(tick, 260);
  };
  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    let sessionId = activeId;
    if (!sessionId) {
      sessionId = nextId();
      const title = text.length > 30 ? text.slice(0, 30) + '…' : text;
      const sess = {
        id: sessionId,
        title,
        messages: []
      };
      setSessions(prev => [sess, ...prev]);
      setActiveId(sessionId);
    }
    const sid = sessionId;
    patchSession(sid, s => ({
      ...s,
      messages: [...s.messages, {
        id: nextId(),
        role: 'user',
        text
      }]
    }));
    streamReply(sid);
  };
  const newChat = () => {
    setActiveId(null);
    setInput('');
    setNavOpen(false);
  };
  if (!userName) return /*#__PURE__*/React.createElement(Login, {
    onLogin: setUserName
  });
  return /*#__PURE__*/React.createElement("div", {
    className: 'app' + (navOpen ? ' nav-open' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-scrim",
    onClick: () => setNavOpen(false)
  }), /*#__PURE__*/React.createElement(Sidebar, {
    sessions: sessions,
    activeSession: activeId,
    activeTool: null,
    userName: userName,
    onNewChat: newChat,
    onSelectSession: id => {
      setActiveId(id);
      setNavOpen(false);
    },
    onSelectTool: () => setNavOpen(false),
    onBrandClick: newChat,
    onBurger: () => setNavOpen(v => !v)
  }), /*#__PURE__*/React.createElement("main", {
    className: "chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "topbar-burger",
    "aria-label": "Open menu",
    onClick: () => setNavOpen(true)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "topbar-title"
  }, active ? active.title : 'putty-ai'), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ThemeSwitcher, {
    value: theme,
    onChange: setTheme
  })), active ? /*#__PURE__*/React.createElement(Transcript, {
    messages: messages
  }) : /*#__PURE__*/React.createElement(Welcome, {
    userName: userName,
    onSetup: () => {}
  }), /*#__PURE__*/React.createElement(Composer, {
    value: input,
    mode: mode,
    webOn: webOn,
    shellOn: shellOn,
    model: model,
    onChange: setInput,
    onSend: send,
    onMode: setMode,
    onToggleWeb: () => setWebOn(v => !v),
    onToggleShell: () => setShellOn(v => !v)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/App.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/Composer.tsx
try { (() => {
// Composer.tsx — the putty-ai chat input bar: textarea, model picker, tool toggles, mode toggle, send.

function Composer(props) {
  const {
    value,
    mode,
    webOn,
    shellOn,
    model,
    onChange,
    onSend,
    onMode,
    onToggleWeb,
    onToggleShell
  } = props;
  const taRef = React.useRef(null);
  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [value]);
  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "composer-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "composer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "composer-top"
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    rows: 1,
    value: value,
    placeholder: "Message putty-ai...",
    "aria-label": "Message input",
    onChange: e => onChange(e.target.value),
    onKeyDown: handleKey
  }), /*#__PURE__*/React.createElement("button", {
    className: "mpick",
    title: "Switch model"
  }, model, " ", /*#__PURE__*/React.createElement(Icons.Chevron, {
    size: 10
  }))), /*#__PURE__*/React.createElement("div", {
    className: "composer-bot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cib",
    title: "More tools",
    "aria-label": "More tools"
  }, /*#__PURE__*/React.createElement(Icons.Chevron, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: 'cib' + (webOn ? ' on' : ''),
    title: "Web search",
    "aria-pressed": webOn,
    onClick: onToggleWeb
  }, /*#__PURE__*/React.createElement(Icons.Search, {
    size: 16,
    sw: 2
  })), /*#__PURE__*/React.createElement("button", {
    className: 'cib' + (shellOn ? ' on' : ''),
    title: "Shell access",
    "aria-pressed": shellOn,
    onClick: onToggleShell
  }, /*#__PURE__*/React.createElement(Icons.Shell, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "mode-toggle",
    role: "group",
    "aria-label": "Mode"
  }, /*#__PURE__*/React.createElement("button", {
    className: 'mtb' + (mode === 'agent' ? ' on' : ''),
    "aria-pressed": mode === 'agent',
    onClick: () => onMode('agent')
  }, "Agent"), /*#__PURE__*/React.createElement("button", {
    className: 'mtb' + (mode === 'chat' ? ' on' : ''),
    "aria-pressed": mode === 'chat',
    onClick: () => onMode('chat')
  }, "Chat")), /*#__PURE__*/React.createElement("button", {
    className: "send",
    "aria-label": "Send",
    disabled: !value.trim(),
    onClick: onSend
  }, /*#__PURE__*/React.createElement(Icons.Send, {
    size: 15
  })))));
}
window.Composer = Composer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/Composer.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/Login.tsx
try { (() => {
// Login.tsx — first-run / sign-in screen. Mirrors the self-hosted "generated admin password" flow.

function Login({
  onLogin
}) {
  const [user, setUser] = React.useState('admin');
  const [pw, setPw] = React.useState('');
  const submit = e => {
    e.preventDefault();
    onLogin(user.trim() || 'admin');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "login"
  }, /*#__PURE__*/React.createElement("form", {
    className: "login-card",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-logo"
  }, /*#__PURE__*/React.createElement(Boat, {
    size: 44,
    className: "boat"
  }), /*#__PURE__*/React.createElement("span", {
    className: "wm"
  }, "putty-ai")), /*#__PURE__*/React.createElement("div", {
    className: "slogan"
  }, "Soft. Local. Yours."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "lu"
  }, "Username"), /*#__PURE__*/React.createElement("input", {
    id: "lu",
    value: user,
    onChange: e => setUser(e.target.value),
    autoComplete: "username"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "lp"
  }, "Password"), /*#__PURE__*/React.createElement("input", {
    id: "lp",
    type: "password",
    value: pw,
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    onChange: e => setPw(e.target.value),
    autoComplete: "current-password"
  })), /*#__PURE__*/React.createElement("button", {
    className: "login-btn",
    type: "submit"
  }, "Log in"), /*#__PURE__*/React.createElement("div", {
    className: "login-hint"
  }, "First boot? putty-ai printed a temporary password in your terminal \u2014", /*#__PURE__*/React.createElement("br", null), "look for ", /*#__PURE__*/React.createElement("code", null, "Generated admin password"), ", then change it in Settings.")));
}
window.Login = Login;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/Login.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/Messages.tsx
try { (() => {
// Messages.tsx — welcome screen + chat transcript (user bubbles, streaming assistant).

function Welcome({
  userName,
  onSetup
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement(Boat, {
    size: 56,
    className: "boat"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wm"
  }, "putty-ai"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Welcome,", ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    onClick: onSetup
  }, userName)), /*#__PURE__*/React.createElement("div", {
    className: "tip"
  }, "Type /setup, then choose Local models or API."));
}
function Message({
  msg
}) {
  if (msg.role === 'user') {
    return /*#__PURE__*/React.createElement("div", {
      className: "msg user"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bubble"
    }, msg.text));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "msg ai"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-head"
  }, /*#__PURE__*/React.createElement(Boat, {
    size: 16,
    className: "boat"
  }), " putty-ai"), /*#__PURE__*/React.createElement("div", {
    className: "bubble"
  }, renderText(msg.text), msg.streaming && /*#__PURE__*/React.createElement("span", {
    className: "cursor-blink",
    "aria-hidden": "true"
  })));
}

// Minimal inline-code rendering for `code` spans — enough to feel like the real renderer.
function renderText(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) => p.startsWith('`') && p.endsWith('`') ? React.createElement('code', {
    key: i
  }, p.slice(1, -1)) : React.createElement(React.Fragment, {
    key: i
  }, p));
}
function Transcript({
  messages
}) {
  const endRef = React.useRef(null);
  React.useEffect(() => {
    if (endRef.current && endRef.current.parentElement) {
      const h = endRef.current.parentElement.parentElement;
      if (h) h.scrollTop = h.scrollHeight;
    }
  }, [messages]);
  return /*#__PURE__*/React.createElement("div", {
    className: "history"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hwrap"
  }, messages.map(m => /*#__PURE__*/React.createElement(Message, {
    key: m.id,
    msg: m
  })), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  })));
}
window.Welcome = Welcome;
window.Transcript = Transcript;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/Messages.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/Sidebar.tsx
try { (() => {
// Sidebar.tsx — the putty-ai left rail: brand, new chat, search, sessions, models, tools, user bar.

const TOOLS = [{
  id: 'brain',
  label: 'Brain',
  Icon: Icons.Brain
}, {
  id: 'calendar',
  label: 'Calendar',
  Icon: Icons.Calendar
}, {
  id: 'compare',
  label: 'Compare',
  Icon: Icons.Compare
}, {
  id: 'cookbook',
  label: 'Cookbook',
  Icon: Icons.Cookbook
}, {
  id: 'research',
  label: 'Deep Research',
  Icon: Icons.Research
}, {
  id: 'gallery',
  label: 'Gallery',
  Icon: Icons.Gallery
}, {
  id: 'library',
  label: 'Library',
  Icon: Icons.Library
}, {
  id: 'notes',
  label: 'Notes',
  Icon: Icons.Notes
}, {
  id: 'tasks',
  label: 'Tasks',
  Icon: Icons.Tasks
}, {
  id: 'theme',
  label: 'Theme',
  Icon: Icons.Theme
}];
function Sidebar(props) {
  const {
    sessions,
    activeSession,
    activeTool,
    userName,
    onNewChat,
    onSelectSession,
    onSelectTool,
    onBrandClick,
    onBurger
  } = props;
  return /*#__PURE__*/React.createElement("nav", {
    className: "sb",
    "aria-label": "Sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sb-burger",
    title: "Toggle sidebar",
    "aria-label": "Toggle sidebar",
    onClick: onBurger
  }, /*#__PURE__*/React.createElement(Icons.Menu, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "sb-brand",
    onClick: onBrandClick,
    title: "New chat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wm"
  }, "putty-ai"))), /*#__PURE__*/React.createElement("div", {
    className: "sb-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "li",
    onClick: onNewChat
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icons.Pencil, {
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }, "New Chat")), /*#__PURE__*/React.createElement("div", {
    className: "li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icons.Search, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-sec-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icons.Chat, {
    size: 13
  })), "Chats"), sessions.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      padding: '4px 10px',
      opacity: 0.7
    }
  }, "No conversations yet."), sessions.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: 'li session' + (activeSession === s.id ? ' active' : ''),
    onClick: () => onSelectSession(s.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }, s.title)))), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-sec-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icons.Chat, {
    size: 12
  })), "Models"), /*#__PURE__*/React.createElement("div", {
    className: "model-row"
  }, /*#__PURE__*/React.createElement("select", {
    className: "model-sel",
    "aria-label": "Select model",
    defaultValue: "llama-3.1-8b"
  }, /*#__PURE__*/React.createElement("option", null, "llama-3.1-8b"), /*#__PURE__*/React.createElement("option", null, "qwen2.5-14b"), /*#__PURE__*/React.createElement("option", null, "mistral-small"), /*#__PURE__*/React.createElement("option", null, "gpt-4o (API)")), /*#__PURE__*/React.createElement("button", {
    className: "mini-btn"
  }, "+ Chat"))), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-sec-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icons.Tool, {
    size: 12
  })), "Tools"), TOOLS.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: 'li' + (activeTool === t.id ? ' active' : ''),
    onClick: () => onSelectTool(t.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(t.Icon, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }, t.label))))), /*#__PURE__*/React.createElement("div", {
    className: "sb-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, userName.slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, userName), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "Settings",
    "aria-label": "Settings"
  }, /*#__PURE__*/React.createElement(Icons.Settings, {
    size: 16
  }))));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/Sidebar.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/controls.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// controls.tsx — putty-ai form & control primitives (TypeScript/React).
// Exports to window: PAIcons, Button, Field, Input, Textarea, Select,
// Checkbox, Radio, Switch, Badge, Avatar, AvatarStack.
// Styles live in components.css (class names are pa-*).

/* ---- shared extra icons (stroke, currentColor, 24 grid) ------------------ */

const svg = (size, sw, kids) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}, kids);
const p = (d, k) => React.createElement('path', {
  key: k ?? d.length,
  d
});
const PAIcons = {
  check: ({
    size = 16,
    sw = 3
  }) => svg(size, sw, React.createElement('polyline', {
    points: '20 6 9 17 4 12'
  })),
  x: ({
    size = 16,
    sw = 2.2
  }) => svg(size, sw, [React.createElement('line', {
    key: 1,
    x1: 18,
    y1: 6,
    x2: 6,
    y2: 18
  }), React.createElement('line', {
    key: 2,
    x1: 6,
    y1: 6,
    x2: 18,
    y2: 18
  })]),
  chevronDown: ({
    size = 12,
    sw = 2.4
  }) => svg(size, sw, React.createElement('polyline', {
    points: '6 9 12 15 18 9'
  })),
  search: ({
    size = 15,
    sw = 2
  }) => svg(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 11,
    cy: 11,
    r: 7
  }), p('M21 21l-4.35-4.35', 2)]),
  info: ({
    size = 18,
    sw = 2
  }) => svg(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 12,
    cy: 12,
    r: 9
  }), React.createElement('line', {
    key: 2,
    x1: 12,
    y1: 11,
    x2: 12,
    y2: 16
  }), React.createElement('circle', {
    key: 3,
    cx: 12,
    cy: 7.5,
    r: 0.6,
    fill: 'currentColor'
  })]),
  alertTri: ({
    size = 18,
    sw = 2
  }) => svg(size, sw, [p('M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z', 1), React.createElement('line', {
    key: 2,
    x1: 12,
    y1: 9,
    x2: 12,
    y2: 13
  }), React.createElement('circle', {
    key: 3,
    cx: 12,
    cy: 16.5,
    r: 0.6,
    fill: 'currentColor'
  })]),
  alertCircle: ({
    size = 18,
    sw = 2
  }) => svg(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 12,
    cy: 12,
    r: 9
  }), React.createElement('line', {
    key: 2,
    x1: 12,
    y1: 8,
    x2: 12,
    y2: 13
  }), React.createElement('circle', {
    key: 3,
    cx: 12,
    cy: 16,
    r: 0.6,
    fill: 'currentColor'
  })]),
  checkCircle: ({
    size = 18,
    sw = 2
  }) => svg(size, sw, [p('M21 11.5A9 9 0 1 1 12 3a9 9 0 0 1 6 2.3', 1), React.createElement('polyline', {
    key: 2,
    points: '21 5 12 14 9 11'
  })]),
  trash: ({
    size = 15,
    sw = 2
  }) => svg(size, sw, [React.createElement('polyline', {
    key: 1,
    points: '3 6 5 6 21 6'
  }), p('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 2)]),
  copy: ({
    size = 15,
    sw = 2
  }) => svg(size, sw, [React.createElement('rect', {
    key: 1,
    x: 9,
    y: 9,
    width: 12,
    height: 12,
    rx: 2
  }), p('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', 2)]),
  download: ({
    size = 15,
    sw = 2
  }) => svg(size, sw, [p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 1), React.createElement('polyline', {
    key: 2,
    points: '7 10 12 15 17 10'
  }), React.createElement('line', {
    key: 3,
    x1: 12,
    y1: 15,
    x2: 12,
    y2: 3
  })]),
  plus: ({
    size = 16,
    sw = 2.4
  }) => svg(size, sw, [React.createElement('line', {
    key: 1,
    x1: 12,
    y1: 5,
    x2: 12,
    y2: 19
  }), React.createElement('line', {
    key: 2,
    x1: 5,
    y1: 12,
    x2: 19,
    y2: 12
  })]),
  sparkle: ({
    size = 16,
    sw = 2
  }) => svg(size, sw, p('M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', 1)),
  inbox: ({
    size = 22,
    sw = 1.8
  }) => svg(size, sw, [p('M22 12h-6l-2 3h-4l-2-3H2', 1), p('M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z', 2)]),
  arrowLeft: ({
    size = 14,
    sw = 2.4
  }) => svg(size, sw, [React.createElement('line', {
    key: 1,
    x1: 19,
    y1: 12,
    x2: 5,
    y2: 12
  }), React.createElement('polyline', {
    key: 2,
    points: '12 19 5 12 12 5'
  })]),
  arrowRight: ({
    size = 14,
    sw = 2.4
  }) => svg(size, sw, [React.createElement('line', {
    key: 1,
    x1: 5,
    y1: 12,
    x2: 19,
    y2: 12
  }), React.createElement('polyline', {
    key: 2,
    points: '12 5 19 12 12 19'
  })])
};

/* ---- Button -------------------------------------------------------------- */

function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  block,
  iconOnly,
  children,
  className = '',
  ...rest
}) {
  const cls = ['pa-btn', `pa-btn-${variant}`, size !== 'md' ? `pa-btn-${size}` : '', block ? 'pa-btn-block' : '', iconOnly ? 'pa-btn-icon' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), icon, children);
}

/* ---- Field wrapper -------------------------------------------------------- */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "pa-label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "pa-req"
  }, "*")), children, error ? /*#__PURE__*/React.createElement("span", {
    className: "pa-error-text"
  }, /*#__PURE__*/React.createElement(PAIcons.alertCircle, {
    size: 13,
    sw: 2.2
  }), error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "pa-hint"
  }, hint) : null);
}

/* ---- Input / Textarea / Select ------------------------------------------- */

function Input({
  icon,
  invalid,
  className = '',
  ...rest
}) {
  const input = /*#__PURE__*/React.createElement("input", _extends({
    className: `pa-input ${className}`,
    "aria-invalid": invalid || undefined
  }, rest));
  if (!icon) return input;
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-input-wrap"
  }, icon, input);
}
function Textarea({
  invalid,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: `pa-textarea ${className}`,
    "aria-invalid": invalid || undefined
  }, rest));
}
function Select({
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: `pa-select-native ${className}`
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    className: "pa-chev"
  }, /*#__PURE__*/React.createElement(PAIcons.chevronDown, null)));
}

/* ---- Checkbox / Radio / Switch ------------------------------------------- */
function Checkbox({
  checked,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: 'pa-control' + (disabled ? ' is-disabled' : '')
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "pa-check"
  }, /*#__PURE__*/React.createElement(PAIcons.check, {
    size: 12
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
function Radio({
  checked,
  onChange,
  label,
  name,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: 'pa-control' + (disabled ? ' is-disabled' : '')
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("span", {
    className: "pa-radio"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pa-dot"
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
function Switch({
  checked,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: 'pa-control' + (disabled ? ' is-disabled' : '')
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "pa-switch"
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}

/* ---- Badge --------------------------------------------------------------- */
function Badge({
  variant = 'neutral',
  dot,
  children
}) {
  const map = {
    neutral: '',
    accent: 'pa-badge-accent',
    success: 'pa-badge-success',
    warn: 'pa-badge-warn',
    error: 'pa-badge-error',
    solid: 'pa-badge-solid'
  };
  const dotColor = {
    success: 'var(--green)',
    warn: 'var(--gold)',
    error: 'var(--error)',
    accent: 'var(--accent)',
    neutral: 'var(--muted)',
    solid: '#fff'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `pa-badge ${map[variant]}`
  }, dot && /*#__PURE__*/React.createElement("span", {
    className: "pa-dot8",
    style: {
      background: dotColor[variant]
    }
  }), children);
}

/* ---- Avatar -------------------------------------------------------------- */
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function Avatar({
  name = '?',
  variant = 'coral',
  size = 'md',
  status,
  ring
}) {
  const cls = ['pa-avatar', `pa-avatar-${variant}`, size !== 'md' ? `pa-avatar-${size}` : '', status ? 'pa-avatar-status' : '', ring ? 'pa-avatar-ring' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    title: name
  }, initials(name));
}
function AvatarStack({
  names
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "pa-avatar-stack"
  }, names.map((n, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: i,
    name: n,
    variant: i % 2 ? 'slate' : 'coral',
    size: "sm"
  })));
}
Object.assign(window, {
  PAIcons,
  Button,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Avatar,
  AvatarStack
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/controls.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/data.tsx
try { (() => {
// data.tsx — putty-ai data-display primitives (TypeScript/React).
// Exports to window: Tabs, Segment, Table, Pagination, EmptyState,
// Skeleton, Progress, Legend, BarChart, LineChart, Donut.

/* ---- Tabs ---------------------------------------------------------------- */
function Tabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-tabs",
    role: "tablist"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    role: "tab",
    "aria-selected": value === t.id,
    className: 'pa-tab' + (value === t.id ? ' is-active' : ''),
    onClick: () => onChange(t.id)
  }, t.label)));
}

/* ---- Segmented control --------------------------------------------------- */
function Segment({
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-segment",
    role: "group"
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    "aria-pressed": value === o.id,
    className: value === o.id ? 'is-active' : '',
    onClick: () => onChange(o.id)
  }, o.label)));
}

/* ---- Table --------------------------------------------------------------- */

function Table({
  columns,
  rows
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "pa-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: c.num ? {
      textAlign: 'right'
    } : undefined
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    className: c.num ? 'pa-num' : '',
    style: c.num ? {
      textAlign: 'right'
    } : undefined
  }, c.render ? c.render(r) : r[c.key])))))));
}

/* ---- Pagination ---------------------------------------------------------- */
function Pagination({
  page,
  pages,
  onChange
}) {
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pa-page",
    disabled: page === 1,
    "aria-label": "Previous",
    onClick: () => onChange(page - 1)
  }, /*#__PURE__*/React.createElement(PAIcons.arrowLeft, null)), nums.map((n, i) => typeof n === 'number' ? /*#__PURE__*/React.createElement("button", {
    key: i,
    className: 'pa-page' + (n === page ? ' is-active' : ''),
    onClick: () => onChange(n)
  }, n) : /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "pa-page",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'default'
    }
  }, "\u2026")), /*#__PURE__*/React.createElement("button", {
    className: "pa-page",
    disabled: page === pages,
    "aria-label": "Next",
    onClick: () => onChange(page + 1)
  }, /*#__PURE__*/React.createElement(PAIcons.arrowRight, null)));
}

/* ---- Empty state --------------------------------------------------------- */
function EmptyState({
  icon,
  title,
  message,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pa-empty-ic"
  }, icon ?? /*#__PURE__*/React.createElement(PAIcons.inbox, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "pa-empty-title"
  }, title), message && /*#__PURE__*/React.createElement("div", {
    className: "pa-empty-msg"
  }, message), action);
}

/* ---- Skeleton ------------------------------------------------------------ */
function Skeleton({
  w = '100%',
  h = 12,
  r = 6,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-skel",
    style: {
      width: w,
      height: h,
      borderRadius: r,
      ...style
    }
  });
}

/* ---- Progress ------------------------------------------------------------ */
function Progress({
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: `${Math.max(0, Math.min(100, value))}%`
    }
  }));
}

/* ---- Legend -------------------------------------------------------------- */
function Legend({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-legend"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "pa-legend-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pa-legend-swatch",
    style: {
      background: it.color
    }
  }), it.label)));
}

/* ---- BarChart (grouped, SVG) --------------------------------------------- */
function BarChart({
  data,
  height = 150,
  max
}) {
  const W = 460,
    H = height,
    padB = 24,
    padL = 8,
    padT = 10;
  const top = max ?? Math.max(...data.flatMap(d => d.values));
  const groups = data.length;
  const gw = (W - padL * 2) / groups;
  const series = data[0]?.values.length ?? 1;
  const bw = Math.min(18, (gw - 10) / series);
  const colors = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-2)'];
  const gridY = [0, 0.5, 1];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, gridY.map((g, i) => {
    const y = padT + (1 - g) * (H - padT - padB);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: padL,
      x2: W - padL,
      y1: y,
      y2: y,
      stroke: "var(--chart-grid)",
      strokeWidth: 1
    });
  }), data.map((d, gi) => {
    const gx = padL + gi * gw + (gw - bw * series) / 2;
    return /*#__PURE__*/React.createElement("g", {
      key: gi
    }, d.values.map((v, si) => {
      const h = v / top * (H - padT - padB);
      return /*#__PURE__*/React.createElement("rect", {
        key: si,
        x: gx + si * bw,
        y: H - padB - h,
        width: bw - 3,
        height: h,
        rx: 2,
        fill: colors[si % colors.length]
      });
    }), /*#__PURE__*/React.createElement("text", {
      x: padL + gi * gw + gw / 2,
      y: H - 8,
      textAnchor: "middle",
      fontSize: "10",
      fontFamily: "var(--font-mono)",
      fill: "var(--chart-axis)"
    }, d.label));
  }));
}

/* ---- LineChart (SVG) ----------------------------------------------------- */
function LineChart({
  series,
  labels,
  height = 150
}) {
  const W = 460,
    H = height,
    padB = 22,
    padX = 10,
    padT = 10;
  const all = series.flatMap(s => s.points);
  const top = Math.max(...all),
    bot = Math.min(0, ...all);
  const n = series[0]?.points.length ?? 1;
  const x = i => padX + i / (n - 1) * (W - padX * 2);
  const y = v => padT + (1 - (v - bot) / (top - bot)) * (H - padT - padB);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, [0, 0.5, 1].map((g, i) => {
    const yy = padT + g * (H - padT - padB);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: padX,
      x2: W - padX,
      y1: yy,
      y2: yy,
      stroke: "var(--chart-grid)",
      strokeWidth: 1
    });
  }), series.map((s, si) => {
    const d = s.points.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: s.color,
      strokeWidth: 2,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), s.points.map((v, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x(i),
      cy: y(v),
      r: 2.4,
      fill: s.color
    })));
  }), labels && labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 7,
    textAnchor: "middle",
    fontSize: "9.5",
    fontFamily: "var(--font-mono)",
    fill: "var(--chart-axis)"
  }, l)));
}

/* ---- Donut --------------------------------------------------------------- */
function Donut({
  segments,
  size = 120
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = size / 2 - 10,
    c = size / 2,
    circ = 2 * Math.PI * r;
  let offset = 0;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: c,
    cy: c,
    r: r,
    fill: "none",
    stroke: "var(--surface-3)",
    strokeWidth: 12
  }), segments.map((s, i) => {
    const len = s.value / total * circ;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: c,
      cy: c,
      r: r,
      fill: "none",
      stroke: s.color,
      strokeWidth: 12,
      strokeDasharray: `${len} ${circ - len}`,
      strokeDashoffset: -offset,
      transform: `rotate(-90 ${c} ${c})`,
      strokeLinecap: "butt"
    });
    offset += len;
    return el;
  }));
}
Object.assign(window, {
  Tabs,
  Segment,
  Table,
  Pagination,
  EmptyState,
  Skeleton,
  Progress,
  Legend,
  BarChart,
  LineChart,
  Donut
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/data.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/icons.tsx
try { (() => {
// icons.tsx — putty-ai iconography. Feather/Lucide line-stroke set + the putty mascot.
// All icons inherit currentColor, stroke-width 2, round caps — matching the app.

const S = (size, sw, children, cls) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: cls
}, children);

// Each icon is a small function component so usage reads <Icons.Search size={14} />
const Icons = {
  Menu: ({
    size = 18,
    sw = 2.5,
    className
  }) => S(size, sw, [React.createElement('line', {
    key: 1,
    x1: 3,
    y1: 6,
    x2: 21,
    y2: 6
  }), React.createElement('line', {
    key: 2,
    x1: 3,
    y1: 12,
    x2: 21,
    y2: 12
  }), React.createElement('line', {
    key: 3,
    x1: 3,
    y1: 18,
    x2: 21,
    y2: 18
  })], className),
  Pencil: ({
    size = 15,
    sw = 2.2,
    className
  }) => S(size, sw, [React.createElement('path', {
    key: 1,
    d: 'M12 20h9'
  }), React.createElement('path', {
    key: 2,
    d: 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'
  })], className),
  Search: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 11,
    cy: 11,
    r: 7
  }), React.createElement('path', {
    key: 2,
    d: 'M21 21l-4.35-4.35'
  })], className),
  Chat: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, React.createElement('path', {
    d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
  }), className),
  Brain: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('path', {
    key: 1,
    d: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z'
  }), React.createElement('path', {
    key: 2,
    d: 'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z'
  })], className),
  Calendar: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('rect', {
    key: 1,
    x: 3,
    y: 4,
    width: 18,
    height: 18,
    rx: 2
  }), React.createElement('line', {
    key: 2,
    x1: 16,
    y1: 2,
    x2: 16,
    y2: 6
  }), React.createElement('line', {
    key: 3,
    x1: 8,
    y1: 2,
    x2: 8,
    y2: 6
  }), React.createElement('line', {
    key: 4,
    x1: 3,
    y1: 10,
    x2: 21,
    y2: 10
  })], className),
  Compare: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 18,
    cy: 18,
    r: 3
  }), React.createElement('circle', {
    key: 2,
    cx: 6,
    cy: 6,
    r: 3
  }), React.createElement('path', {
    key: 3,
    d: 'M13 6h3a2 2 0 0 1 2 2v7'
  }), React.createElement('path', {
    key: 4,
    d: 'M11 18H8a2 2 0 0 1-2-2V9'
  })], className),
  Cookbook: ({
    size = 14,
    sw = 1.7,
    className
  }) => S(size, sw, [React.createElement('path', {
    key: 1,
    d: 'M12 7v14'
  }), React.createElement('path', {
    key: 2,
    d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'
  })], className),
  Research: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 11,
    cy: 11,
    r: 8
  }), React.createElement('path', {
    key: 2,
    d: 'M21 21l-4.35-4.35'
  }), React.createElement('line', {
    key: 3,
    x1: 11,
    y1: 8,
    x2: 11,
    y2: 14
  }), React.createElement('line', {
    key: 4,
    x1: 8,
    y1: 11,
    x2: 14,
    y2: 11
  })], className),
  Gallery: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('rect', {
    key: 1,
    x: 3,
    y: 3,
    width: 18,
    height: 18,
    rx: 2
  }), React.createElement('circle', {
    key: 2,
    cx: 8.5,
    cy: 8.5,
    r: 1.5
  }), React.createElement('path', {
    key: 3,
    d: 'M21 15l-5-5L5 21'
  })], className),
  Library: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('path', {
    key: 1,
    d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20'
  }), React.createElement('path', {
    key: 2,
    d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'
  })], className),
  Notes: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('path', {
    key: 1,
    d: 'M5 3h10l4 4v14H5z'
  }), React.createElement('path', {
    key: 2,
    d: 'M15 3v5h5'
  }), React.createElement('path', {
    key: 3,
    d: 'M8 17.5 15.5 10l2.5 2.5L10.5 20H8z'
  })], className),
  Tasks: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('rect', {
    key: 1,
    x: 3,
    y: 4,
    width: 18,
    height: 18,
    rx: 2
  }), React.createElement('line', {
    key: 2,
    x1: 3,
    y1: 10,
    x2: 21,
    y2: 10
  }), React.createElement('path', {
    key: 3,
    d: 'M9 16l2 2 4-4'
  })], className),
  Theme: ({
    size = 14,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 12,
    cy: 12,
    r: 10
  }), React.createElement('path', {
    key: 2,
    d: 'M12 2a7 7 0 0 0 0 20 4 4 0 0 1 0-8 4 4 0 0 0 0-8'
  }), React.createElement('circle', {
    key: 3,
    cx: 8,
    cy: 9,
    r: 1.4,
    fill: 'currentColor'
  }), React.createElement('circle', {
    key: 4,
    cx: 15,
    cy: 14,
    r: 1.4,
    fill: 'currentColor'
  })], className),
  Tool: ({
    size = 12,
    sw = 2,
    className
  }) => S(size, sw, React.createElement('path', {
    d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'
  }), className),
  Chevron: ({
    size = 10,
    sw = 2.6,
    className
  }) => S(size, sw, React.createElement('polyline', {
    points: '6 9 12 15 18 9'
  }), className),
  Shell: ({
    size = 16,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('polyline', {
    key: 1,
    points: '4 17 10 11 4 5'
  }), React.createElement('line', {
    key: 2,
    x1: 12,
    y1: 19,
    x2: 20,
    y2: 19
  })], className),
  Plus: ({
    size = 16,
    sw = 2.4,
    className
  }) => S(size, sw, [React.createElement('line', {
    key: 1,
    x1: 12,
    y1: 5,
    x2: 12,
    y2: 19
  }), React.createElement('line', {
    key: 2,
    x1: 5,
    y1: 12,
    x2: 19,
    y2: 12
  })], className),
  Send: ({
    size = 15,
    sw = 2.4,
    className
  }) => S(size, sw, [React.createElement('line', {
    key: 1,
    x1: 12,
    y1: 19,
    x2: 12,
    y2: 5
  }), React.createElement('polyline', {
    key: 2,
    points: '5 12 12 5 19 12'
  })], className),
  Settings: ({
    size = 16,
    sw = 2,
    className
  }) => S(size, sw, [React.createElement('circle', {
    key: 1,
    cx: 12,
    cy: 12,
    r: 3
  }), React.createElement('path', {
    key: 2,
    d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6 9.4a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6V4.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 11h.1a2 2 0 1 1 0 4h-.1z'
  })], className)
};

// The brand mark — the putty blob mascot. Body inherits currentColor (tint via CSS);
// face stays ink. Exported as window.Boat (legacy name) and window.Putty.
const Boat = ({
  size = 24,
  className
}) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: '0 0 100 100',
  className,
  'aria-hidden': true
}, React.createElement('path', {
  d: 'M50 5 C61 4 64 -1 73 5 C82 10 78 19 86 24 C95 30 91 40 93 48 C95 57 99 63 92 71 C86 78 77 73 70 81 C63 89 59 96 49 93 C40 90 36 96 28 89 C21 83 26 75 18 70 C9 65 7 56 9 48 C11 40 3 35 10 27 C16 20 25 25 31 17 C37 10 39 6 50 5 Z',
  fill: 'currentColor'
}), React.createElement('ellipse', {
  cx: 39,
  cy: 47,
  rx: 6,
  ry: 7.5,
  fill: '#161719'
}), React.createElement('ellipse', {
  cx: 62,
  cy: 47,
  rx: 6,
  ry: 7.5,
  fill: '#161719'
}), React.createElement('circle', {
  cx: 41,
  cy: 44,
  r: 2,
  fill: '#fff'
}), React.createElement('circle', {
  cx: 64,
  cy: 44,
  r: 2,
  fill: '#fff'
}), React.createElement('path', {
  d: 'M41 63 q4.5 5.5 9 0',
  fill: 'none',
  stroke: '#161719',
  strokeWidth: 3.2,
  strokeLinecap: 'round'
}));
window.Icons = Icons;
window.Boat = Boat;
window.Putty = Boat;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/icons.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/overlays.tsx
try { (() => {
// overlays.tsx — putty-ai overlay & feedback primitives (TypeScript/React).
// Exports to window: Menu, Modal, Toast, Tooltip, Alert.

/* ---- Menu / dropdown ----------------------------------------------------- */

function Menu({
  label,
  items,
  sections
}) {
  const blocks = sections ?? [{
    label,
    items: items ?? []
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-menu",
    role: "menu"
  }, blocks.map((sec, si) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: si
  }, si > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pa-menu-sep"
  }), sec.label && /*#__PURE__*/React.createElement("div", {
    className: "pa-menu-label"
  }, sec.label), sec.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'pa-menu-item' + (it.danger ? ' is-danger' : ''),
    role: "menuitem",
    onClick: it.onClick
  }, it.icon, /*#__PURE__*/React.createElement("span", null, it.label), it.kbd && /*#__PURE__*/React.createElement("span", {
    className: "pa-kbd"
  }, it.kbd))))));
}

/* ---- Tooltip ------------------------------------------------------------- */
function Tooltip({
  text,
  children,
  open
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "pa-tooltip"
  }, children, /*#__PURE__*/React.createElement("span", {
    className: 'pa-tooltip-bubble' + (open ? ' is-shown' : ''),
    role: "tooltip"
  }, text));
}

/* ---- Alert / banner ------------------------------------------------------ */
function Alert({
  variant = 'info',
  title,
  children,
  onClose
}) {
  const Ic = {
    info: PAIcons.info,
    success: PAIcons.checkCircle,
    warn: PAIcons.alertTri,
    error: PAIcons.alertCircle
  };
  const IcEl = Ic[variant];
  return /*#__PURE__*/React.createElement("div", {
    className: `pa-alert pa-alert-${variant}`,
    role: variant === 'error' ? 'alert' : 'status'
  }, /*#__PURE__*/React.createElement("span", {
    className: "pa-alert-ic"
  }, /*#__PURE__*/React.createElement(IcEl, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "pa-alert-body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "pa-alert-title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "pa-alert-msg"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "pa-x",
    "aria-label": "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(PAIcons.x, {
    size: 15
  })));
}

/* ---- Toast --------------------------------------------------------------- */
function Toast({
  variant = 'info',
  children,
  onClose
}) {
  const Ic = {
    info: PAIcons.info,
    success: PAIcons.checkCircle,
    error: PAIcons.alertCircle
  };
  const IcEl = Ic[variant];
  return /*#__PURE__*/React.createElement("div", {
    className: `pa-toast pa-toast-${variant}`,
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pa-toast-ic"
  }, /*#__PURE__*/React.createElement(IcEl, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "pa-toast-body"
  }, children), onClose && /*#__PURE__*/React.createElement("button", {
    className: "pa-toast-close",
    "aria-label": "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(PAIcons.x, {
    size: 14
  })));
}

/* ---- Modal / dialog ------------------------------------------------------
   Renders an absolutely-positioned scrim inside the nearest positioned
   ancestor (so it works inside an artboard, not just full-window). */
function Modal({
  title,
  children,
  onClose,
  footer,
  open = true
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pa-modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pa-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pa-modal-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pa-modal-title"
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    className: "pa-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(PAIcons.x, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pa-modal-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "pa-modal-foot"
  }, footer)));
}
Object.assign(window, {
  Menu,
  Tooltip,
  Alert,
  Toast,
  Modal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/overlays.tsx", error: String((e && e.message) || e) }); }

// ui_kits/putty-app/showcase.tsx
try { (() => {
// showcase.tsx — interactive component gallery for putty-ai.

const {
  useState
} = React;
function Section({
  title,
  sub,
  children,
  span
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sc-sec",
    style: span ? {
      gridColumn: '1 / -1'
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-sec-head"
  }, /*#__PURE__*/React.createElement("h2", null, title), sub && /*#__PURE__*/React.createElement("span", null, sub)), /*#__PURE__*/React.createElement("div", {
    className: "sc-sec-body"
  }, children));
}
const Row = ({
  children,
  gap = 12,
  wrap = true,
  align = 'center'
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap,
    alignItems: align
  }
}, children);
const Col = ({
  children,
  gap = 12
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap
  }
}, children);
function App() {
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [tab, setTab] = useState('overview');
  const [seg, setSeg] = useState('agent');
  const [page, setPage] = useState(3);
  const [chk, setChk] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [radio, setRadio] = useState('local');
  const [sw, setSw] = useState(true);
  const [loading, setLoading] = useState(false);
  const pushToast = (variant, msg) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, {
      id,
      variant,
      msg
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };
  const modelRows = [{
    model: 'llama-3.1-8b',
    size: '4.7 GB',
    ctx: '128k',
    tps: 62
  }, {
    model: 'qwen2.5-14b',
    size: '8.2 GB',
    ctx: '32k',
    tps: 41
  }, {
    model: 'mistral-small',
    size: '13 GB',
    ctx: '32k',
    tps: 28
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "sc-wrap"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sc-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-brand"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 100 100",
    style: {
      filter: 'drop-shadow(0 4px 14px rgba(224,108,117,.4))'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M50 5 C61 4 64 -1 73 5 C82 10 78 19 86 24 C95 30 91 40 93 48 C95 57 99 63 92 71 C86 78 77 73 70 81 C63 89 59 96 49 93 C40 90 36 96 28 89 C21 83 26 75 18 70 C9 65 7 56 9 48 C11 40 3 35 10 27 C16 20 25 25 31 17 C37 10 39 6 50 5 Z",
    fill: "#e06c75"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "39",
    cy: "47",
    rx: "6",
    ry: "7.5",
    fill: "#161719"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "62",
    cy: "47",
    rx: "6",
    ry: "7.5",
    fill: "#161719"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M41 63 q4.5 5.5 9 0",
    fill: "none",
    stroke: "#161719",
    strokeWidth: "3.2",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sc-title"
  }, "putty-ai \xB7 component library"), /*#__PURE__*/React.createElement("div", {
    className: "sc-subtitle"
  }, "Coral on grey \xB7 WCAG-aware \xB7 TypeScript"))), /*#__PURE__*/React.createElement(Badge, {
    variant: "accent",
    dot: true
  }, "17 themes")), /*#__PURE__*/React.createElement("div", {
    className: "sc-grid"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Buttons",
    sub: "primary uses AA-safe coral; icon-only uses bright coral"
  }, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement(PAIcons.sparkle, {
      size: 15
    })
  }, "Serve model"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Skip"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    icon: /*#__PURE__*/React.createElement(PAIcons.trash, null)
  }, "Delete")), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Small"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(PAIcons.download, null)
  }, "Export"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Large action"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    disabled: true
  }, "Disabled"), /*#__PURE__*/React.createElement("span", {
    className: "pa-icon-accent",
    title: "Send"
  }, /*#__PURE__*/React.createElement(PAIcons.plus, {
    size: 16
  }))))), /*#__PURE__*/React.createElement(Section, {
    title: "Form fields",
    sub: "default \xB7 focus \xB7 error \xB7 disabled"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 14
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Endpoint name",
    htmlFor: "f1",
    hint: "Shown in the model picker."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f1",
    defaultValue: "llama-3.1-8b-local",
    icon: /*#__PURE__*/React.createElement(PAIcons.search, null)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "API key",
    htmlFor: "f2",
    error: "This field is required."
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f2",
    invalid: true,
    placeholder: "sk-\u2026"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "System prompt",
    htmlFor: "f3"
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "f3",
    defaultValue: "You are putty \u2014 helpful, local, and concise."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Quantization",
    htmlFor: "f4"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "f4",
    defaultValue: "q4"
  }, /*#__PURE__*/React.createElement("option", {
    value: "q4"
  }, "Q4_K_M"), /*#__PURE__*/React.createElement("option", {
    value: "q5"
  }, "Q5_K_M"), /*#__PURE__*/React.createElement("option", {
    value: "q8"
  }, "Q8_0"))))), /*#__PURE__*/React.createElement(Section, {
    title: "Selection",
    sub: "checkbox \xB7 radio \xB7 switch"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 13
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: chk,
    onChange: setChk,
    label: "Stream tokens"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: chk2,
    onChange: setChk2,
    label: "Save to memory"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: false,
    onChange: () => {},
    label: "Disabled option",
    disabled: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "rt",
    checked: radio === 'local',
    onChange: () => setRadio('local'),
    label: "Local models"
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "rt",
    checked: radio === 'api',
    onChange: () => setRadio('api'),
    label: "API provider"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: sw,
    onChange: setSw,
    label: "Agent mode"
  }))), /*#__PURE__*/React.createElement(Section, {
    title: "Badges & avatars"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 14
  }, /*#__PURE__*/React.createElement(Row, {
    gap: 8
  }, /*#__PURE__*/React.createElement(Badge, null, "neutral"), /*#__PURE__*/React.createElement(Badge, {
    variant: "accent",
    dot: true
  }, "active"), /*#__PURE__*/React.createElement(Badge, {
    variant: "success",
    dot: true
  }, "online"), /*#__PURE__*/React.createElement(Badge, {
    variant: "warn",
    dot: true
  }, "queued"), /*#__PURE__*/React.createElement(Badge, {
    variant: "error",
    dot: true
  }, "failed"), /*#__PURE__*/React.createElement(Badge, {
    variant: "solid"
  }, "PRO")), /*#__PURE__*/React.createElement(Row, {
    gap: 14
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ada Lovelace",
    status: true
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Grace Hopper",
    variant: "slate"
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Putty",
    size: "lg",
    ring: true
  }), /*#__PURE__*/React.createElement(AvatarStack, {
    names: ['Ann Kim', 'Bo Li', 'Cy Park', 'Dee Ray']
  })))), /*#__PURE__*/React.createElement(Section, {
    title: "Dropdown menu"
  }, /*#__PURE__*/React.createElement(Menu, {
    sections: [{
      label: 'llama-3.1-8b',
      items: [{
        label: 'Rename',
        icon: /*#__PURE__*/React.createElement(PAIcons.copy, null),
        kbd: '⌘R'
      }, {
        label: 'Duplicate',
        icon: /*#__PURE__*/React.createElement(PAIcons.plus, null)
      }, {
        label: 'Download',
        icon: /*#__PURE__*/React.createElement(PAIcons.download, null),
        kbd: '⌘S'
      }]
    }, {
      items: [{
        label: 'Delete model',
        icon: /*#__PURE__*/React.createElement(PAIcons.trash, null),
        danger: true
      }]
    }]
  })), /*#__PURE__*/React.createElement(Section, {
    title: "Tabs & segmented"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 16
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      id: 'overview',
      label: 'Overview'
    }, {
      id: 'params',
      label: 'Parameters'
    }, {
      id: 'logs',
      label: 'Logs'
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 2px',
      fontSize: 13.5,
      color: 'var(--muted)'
    }
  }, "Showing ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--fg)'
    }
  }, tab), ".")), /*#__PURE__*/React.createElement(Segment, {
    options: [{
      id: 'agent',
      label: 'Agent'
    }, {
      id: 'chat',
      label: 'Chat'
    }],
    value: seg,
    onChange: setSeg
  }))), /*#__PURE__*/React.createElement(Section, {
    title: "Table",
    sub: "hover rows \xB7 tabular numerals",
    span: true
  }, /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'model',
      label: 'Model',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "pa-dot8",
        style: {
          background: 'var(--green)',
          width: 7,
          height: 7,
          borderRadius: 9,
          display: 'inline-block'
        }
      }), r.model)
    }, {
      key: 'size',
      label: 'Size',
      num: true
    }, {
      key: 'ctx',
      label: 'Context',
      num: true
    }, {
      key: 'tps',
      label: 'tok/s',
      num: true,
      render: r => /*#__PURE__*/React.createElement("b", {
        style: {
          color: 'var(--fg)'
        }
      }, r.tps)
    }, {
      key: 'a',
      label: '',
      render: () => /*#__PURE__*/React.createElement("span", {
        className: "pa-badge pa-badge-success"
      }, "running")
    }],
    rows: modelRows
  })), /*#__PURE__*/React.createElement(Section, {
    title: "Alerts"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 10
  }, /*#__PURE__*/React.createElement(Alert, {
    variant: "info",
    title: "Heads up"
  }, "Running on your hardware. Nothing leaves this machine."), /*#__PURE__*/React.createElement(Alert, {
    variant: "success",
    title: "Model served"
  }, "Listening on :8080."), /*#__PURE__*/React.createElement(Alert, {
    variant: "warn",
    title: "Low VRAM"
  }, "This model may not fit alongside others."), /*#__PURE__*/React.createElement(Alert, {
    variant: "error",
    title: "Download failed",
    onClose: () => {}
  }, "Checksum mismatch \u2014 retry the pull."))), /*#__PURE__*/React.createElement(Section, {
    title: "Overlays",
    sub: "modal \xB7 toast \xB7 tooltip"
  }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setModal(true)
  }, "Open dialog"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: () => setConfirm(true)
  }, "Confirm delete"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => pushToast('success', /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Model served."), " :8080"))
  }, "Success toast"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => pushToast('error', /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Failed."), " Out of memory"))
  }, "Error toast"), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Always-on for the demo",
    open: true
  }, /*#__PURE__*/React.createElement("span", {
    className: "pa-badge"
  }, "hover me")))), /*#__PURE__*/React.createElement(Section, {
    title: "Pagination & progress"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 16
  }, /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pages: 9,
    onChange: setPage
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      marginBottom: 6
    }
  }, "Downloading\u2026 64%"), /*#__PURE__*/React.createElement(Progress, {
    value: 64
  })))), /*#__PURE__*/React.createElement(Section, {
    title: "Empty & loading"
  }, /*#__PURE__*/React.createElement(Col, {
    gap: 16
  }, loading ? /*#__PURE__*/React.createElement(Col, {
    gap: 10
  }, /*#__PURE__*/React.createElement(Skeleton, {
    w: "60%",
    h: 14
  }), /*#__PURE__*/React.createElement(Skeleton, {
    w: "90%"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    w: "80%"
  }), /*#__PURE__*/React.createElement(Row, {
    gap: 10
  }, /*#__PURE__*/React.createElement(Skeleton, {
    w: 44,
    h: 44,
    r: 10
  }), /*#__PURE__*/React.createElement(Col, {
    gap: 8
  }, /*#__PURE__*/React.createElement(Skeleton, {
    w: 120,
    h: 11
  }), /*#__PURE__*/React.createElement(Skeleton, {
    w: 80,
    h: 11
  })))) : /*#__PURE__*/React.createElement(EmptyState, {
    title: "No conversations yet",
    message: "Start a chat to see it here.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      icon: /*#__PURE__*/React.createElement(PAIcons.plus, null)
    }, "New chat")
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setLoading(v => !v)
  }, "Toggle loading"))), /*#__PURE__*/React.createElement(Section, {
    title: "Charts",
    sub: "categorical palette on ink",
    span: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-charts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pa-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-chart-title"
  }, "Throughput by model (tok/s)"), /*#__PURE__*/React.createElement(BarChart, {
    data: [{
      label: '8b',
      values: [62, 40]
    }, {
      label: '14b',
      values: [41, 25]
    }, {
      label: '32b',
      values: [22, 12]
    }, {
      label: '70b',
      values: [9, 5]
    }],
    max: 70
  }), /*#__PURE__*/React.createElement(Legend, {
    items: [{
      label: 'GPU',
      color: 'var(--chart-1)'
    }, {
      label: 'CPU',
      color: 'var(--chart-3)'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "pa-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-chart-title"
  }, "Requests / hour"), /*#__PURE__*/React.createElement(LineChart, {
    labels: ['9a', '11a', '1p', '3p', '5p', '7p'],
    series: [{
      color: 'var(--chart-1)',
      points: [12, 30, 22, 48, 38, 60]
    }, {
      color: 'var(--chart-2)',
      points: [6, 14, 18, 24, 30, 34]
    }]
  }), /*#__PURE__*/React.createElement(Legend, {
    items: [{
      label: 'Chat',
      color: 'var(--chart-1)'
    }, {
      label: 'Agents',
      color: 'var(--chart-2)'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "pa-card",
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    segments: [{
      value: 52,
      color: 'var(--chart-1)'
    }, {
      value: 26,
      color: 'var(--chart-3)'
    }, {
      value: 14,
      color: 'var(--chart-2)'
    }, {
      value: 8,
      color: 'var(--chart-4)'
    }]
  }), /*#__PURE__*/React.createElement(Col, {
    gap: 7
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-chart-title",
    style: {
      marginBottom: 2
    }
  }, "VRAM usage"), /*#__PURE__*/React.createElement(Legend, {
    items: [{
      label: 'llama 52%',
      color: 'var(--chart-1)'
    }, {
      label: 'qwen 26%',
      color: 'var(--chart-3)'
    }, {
      label: 'embed 14%',
      color: 'var(--chart-2)'
    }, {
      label: 'free 8%',
      color: 'var(--chart-4)'
    }]
  })))))), /*#__PURE__*/React.createElement(Modal, {
    open: modal,
    title: "Serve a model",
    onClose: () => setModal(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setModal(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        setModal(false);
        pushToast('success', /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Model served."), " :8080"));
      }
    }, "Serve"))
  }, "putty will scan your VRAM, pick a fit, and start a local server. You can stop it anytime from the Cookbook."), /*#__PURE__*/React.createElement(Modal, {
    open: confirm,
    title: "Delete llama-3.1-8b?",
    onClose: () => setConfirm(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setConfirm(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      icon: /*#__PURE__*/React.createElement(PAIcons.trash, null),
      onClick: () => {
        setConfirm(false);
        pushToast('error', /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Deleted."), " 4.7 GB freed"));
      }
    }, "Delete"))
  }, "This removes the weights from disk. This can't be undone."), /*#__PURE__*/React.createElement("div", {
    className: "sc-toasts"
  }, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
    key: t.id,
    variant: t.variant,
    onClose: () => setToasts(x => x.filter(y => y.id !== t.id))
  }, t.msg))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/putty-app/showcase.tsx", error: String((e && e.message) || e) }); }

__ds_ns.THEMES = __ds_scope.THEMES;

__ds_ns.THEME_KEYS = __ds_scope.THEME_KEYS;

__ds_ns.DEFAULT_THEME = __ds_scope.DEFAULT_THEME;

})();
