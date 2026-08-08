"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LocalGraph, LocalGraphNode } from "@/lib/local-graph";

const WIDTH = 900;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

type PositionedNode = LocalGraphNode & { x: number; y: number; width: number; height: number };
type DragState = { pointerId: number; x: number; y: number; panX: number; panY: number };

function shorten(label: string, limit = 10) {
  return label.length > limit ? `${label.slice(0, limit - 1)}…` : label;
}

function positionNodes(graph: LocalGraph): PositionedNode[] {
  const center = graph.nodes.find((node) => node.isCenter);
  const neighbors = graph.nodes.filter((node) => !node.isCenter);
  const positioned: PositionedNode[] = center
    ? [{ ...center, x: CENTER_X, y: CENTER_Y, width: 174, height: 82 }]
    : [];

  neighbors.forEach((node, index) => {
    const onInnerRing = index < 8;
    const ringIndex = onInnerRing ? index : index - 8;
    const ringCount = onInnerRing ? Math.min(neighbors.length, 8) : neighbors.length - 8;
    const angle = -Math.PI / 2 + (Math.PI * 2 * ringIndex) / Math.max(ringCount, 1);
    positioned.push({
      ...node,
      x: CENTER_X + Math.cos(angle) * (onInnerRing ? 205 : 350),
      y: CENTER_Y + Math.sin(angle) * (onInnerRing ? 146 : 235),
      width: 136,
      height: 62,
    });
  });

  return positioned;
}

function pointAtNodeBoundary(node: PositionedNode, toward: PositionedNode) {
  const dx = toward.x - node.x;
  const dy = toward.y - node.y;
  const ratio = 1 / Math.max(Math.abs(dx) / (node.width / 2), Math.abs(dy) / (node.height / 2), 1);
  return { x: node.x + dx * ratio, y: node.y + dy * ratio };
}

export function LocalKnowledgeGraph({ graph }: { graph: LocalGraph }) {
  const nodes = useMemo(() => positionNodes(graph), [graph]);
  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const [activeId, setActiveId] = useState(graph.centerId);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<DragState | null>(null);
  const activeNode = byId.get(activeId) ?? byId.get(graph.centerId);

  function changeScale(next: number) {
    setScale(Math.min(1.8, Math.max(0.75, Number(next.toFixed(2)))));
  }

  function resetView() {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const step = 24;
    if (event.key === "+" || event.key === "=") changeScale(scale + 0.15);
    else if (event.key === "-") changeScale(scale - 0.15);
    else if (event.key === "0") resetView();
    else if (event.key === "ArrowLeft") setPan((value) => ({ ...value, x: value.x - step }));
    else if (event.key === "ArrowRight") setPan((value) => ({ ...value, x: value.x + step }));
    else if (event.key === "ArrowUp") setPan((value) => ({ ...value, y: value.y - step }));
    else if (event.key === "ArrowDown") setPan((value) => ({ ...value, y: value.y + step }));
    else return;
    event.preventDefault();
  }

  function startDrag(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  }

  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPan({
      x: drag.panX + ((event.clientX - drag.x) * WIDTH) / rect.width,
      y: drag.panY + ((event.clientY - drag.y) * HEIGHT) / rect.height,
    });
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    if (drag?.pointerId === event.pointerId) setDrag(null);
  }

  return (
    <div className="local-knowledge-graph" data-local-graph="depth-1">
      <div className="graph-toolbar" aria-label="知識連結圖檢視控制">
        <p>{graph.nodes.length - 1} 個相鄰條目 · {graph.edges.length} 組直接關係</p>
        <div>
          <button type="button" onClick={() => changeScale(scale - 0.15)} aria-label="縮小知識連結圖" title="縮小">−</button>
          <button type="button" onClick={resetView} aria-label="重置知識連結圖視角">重置</button>
          <button type="button" onClick={() => changeScale(scale + 0.15)} aria-label="放大知識連結圖" title="放大">＋</button>
        </div>
      </div>
      <div className="graph-viewport">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${graph.nodes[0]?.label ?? "條目"}的一層知識連結圖`}
          aria-describedby="local-graph-svg-description"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={drag ? "is-dragging" : undefined}
        >
          <desc id="local-graph-svg-description">中心為目前條目，箭頭顯示關係方向。可用方向鍵平移，加減鍵縮放，零鍵重置。</desc>
          <defs>
            <marker id="graph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g transform={`translate(${CENTER_X + pan.x} ${CENTER_Y + pan.y}) scale(${scale}) translate(${-CENTER_X} ${-CENTER_Y})`}>
            <g className="graph-edges" aria-label="關係">
              {graph.edges.map((edge) => {
                const from = byId.get(edge.from);
                const to = byId.get(edge.to);
                if (!from || !to) return null;
                const start = pointAtNodeBoundary(from, to);
                const end = pointAtNodeBoundary(to, from);
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                return (
                  <g key={edge.id}>
                    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} markerEnd="url(#graph-arrow)" />
                    <text x={midX} y={midY - 6} textAnchor="middle">{edge.label}</text>
                  </g>
                );
              })}
            </g>
            <g className="graph-nodes" aria-label="條目">
              {nodes.map((node) => {
                const content = (
                  <g
                    className={`graph-node graph-node-${node.type}${node.isCenter ? " is-center" : ""}`}
                    transform={`translate(${node.x - node.width / 2} ${node.y - node.height / 2})`}
                    onMouseEnter={() => setActiveId(node.id)}
                    onFocus={() => setActiveId(node.id)}
                  >
                    <rect width={node.width} height={node.height} rx="8" />
                    {node.isCenter && <text className="graph-node-current" x={node.width / 2} y="17" textAnchor="middle">目前條目</text>}
                    <text className="graph-node-label" x={node.width / 2} y={node.isCenter ? 45 : 27} textAnchor="middle">{shorten(node.label)}</text>
                    <text className="graph-node-type" x={node.width / 2} y={node.isCenter ? 67 : 49} textAnchor="middle">{node.typeLabel}</text>
                  </g>
                );
                return node.href ? (
                  <a
                    key={node.id}
                    href={node.href}
                    aria-label={`${node.typeLabel}：${node.label}。${node.description}`}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    {content}
                  </a>
                ) : <g key={node.id}>{content}</g>;
              })}
            </g>
          </g>
        </svg>
      </div>
      {activeNode && (
        <div className="graph-node-detail" aria-live="polite">
          <span>{activeNode.typeLabel}{activeNode.isCenter ? " · 目前條目" : ""}</span>
          <strong>{activeNode.label}</strong>
          <p>{activeNode.description}</p>
          {activeNode.href && <a href={activeNode.href}>開啟條目</a>}
        </div>
      )}
      <p className="graph-keyboard-hint">鍵盤：在圖上使用方向鍵平移、＋／− 縮放、0 重置；Tab 可逐一聚焦條目。</p>
    </div>
  );
}
