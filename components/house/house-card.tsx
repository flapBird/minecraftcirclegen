import Image from "next/image";
import Link from "next/link";
import type { HouseBlueprint } from "@/content/houses/types";

export function DifficultyBadge({ difficulty }: Pick<HouseBlueprint, "difficulty">) {
  return <span className={`difficulty-badge difficulty-${difficulty.toLowerCase().replaceAll("–", "-").replaceAll(" ", "-")}`}>{difficulty}</span>;
}

export function HouseMetadata({ blueprint }: { blueprint: HouseBlueprint }) {
  return (
    <dl className="house-card-metadata">
      <div><dt>Dimensions</dt><dd>{blueprint.width}×{blueprint.length}×{blueprint.height}</dd></div>
      <div><dt>Build time</dt><dd>{blueprint.estimatedBuildTime}</dd></div>
      <div><dt>Approx. blocks</dt><dd>{blueprint.blockCount.toLocaleString("en-US")}</dd></div>
    </dl>
  );
}

export function HouseCard({ blueprint, priority = false }: { blueprint: HouseBlueprint; priority?: boolean }) {
  return (
    <article className="house-card">
      <figure className="house-card-image">
        <Image
          src={blueprint.image}
          alt={blueprint.imageAlt}
          width={1200}
          height={899}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px"
          priority={priority}
        />
        <figcaption>Original voxel illustration</figcaption>
      </figure>
      <div className="house-card-body">
        <div className="house-card-heading">
          <div>
            <p>{blueprint.category}<span aria-hidden="true"> · </span>{blueprint.style}</p>
            <h3><Link href={`/house-blueprints/${blueprint.slug}`}>{blueprint.name}</Link></h3>
          </div>
          <DifficultyBadge difficulty={blueprint.difficulty} />
        </div>
        <p className="house-card-description">{blueprint.description}</p>
        <HouseMetadata blueprint={blueprint} />
        <p className="house-card-materials"><strong>Main materials:</strong> {blueprint.materials.slice(0, 3).map((material) => material.name).join(" / ")}</p>
        <Link href={`/house-blueprints/${blueprint.slug}`} className="house-card-cta">
          View blueprint <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function HouseGrid({ blueprints }: { blueprints: HouseBlueprint[] }) {
  return (
    <div className="house-grid">
      {blueprints.map((blueprint, index) => <HouseCard key={blueprint.slug} blueprint={blueprint} priority={index < 2} />)}
    </div>
  );
}
