"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InteractionMode, InteractiveSystemSpec } from "@/data/interactive-experience";
import styles from "./immersive-meridian.module.css";

export function ImmersiveMeridian({ system }: { system: InteractiveSystemSpec }) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const enteredRef = useRef<string | null>(null);
  const [mode, setMode] = useState<InteractionMode>("visible");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [enteredId, setEnteredId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const activeId = enteredId ?? focusedId;
  const activePoint = system.points.find((point) => point.id === activeId);
  const nextId = activeId ? system.nextById[activeId] : system.points[0]?.id;
  const explored = useMemo(() => new Set(exploredIds), [exploredIds]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMode("return");
      enteredRef.current = null;
      setEnteredId(null);
      setFocusedId(null);
      window.setTimeout(() => setMode("visible"), 320);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const sensePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || !rootRef.current || frameRef.current !== null) return;
    const { clientX, clientY } = event;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = rootRef.current!.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      rootRef.current!.style.setProperty("--attention-x", `${x * 100}%`);
      rootRef.current!.style.setProperty("--attention-y", `${y * 100}%`);
      const distance = Math.hypot(x - 0.66, y - 0.46);
      rootRef.current!.style.setProperty("--attention", String(Math.max(0, 1 - distance * 2.25)));
      if (!enteredRef.current && !focusedId) setMode(distance < 0.32 ? "proximity" : "visible");
    });
  };

  const awaken = () => {
    if (!enteredRef.current) setMode("awaken");
  };

  const focusPoint = (id: string) => {
    if (enteredRef.current) return;
    setFocusedId(id);
    setMode("focus");
  };

  const leavePoint = () => {
    if (enteredRef.current) return;
    setFocusedId(null);
    setMode("awaken");
  };

  const enterPoint = (pointId: string, pointerType?: string) => {
    if (pointerType === "touch" && focusedId !== pointId) {
      focusPoint(pointId);
      return;
    }
    enteredRef.current = pointId;
    setFocusedId(pointId);
    setEnteredId(pointId);
    setExploredIds((items) => items.includes(pointId) ? items : [...items, pointId]);
    setMode("enter");
  };

  const returnToMeridian = () => {
    setMode("return");
    enteredRef.current = null;
    setEnteredId(null);
    window.setTimeout(() => setMode("awaken"), 320);
  };

  return <section
    ref={rootRef}
    className={`${styles.experience} ${styles[mode]}`}
    data-interaction-mode={mode}
    onPointerMove={sensePointer}
    onPointerLeave={() => { if (!enteredRef.current) { setMode("visible"); setFocusedId(null); } }}
    aria-labelledby="experience-title"
  >
    <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <header className={styles.titleBlock}>
      <p>TRADITIONAL CHINESE MEDICINE</p>
      <h1 id="experience-title">中醫</h1>
      <span>經絡是一種秩序。知識，從感知開始。</span>
    </header>

    <div className={styles.carrier}>
      <div className={styles.halo} aria-hidden="true" />
      <svg className={styles.body} viewBox="0 0 460 720" role="img" aria-label="抽象、中性的瓷白人體知識載體；未繪製醫學點位">
        <defs>
          <linearGradient id="porcelain" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f3ecdc" stopOpacity=".92"/><stop offset=".52" stopColor="#cfc8b9" stopOpacity=".48"/><stop offset="1" stopColor="#6f716f" stopOpacity=".15"/></linearGradient>
          <linearGradient id="porcelain-edge" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#fff" stopOpacity=".08"/><stop offset=".5" stopColor="#e7dcc4" stopOpacity=".66"/><stop offset="1" stopColor="#fff" stopOpacity=".06"/></linearGradient>
        </defs>
        <ellipse cx="230" cy="80" rx="55" ry="69" fill="url(#porcelain)" />
        <path d="M182 142 C156 166 142 206 138 269 L125 413 C122 472 109 548 93 690 L154 690 C169 579 185 504 194 423 L204 312 L230 326 L256 312 L266 423 C275 504 291 579 306 690 L367 690 C351 548 338 472 335 413 L322 269 C318 206 304 166 278 142 C263 157 248 164 230 164 C212 164 197 157 182 142 Z" fill="url(#porcelain)" />
        <path d="M157 196 C111 252 78 337 54 447 C49 470 55 489 71 497 C86 504 101 494 108 473 L177 276 Z" fill="url(#porcelain-edge)" />
        <path d="M303 196 C349 252 382 337 406 447 C411 470 405 489 389 497 C374 504 359 494 352 473 L283 276 Z" fill="url(#porcelain-edge)" />
        <path d="M230 164 L230 650 M145 270 Q230 304 315 270 M169 431 Q230 453 291 431" fill="none" stroke="#f4e7cf" strokeOpacity=".13" strokeWidth="1" />
      </svg>
      <button className={styles.sensingField} type="button" onPointerEnter={awaken} onFocus={awaken} onClick={awaken} aria-label={`喚醒${system.label}探索介面`} />
      <div className={styles.meridianIdentity} aria-live="polite">
        <small>{system.englishLabel}</small>
        <strong>{system.label}</strong>
        <span aria-hidden="true" />
      </div>
    </div>

    <div className={styles.sequence} aria-label={`${system.label}穴位次序`}>
      <div className={styles.sequenceLine} aria-hidden="true" />
      {system.points.map((point, index) => {
        const isActive = point.id === activeId;
        const isNext = point.id === nextId;
        return <button
          key={point.id}
          type="button"
          className={`${styles.point} ${isActive ? styles.isActive : ""} ${isNext ? styles.isNext : ""} ${explored.has(point.id) ? styles.isExplored : ""}`}
          style={{ "--sequence": index } as React.CSSProperties}
          onPointerEnter={() => focusPoint(point.id)}
          onPointerLeave={leavePoint}
          onFocus={() => focusPoint(point.id)}
          onBlur={leavePoint}
          onPointerUp={(event) => enterPoint(point.id, event.pointerType)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            enterPoint(point.id);
          }}
          aria-pressed={enteredId === point.id}
          aria-label={`${point.label} ${point.code}`}
        ><i aria-hidden="true" /><span><strong>{point.label}</strong><small>{point.code}</small></span></button>;
      })}
    </div>

    <div className={`${styles.context} ${activePoint ? styles.hasContext : ""}`} aria-live="polite">
      {activePoint ? <>
        <p>{activePoint.code} · {system.label}</p>
        <h2>{activePoint.label}</h2>
        {enteredId && <><span>{activePoint.description}</span><div><button type="button" onClick={returnToMeridian}>返回經絡</button><Link href={activePoint.href}>查看知識條目</Link></div></>}
      </> : <><p>MERIDIAN ATLAS · 01</p><h2>{system.label}</h2><span>在瓷白載體旁，十一個經穴身份依標準次序保持待命。</span></>}
    </div>

    <aside className={styles.accuracyBoundary}>
      <span>醫學圖層</span><p>{system.medicalGeometry.note}</p>
    </aside>
    <a className={styles.indexLink} href="#knowledge-index">進入知識索引</a>
  </section>;
}
