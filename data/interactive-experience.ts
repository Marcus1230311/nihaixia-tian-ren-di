export const interactionGrammar = ["visible", "proximity", "awaken", "focus", "enter", "return"] as const;

export type InteractionMode = (typeof interactionGrammar)[number];

export type ExperiencePoint = {
  id: string;
  label: string;
  code: string;
  href: string;
  description: string;
};

export type InteractiveSystemSpec = {
  id: string;
  label: string;
  englishLabel: string;
  anchorId: string;
  points: ExperiencePoint[];
  nextById: Record<string, string | undefined>;
  medicalGeometry: {
    status: "blocked" | "verified";
    sourceId: string;
    note: string;
  };
};

export function createLungMeridianExperience(points: ExperiencePoint[]): InteractiveSystemSpec {
  return {
    id: "experience:meridian:lung",
    label: "手太陰肺經",
    englishLabel: "LUNG MERIDIAN · LU1—LU11",
    anchorId: "meridian:lung",
    points,
    nextById: Object.fromEntries(points.map((point, index) => [point.id, points[index + 1]?.id])),
    medicalGeometry: {
      status: "blocked",
      sourceId: "source:reference:who-acupuncture-nomenclature",
      note: "穴名、代碼與次序已核對；解剖座標與循行路徑尚無可重現的視覺映射，因此不在人體上猜測標點。",
    },
  };
}
