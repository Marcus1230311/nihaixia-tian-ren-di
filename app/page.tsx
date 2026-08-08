import { ImmersiveMeridian } from "@/components/immersive-meridian";
import { SearchPanel } from "@/components/search-panel";
import { entities } from "@/data/knowledge";
import { createLungMeridianExperience } from "@/data/interactive-experience";
import { localize } from "@/lib/presentation";

export default function HomePage() {
  const lungPoints = entities
    .filter((entity) => entity.type === "acupoint" && /^LU(?:[1-9]|1[01])$/.test(String(entity.metadata.standardCode)))
    .sort((left, right) => Number(String(left.metadata.standardCode).slice(2)) - Number(String(right.metadata.standardCode).slice(2)))
    .map((entity) => ({ id: entity.id, label: localize(entity.labels), code: String(entity.metadata.standardCode), href: `/entities/${entity.slug}/`, description: localize(entity.descriptions) }));
  const lungExperience = createLungMeridianExperience(lungPoints);
  return (
    <div className="immersive-home">
      <ImmersiveMeridian system={lungExperience} />
      <section id="knowledge-index" className="home-index"><p>KNOWLEDGE INDEX</p><h2>從一個名字，進入整個知識世界</h2><SearchPanel /><nav aria-label="知識入口"><a href="/lessons/renji/acupuncture/01-meridians/">經絡</a><a href="/lessons/renji/shanghan/01-overview/">經典</a><a href="/lessons/renji/bencao/01-overview/">本草</a></nav></section>
    </div>
  );
}
