import fs from "node:fs";
import path from "node:path";
import { entities, knowledgeGraph, relations } from "../data/knowledge";
import { createLungMeridianExperience, interactionGrammar } from "../data/interactive-experience";
import { localize } from "../lib/presentation";

if (knowledgeGraph.schemaVersion !== "1.5.0" || knowledgeGraph.entities.length !== 641 || relations.length !== 1933) throw new Error("V4 互動原型不得改變 Knowledge Model 1.5.0 與 641／1,933 基線");
if (interactionGrammar.join("→") !== "visible→proximity→awaken→focus→enter→return") throw new Error("互動語法必須保留六個可重用狀態");

const lung = entities.find((entity) => entity.id === "meridian:lung");
if (!lung || !String(localize(lung.metadata.visualReadiness as { "zh-Hant": string })).includes("未加入解剖座標")) throw new Error("肺經必須明示醫學視覺資料尚未就緒");

const points = entities
  .filter((entity) => entity.type === "acupoint" && /^LU(?:[1-9]|1[01])$/.test(String(entity.metadata.standardCode)))
  .sort((left, right) => Number(String(left.metadata.standardCode).slice(2)) - Number(String(right.metadata.standardCode).slice(2)))
  .map((entity) => ({ id: entity.id, label: localize(entity.labels), code: String(entity.metadata.standardCode), href: `/entities/${entity.slug}/`, description: localize(entity.descriptions) }));

const expectedNames = ["中府", "雲門", "天府", "俠白", "尺澤", "孔最", "列缺", "經渠", "太淵", "魚際", "少商"];
if (points.length !== 11) throw new Error(`肺經原型必須恰有 LU1–LU11，實際 ${points.length}`);
for (const [index, point] of points.entries()) {
  if (point.code !== `LU${index + 1}` || point.label !== expectedNames[index]) throw new Error(`肺經第 ${index + 1} 穴代碼或繁體名稱錯誤`);
}

const experience = createLungMeridianExperience(points);
if (experience.id !== "experience:meridian:lung" || experience.anchorId !== "meridian:lung") throw new Error("互動原型只能錨定手太陰肺經");
if (experience.medicalGeometry.status !== "blocked" || experience.medicalGeometry.sourceId !== "source:reference:who-acupuncture-nomenclature") throw new Error("未驗證的醫學幾何必須保持 blocked 並指向既有 WHO 來源");
const serialized = JSON.stringify(experience);
if (/"(?:x|y|path|coordinates|bodyCoordinates|meridianPath)"\s*:/.test(serialized)) throw new Error("不得把猜測座標或路徑加入互動資料");
for (const [index, point] of experience.points.entries()) if (experience.nextById[point.id] !== experience.points[index + 1]?.id) throw new Error(`${point.code} 的局部 next mapping 不正確`);

const componentSource = fs.readFileSync(path.resolve(process.cwd(), "components/immersive-meridian.tsx"), "utf8");
const componentCss = fs.readFileSync(path.resolve(process.cwd(), "components/immersive-meridian.module.css"), "utf8");
if (!componentSource.includes("requestAnimationFrame") || !componentSource.includes('event.key !== "Escape"') || !componentSource.includes('event.pointerType === "touch"')) throw new Error("互動元件缺少連續指標感知、Escape 或 touch 狀態處理");
if (!componentSource.includes('event.key !== "Enter"') || !componentSource.includes('event.key !== " "')) throw new Error("穴位互動缺少鍵盤 Enter／Space 等價操作");
if (!componentCss.includes("prefers-reduced-motion: reduce") || !componentCss.includes("@media (max-width: 760px)")) throw new Error("互動樣式缺少 reduced-motion 或 mobile fallback");

console.log(JSON.stringify({ system: experience.label, states: interactionGrammar.length, points: experience.points.length, geometry: experience.medicalGeometry.status, entities: knowledgeGraph.entities.length, relations: relations.length }, null, 2));
