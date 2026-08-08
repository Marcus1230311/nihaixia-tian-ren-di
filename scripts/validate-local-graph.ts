import assert from "node:assert/strict";
import { entities, lessons, relations } from "../data/knowledge";
import { buildLocalGraph } from "../lib/local-graph";

const nodes = [...entities, ...lessons];

assert.throws(
  () => buildLocalGraph({ centerId: "missing:center", nodes, relations }),
  /center does not exist/,
  "unknown centers must fail clearly",
);

const qian = buildLocalGraph({ centerId: "hexagram:01", nodes, relations });
assert.equal(qian.depth, 1);
assert.equal(qian.directNeighborCount, 2);
assert.equal(qian.nodes.length, 3);
assert.equal(qian.edges.length, 2);
const qianTrigramEdge = qian.edges.find((edge) => edge.to === "trigram:qian");
assert.deepEqual(qianTrigramEdge?.labels.sort(), ["上卦", "下卦"].sort(), "parallel relation types must remain visible");
assert.equal(qianTrigramEdge?.relationIds.length, 2);

for (const centerId of ["hexagram:02", "hexagram:11", "hexagram:12"]) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, centerId === "hexagram:02" ? 2 : 3);
  assert.ok(graph.nodes.every((node) => node.label && node.typeLabel && node.description));
  assert.ok(graph.nodes.every((node) => node.href?.startsWith("/")));
}

for (const centerId of ["trigram:qian", "trigram:kan", "trigram:li"]) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, 19, `${centerId} should retain Yijing neighbors and add only its supported Heluo correspondences`);
  assert.equal(graph.omittedNodeCount, 1);
  assert.ok(graph.edges.every((edge) => edge.label.length > 0));
}

for (const [centerId, expectedNeighbors] of [
  ["heavenly-stem:jia", 3],
  ["element:wood", 28],
  ["earthly-branch:zi", 3],
  ["concept:hetu", 12],
  ["concept:luoshu", 11],
] as const) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, expectedNeighbors, `${centerId} local graph neighbor count changed unexpectedly`);
  assert.equal(graph.omittedNodeCount, centerId === "element:wood" ? 10 : 0);
  assert.ok(graph.nodes.every((node) => node.label && node.typeLabel && node.description && node.href?.startsWith("/")));
}

for (const [centerId, expectedNeighbors, expectedOmitted] of [
  ["formula:guizhi-tang", 13, 0],
  ["syndrome:taiyang-zhongfeng", 3, 0],
  ["herb:guizhi", 9, 0],
  ["shanghan-channel:taiyang", 4, 0],
  ["classic:shanghan-lun", 23, 5],
] as const) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, expectedNeighbors, `${centerId} Shanghan graph degree changed unexpectedly`);
  assert.equal(graph.omittedNodeCount, expectedOmitted);
  assert.ok(graph.nodes.every((node) => node.label && node.typeLabel && node.description && node.href?.startsWith("/")));
}
const guizhiFormula = buildLocalGraph({ centerId: "formula:guizhi-tang", nodes, relations });
assert.ok(guizhiFormula.nodes.some((node) => node.id === "syndrome:taiyang-zhongfeng"), "formula graph must expose its classical pattern association");
assert.ok(guizhiFormula.nodes.some((node) => node.id === "syndrome:jingui-pregnancy-guizhi"), "reused formula graph must expose its separate Jingui pattern association");
assert.ok(guizhiFormula.nodes.some((node) => node.id === "classic:jingui-yaolue"), "reused formula graph must expose both classic contexts");
assert.equal(guizhiFormula.nodes.filter((node) => node.type === "herb").length, 5, "Gui Zhi Tang graph must expose all five ingredient identities");

for (const [centerId, expectedNeighbors, expectedOmitted] of [
  ["formula:huangqi-guizhi-wuwu-tang", 9, 0],
  ["herb:huangqi", 2, 0],
  ["syndrome:jingui-blood-bi-qi-blood-deficiency", 4, 0],
  ["classic:jingui-yaolue", 28, 10],
] as const) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, expectedNeighbors, `${centerId} Jingui graph degree changed unexpectedly`);
  assert.equal(graph.omittedNodeCount, expectedOmitted);
  assert.ok(graph.nodes.every((node) => node.label && node.typeLabel && node.description && node.href?.startsWith("/")));
}

for (const [centerId, expectedNeighbors] of [
  ["acupoint:lr-03", 5],
  ["acupoint:li-04", 3],
  ["acupoint:st-36", 4],
  ["meridian:liver", 18],
  ["organ:liver", 3],
] as const) {
  const graph = buildLocalGraph({ centerId, nodes, relations });
  assert.equal(graph.directNeighborCount, expectedNeighbors, `${centerId} acupuncture pilot graph changed unexpectedly`);
  assert.equal(graph.omittedNodeCount, 0);
  assert.ok(graph.nodes.every((node) => node.label && node.typeLabel && node.description && node.href?.startsWith("/")));
}

const classic = buildLocalGraph({ centerId: "classic:yijing", nodes, relations });
assert.equal(classic.directNeighborCount, 78);
assert.equal(classic.nodes.length, 19);
assert.equal(classic.omittedNodeCount, 60);
assert.deepEqual(
  classic.nodes.slice(1, 7).map((node) => node.type),
  ["course", "lesson", "lesson", "lesson", "lesson", "lesson"],
  "visible hub selection must be deterministic and type-prioritized",
);

const repeated = buildLocalGraph({ centerId: "classic:yijing", nodes, relations });
assert.deepEqual(classic, repeated, "the same data must always produce the same local graph");

const rawEnums = /part_of|belongs_to|appears_in|upper_trigram|lower_trigram|related_to|classified_as|contains_herb|classically_associated_with/;
assert.ok(classic.edges.every((edge) => !rawEnums.test(edge.label)), "public edge labels must be human-readable");

console.log(JSON.stringify({
  graphNodesAvailable: nodes.length,
  relationsAvailable: relations.length,
  representativeCenters: 26,
  qianVisibleNodes: qian.nodes.length,
  trigramDirectNeighbors: 19,
  classicDirectNeighbors: classic.directNeighborCount,
  classicVisibleNeighbors: classic.nodes.length - 1,
  classicOmittedNeighbors: classic.omittedNodeCount,
  deterministic: true,
}, null, 2));
