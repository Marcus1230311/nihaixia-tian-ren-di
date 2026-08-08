import type { KnowledgeNode, KnowledgeRelation, Locale } from "@/lib/knowledge-schema";
import { entityTypeLabels, localize, relationTypeLabels } from "@/lib/presentation";

export type LocalGraphNode = {
  id: string;
  type: KnowledgeNode["type"];
  label: string;
  typeLabel: string;
  description: string;
  href: string | null;
  isCenter: boolean;
};

export type LocalGraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  labels: string[];
  relationIds: string[];
};

export type LocalGraph = {
  centerId: string;
  nodes: LocalGraphNode[];
  edges: LocalGraphEdge[];
  directNeighborCount: number;
  omittedNodeCount: number;
  depth: 1;
};

const typePriority: Record<KnowledgeNode["type"], number> = {
  course: 0,
  classic: 1,
  lesson: 2,
  concept: 3,
  trigram: 4,
  hexagram: 5,
  heavenly_stem: 6,
  earthly_branch: 7,
  element: 8,
  yin_yang: 9,
  ten_god: 10,
  direction: 11,
  meridian_level: 12,
  meridian: 13,
  organ: 14,
  herb_nature: 15,
  herb_flavor: 16,
  herb_grade: 17,
  point_category: 18,
  shanghan_channel: 19,
  condition: 20,
  syndrome: 21,
  acupoint: 22,
  formula: 23,
  herb: 24,
};

function publicHref(node: KnowledgeNode): string | null {
  if (node.type === "lesson") return `/lessons/${node.route.join("/")}/`;
  if (node.slug) return `/entities/${node.slug}/`;
  return null;
}

export function buildLocalGraph({
  centerId,
  nodes,
  relations,
  locale = "zh-Hant",
  maxNeighbors = 18,
}: {
  centerId: string;
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
  locale?: Locale;
  maxNeighbors?: number;
}): LocalGraph {
  if (!Number.isInteger(maxNeighbors) || maxNeighbors < 1) throw new Error("maxNeighbors must be a positive integer");

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const center = nodeMap.get(centerId);
  if (!center) throw new Error(`Local graph center does not exist: ${centerId}`);

  const directRelations = relations.filter((relation) => relation.from === centerId || relation.to === centerId);
  const neighborIds = new Set<string>();
  for (const relation of directRelations) {
    if (relation.from === relation.to) continue;
    const neighborId = relation.from === centerId ? relation.to : relation.from;
    if (!nodeMap.has(neighborId)) throw new Error(`Local graph relation endpoint does not exist: ${relation.id} -> ${neighborId}`);
    neighborIds.add(neighborId);
  }

  const sortedNeighbors = [...neighborIds]
    .map((id) => nodeMap.get(id)!)
    .sort((left, right) => typePriority[left.type] - typePriority[right.type] || left.id.localeCompare(right.id));
  const visibleNeighbors = sortedNeighbors.slice(0, maxNeighbors);
  const visibleIds = new Set([centerId, ...visibleNeighbors.map((node) => node.id)]);

  const graphNodes = [center, ...visibleNeighbors].map((node) => ({
    id: node.id,
    type: node.type,
    label: localize(node.labels, locale),
    typeLabel: localize(entityTypeLabels[node.type], locale),
    description: localize(node.descriptions, locale),
    href: publicHref(node),
    isCenter: node.id === centerId,
  }));

  const edgeGroups = new Map<string, KnowledgeRelation[]>();
  for (const relation of directRelations) {
    if (relation.from === relation.to || !visibleIds.has(relation.from) || !visibleIds.has(relation.to)) continue;
    const key = `${relation.from}|${relation.to}`;
    edgeGroups.set(key, [...(edgeGroups.get(key) ?? []), relation]);
  }

  const graphEdges = [...edgeGroups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, group], index) => {
      const [from, to] = key.split("|");
      const labels = [...new Set(group.map((relation) => localize(relationTypeLabels[relation.type], locale)))];
      return {
        id: `local-edge-${index + 1}`,
        from,
        to,
        label: labels.join("／"),
        labels,
        relationIds: group.map((relation) => relation.id).sort(),
      };
    });

  return {
    centerId,
    nodes: graphNodes,
    edges: graphEdges,
    directNeighborCount: sortedNeighbors.length,
    omittedNodeCount: Math.max(0, sortedNeighbors.length - visibleNeighbors.length),
    depth: 1,
  };
}
