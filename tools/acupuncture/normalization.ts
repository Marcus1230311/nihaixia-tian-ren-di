export const meridianAliases: Record<string, string> = {
  "meridian:lung": "meridian:lung", "手太陰肺經": "meridian:lung", "手太阴肺经": "meridian:lung", "肺經": "meridian:lung", "肺经": "meridian:lung",
  "meridian:large-intestine": "meridian:large-intestine", "手陽明大腸經": "meridian:large-intestine", "手阳明大肠经": "meridian:large-intestine", "大腸經": "meridian:large-intestine", "大肠经": "meridian:large-intestine",
  "meridian:stomach": "meridian:stomach", "足陽明胃經": "meridian:stomach", "足阳明胃经": "meridian:stomach", "胃經": "meridian:stomach", "胃经": "meridian:stomach",
  "meridian:spleen": "meridian:spleen", "足太陰脾經": "meridian:spleen", "足太阴脾经": "meridian:spleen", "脾經": "meridian:spleen", "脾经": "meridian:spleen",
  "meridian:heart": "meridian:heart", "手少陰心經": "meridian:heart", "手少阴心经": "meridian:heart", "心經": "meridian:heart", "心经": "meridian:heart",
  "meridian:small-intestine": "meridian:small-intestine", "手太陽小腸經": "meridian:small-intestine", "手太阳小肠经": "meridian:small-intestine", "小腸經": "meridian:small-intestine", "小肠经": "meridian:small-intestine",
  "meridian:bladder": "meridian:bladder", "足太陽膀胱經": "meridian:bladder", "足太阳膀胱经": "meridian:bladder", "膀胱經": "meridian:bladder", "膀胱经": "meridian:bladder",
  "meridian:kidney": "meridian:kidney", "足少陰腎經": "meridian:kidney", "足少阴肾经": "meridian:kidney", "腎經": "meridian:kidney", "肾经": "meridian:kidney",
  "meridian:pericardium": "meridian:pericardium", "手厥陰心包經": "meridian:pericardium", "手厥阴心包经": "meridian:pericardium", "心包經": "meridian:pericardium", "心包经": "meridian:pericardium",
  "meridian:sanjiao": "meridian:sanjiao", "手少陽三焦經": "meridian:sanjiao", "手少阳三焦经": "meridian:sanjiao", "三焦經": "meridian:sanjiao", "三焦经": "meridian:sanjiao",
  "meridian:gallbladder": "meridian:gallbladder", "足少陽膽經": "meridian:gallbladder", "足少阳胆经": "meridian:gallbladder", "膽經": "meridian:gallbladder", "胆经": "meridian:gallbladder",
  "meridian:liver": "meridian:liver", "足厥陰肝經": "meridian:liver", "足厥阴肝经": "meridian:liver", "肝經": "meridian:liver", "肝经": "meridian:liver",
};

export const categoryAliases: Record<string, string> = {
  "point-category:well": "point-category:well", "井": "point-category:well", "井穴": "point-category:well",
  "point-category:spring": "point-category:spring", "滎": "point-category:spring", "荥": "point-category:spring", "滎穴": "point-category:spring", "荥穴": "point-category:spring",
  "point-category:stream": "point-category:stream", "輸": "point-category:stream", "输": "point-category:stream", "輸穴": "point-category:stream", "输穴": "point-category:stream", "腧穴": "point-category:stream",
  "point-category:river": "point-category:river", "經": "point-category:river", "经": "point-category:river", "經穴": "point-category:river", "经穴": "point-category:river",
  "point-category:sea": "point-category:sea", "合": "point-category:sea", "合穴": "point-category:sea",
  "point-category:source": "point-category:source", "原": "point-category:source", "原穴": "point-category:source",
  "point-category:connecting": "point-category:connecting", "絡": "point-category:connecting", "络": "point-category:connecting", "絡穴": "point-category:connecting", "络穴": "point-category:connecting",
  "point-category:cleft": "point-category:cleft", "郄": "point-category:cleft", "郄穴": "point-category:cleft",
  "point-category:front-mu": "point-category:front-mu", "募": "point-category:front-mu", "募穴": "point-category:front-mu", "前募穴": "point-category:front-mu",
  "point-category:back-shu": "point-category:back-shu", "背俞": "point-category:back-shu", "背俞穴": "point-category:back-shu", "俞穴": "point-category:back-shu",
  "point-category:eight-confluent": "point-category:eight-confluent", "八脈交會穴": "point-category:eight-confluent", "八脉交会穴": "point-category:eight-confluent",
  "point-category:crossing": "point-category:crossing", "交會穴": "point-category:crossing", "交会穴": "point-category:crossing", "三經交會穴": "point-category:crossing", "三经交会穴": "point-category:crossing",
};

export const elementAliases: Record<string, string> = {
  "element:wood": "element:wood", "木": "element:wood",
  "element:fire": "element:fire", "火": "element:fire",
  "element:earth": "element:earth", "土": "element:earth",
  "element:metal": "element:metal", "金": "element:metal",
  "element:water": "element:water", "水": "element:water",
};

export const meridianCodePrefixes: Record<string, string> = {
  "meridian:lung": "LU", "meridian:large-intestine": "LI", "meridian:stomach": "ST", "meridian:spleen": "SP",
  "meridian:heart": "HT", "meridian:small-intestine": "SI", "meridian:bladder": "BL", "meridian:kidney": "KI",
  "meridian:pericardium": "PC", "meridian:sanjiao": "TE", "meridian:gallbladder": "GB", "meridian:liver": "LR",
};

export const fiveShuCategoryIds = new Set([
  "point-category:well", "point-category:spring", "point-category:stream", "point-category:river", "point-category:sea",
]);

export function normalizeWhitespace(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function normalizeCode(value: string) {
  return normalizeWhitespace(value).replace(/[\s_-]+/g, "").toUpperCase();
}

export function stablePointId(code: string) {
  const match = /^([A-Z]{2})(\d{1,3})$/.exec(code);
  return match ? `acupoint:${match[1].toLowerCase()}-${match[2].padStart(2, "0")}` : null;
}
