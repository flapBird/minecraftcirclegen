import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { BookshelfSimulator } from "@/components/enchanting-guide/bookshelf-simulator";
import { MAX_ENCHANT_POWER, bottomSlotRange } from "@/lib/minecraft/enchant-power";

const title = "Minecraft Enchanting Table – Level 30 Guide and Bookshelf Layout Simulator";
const description =
  "Craft an enchanting table, place 15 bookshelves for level 30 enchantments with the interactive layout simulator, and decode the table's Standard Galactic Alphabet symbols.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/enchanting-table" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/enchanting-table", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

const faqs = [
  {
    question: "How do you make an enchanting table in Minecraft?",
    answer:
      "Craft it from 4 obsidian, 2 diamonds, and 1 book: the book goes in the top-center slot, the two diamonds sit left and right of the center obsidian, and the bottom row is three obsidian. Mine obsidian with a diamond pickaxe after water meets a lava source, and make the book from 3 paper and 1 leather.",
  },
  {
    question: "How many bookshelves do you need for level 30 enchantments?",
    answer:
      "Exactly 15 bookshelves need to count toward the table. The cap is 15, and the bottom enchantment slot always costs exactly 30 levels once all 15 count. With 14 shelves the bottom slot tops out at level 29, so one missing or blocked shelf is enough to lose level 30.",
  },
  {
    question: "Why aren't my bookshelves giving me level 30 enchantments?",
    answer:
      "Check four things: each shelf sits exactly two blocks away from the table, it is at the table's height or one block above, the gap block between the shelf and the table is clear air at the shelf&apos;s height, and at least 15 shelves pass all three checks. A single torch or carpet in a gap silently removes the three shelves behind it.",
  },
  {
    question: "How far do bookshelves need to be from the enchanting table?",
    answer:
      "Exactly two blocks. Valid positions form a ring around the table: two blocks straight out on any side, two blocks out on a diagonal, or two blocks out on one axis and one block along the other. Shelves placed directly beside the table, three blocks away, or anywhere outside the ring do nothing.",
  },
  {
    question: "What height do bookshelves need to be at?",
    answer:
      "The same height as the enchanting table or one block above it. Bookshelves below the table never count, which is why floor-level sunken layouts lose power. Stacking a second shelf on top of a ring shelf is a valid way to squeeze more shelves into a small room.",
  },
  {
    question: "What language is the enchanting table written in?",
    answer:
      "The glyphs use the Standard Galactic Alphabet, a one-to-one substitution cipher for the 26 English letters that predates Minecraft. It is a writing system, not a spoken language, and the words it spells out are decorative flavor text that never reveals which enchantment you will get. Paste the glyphs into the enchanting table translator to read them.",
  },
  {
    question: "Does the bookshelf layout shape matter, or just the count?",
    answer:
      "Only the count of unblocked shelves matters, so any shape that gets 15 shelves past the gap checks works: the classic ring with one opening, a full square ring, or a two-sided column layout stacked a block higher. Shape only affects how much floor space the setup takes.",
  },
  {
    question: "What is the highest enchantment level without bookshelves?",
    answer:
      "With zero shelves the bottom slot offers levels 1 to 8, which still covers useful level 1-5 enchantments on cheap tools. Reaching the level 25-30 band always requires the full 15 shelves, and lapis lazuli plus your own XP levels on top of that.",
  },
];

const JUMP_LINKS = [
  { href: "#how-to-make", label: "Crafting recipe" },
  { href: "#how-to-use", label: "How to use it" },
  { href: "#bookshelf-simulator", label: "Layout simulator" },
  { href: "#bookshelf-rules", label: "Bookshelf rules" },
  { href: "#symbols", label: "Table symbols" },
  { href: "#faq", label: "FAQ" },
];

const RECIPE_CELLS: Array<{ item: "book" | "diamond" | "obsidian" | "empty"; label: string }> = [
  { item: "empty", label: "Empty" },
  { item: "book", label: "Book" },
  { item: "empty", label: "Empty" },
  { item: "diamond", label: "Diamond" },
  { item: "obsidian", label: "Obsidian" },
  { item: "diamond", label: "Diamond" },
  { item: "obsidian", label: "Obsidian" },
  { item: "obsidian", label: "Obsidian" },
  { item: "obsidian", label: "Obsidian" },
];

const LEVEL_NOTE: Record<number, string> = {
  0: "No shelves: weakest options only",
  1: "First shelf opens the mid bands",
  5: "Solid mid-tier enchantments",
  10: "High tiers come into range",
  14: "Just misses level 30",
  15: "Level 30 guaranteed in the bottom slot",
};

const LEVEL_ROWS = Array.from({ length: MAX_ENCHANT_POWER + 1 }, (_, shelves) => {
  const range = bottomSlotRange(shelves);
  return {
    shelves,
    label: range.min === range.max ? `Level ${range.min}` : `Levels ${range.min}–${range.max}`,
    note: LEVEL_NOTE[shelves] ?? "—",
  };
});

export default function EnchantingTablePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://minecraftcirclegen.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Minecraft Enchanting Table",
        item: "https://minecraftcirclegen.com/enchanting-table",
      },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main id="main-content" className="enchanting-guide-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="hero">
        <div className="page-container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Enchanting Table</li>
            </ol>
          </nav>
          <h1>Minecraft Enchanting Table</h1>
          <p className="hero-subtitle">
            Everything the enchanting table needs in one place: the crafting recipe, an
            interactive 15-bookshelf layout simulator that shows when level 30 unlocks, the placement
            rules that silently break setups, and what the floating symbols really say.
          </p>
          <div className="house-hero-actions">
            <a href="#bookshelf-simulator" className="house-primary-button">Open the layout simulator</a>
            <Link href="/minecraft-enchanting-table-translator" className="house-secondary-button">Decode the symbols</Link>
          </div>
          <nav className="chart-jump-nav" aria-label="Jump to a section">
            {JUMP_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
        </div>
      </section>

      <article className="seo-content">
        <div className="content-container">
          <section className="tool-introduction">
            <h2>What the enchanting table does</h2>
            <p>
              The enchanting table is Minecraft&apos;s upgrade station for weapons, armor, tools, and books.
              It converts player levels and lapis lazuli into enchantments: spend three levels on a
              fresh diamond pickaxe and the table decides whether you walk away with Efficiency II or
              nothing worth keeping. Its power is not fixed — the table reads the bookshelves around it,
              counting up to 15, and every shelf between 0 and 15 widens the range of enchantment levels
              it can offer.
            </p>
            <p>
              That count is where almost every enchanting problem lives. A setup with 16 bookshelves and
              one misplaced torch performs worse than a careful 15-shelf ring, because the game never
              tells you why the good enchantments stopped appearing. The simulator below makes the
              counting visible.
            </p>
          </section>

          <section id="how-to-make">
            <h2>How to make an enchanting table</h2>
            <p>
              The recipe needs three materials that all appear in the mid-game: 4 obsidian, 2 diamonds,
              and 1 book. Arrange them in a crafting table exactly like this — the book sits alone in the
              top-center slot, the diamonds flank the center obsidian, and the bottom row is solid
              obsidian.
            </p>
            <div className="enchant-recipe" aria-label="Enchanting table crafting recipe">
              <div className="enchant-recipe-grid" role="img" aria-label="Crafting grid: book in the top-center slot, diamonds left and right of a center obsidian, obsidian across the bottom row">
                {RECIPE_CELLS.map((cell, index) => (
                  <span key={index} className={`enchant-recipe-cell is-${cell.item}`}>{cell.label}</span>
                ))}
              </div>
              <ul className="enchant-recipe-materials">
                <li><i className="is-obsidian" />4 obsidian — mine where water flows over a lava source, with a diamond pickaxe</li>
                <li><i className="is-diamond" />2 diamonds — iron pickaxe or better; most common around Y level -58</li>
                <li><i className="is-book" />1 book — craft from 3 paper (9 sugar cane) and 1 leather</li>
              </ul>
            </div>
            <p>
              Place the table on the floor with at least one free block on every side so you can walk up
              to it, and leave headroom for the bookshelf ring you are about to build. A 7×7 footprint
              fits the full 15-shelf ring with walking space around the table.
            </p>
          </section>

          <section id="how-to-use">
            <h2>How to use an enchanting table</h2>
            <ol className="guide-steps">
              <li>
                <strong>Put the item in the left slot.</strong>
                <span>
                  Tools, weapons, armor, and books all work. The item&apos;s material decides which
                  enchantments are offered at all.
                </span>
              </li>
              <li>
                <strong>Add lapis lazuli.</strong>
                <span>
                  The second slot takes 1-3 lapis. You pay lapis plus XP levels for the option you pick;
                  the number shown on each button is the level cost.
                </span>
              </li>
              <li>
                <strong>Compare the three offers.</strong>
                <span>
                  The bottom slot costs the most and delivers the strongest enchantment. Hover it to see
                  which enchantment you would get — one of the three is always revealed.
                </span>
              </li>
              <li>
                <strong>Reroll when the offers are weak.</strong>
                <span>
                  Options are fixed until the table sees a new item. Enchant a cheap book once, or swap
                  the item in the slot, to reroll the whole set before committing levels.
                </span>
              </li>
            </ol>
            <p>
              Enchanting books and combining them on an anvil is usually cheaper than rerolling for a
              perfect direct enchant. If you want a specific enchanted item without the grind, the{" "}
              <Link href="/minecraft-give-command-generator">Give Command Generator</Link> writes the
              command with the exact enchantment levels.
            </p>
          </section>

          <section id="bookshelf-simulator">
            <h2>15 bookshelf layout simulator</h2>
            <p>
              Click the ring slots to place bookshelves and the small gap cells to drop a torch in front
              of them. The counter shows how many shelves the table actually counts — the number that
              decides your enchantment range — not just how many you placed. Switch to the upper layer to
              plan stacked shelves, and start from a preset to see why the canonical layouts work.
            </p>
            <div className="enchant-simulator-shell">
              <BookshelfSimulator />
            </div>
          </section>

          <section id="bookshelf-rules">
            <h2>Bookshelf placement rules and the level 30 threshold</h2>
            <ul className="tips-grid">
              <li>
                <strong>Exactly two blocks away.</strong>
                <span>
                  Shelves count from a ring around the table: two blocks straight out, two blocks on a
                  diagonal, or two out on one axis and one on the other. Adjacent shelves and far
                  shelves both do nothing.
                </span>
              </li>
              <li>
                <strong>Table height or one above.</strong>
                <span>
                  Both heights count. Shelves sunk below the table or pushed two blocks up are ignored,
                  so stacked columns need their gap checked at each shelf&apos;s own height.
                </span>
              </li>
              <li>
                <strong>The gap must stay clear.</strong>
                <span>
                  Between shelf and table, the block at the shelf&apos;s height must let power through — air,
                  a snow layer, or short grass. Torches, carpets, stairs, and solid blocks cut off every
                  shelf behind them. Bedrock Edition additionally checks the block above the gap.
                </span>
              </li>
              <li>
                <strong>Fifteen is a hard cap.</strong>
                <span>
                  A full ring holds 16 shelves, but the table counts at most 15. The sixteenth shelf is
                  decoration, not power — which is why the classic layout simply leaves an opening.
                </span>
              </li>
            </ul>
            <h3>Enchantment levels by bookshelf count</h3>
            <p>
              The table&apos;s strongest offer is its bottom slot. Here is the exact range it can reach for
              every shelf count from 0 to 15 — note how 14 shelves stops one level short of the maximum.
            </p>
            <div className="size-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Bookshelves counting</th>
                    <th scope="col">Bottom slot offers</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {LEVEL_ROWS.map((row) => (
                    <tr key={row.shelves} id={`level-${row.shelves}`}>
                      <th scope="row">{row.shelves === 1 ? "1 shelf" : `${row.shelves} shelves`}</th>
                      <td>{row.label}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Layouts that reach level 30</h3>
            <p>
              The classic setup is a square ring of shelves two blocks out on all four sides with a
              single-block opening anywhere on a side: 15 shelves, all gaps open, level 30. Filling that
              opening for a 16-shelf ring works too — the cap just absorbs the extra. Tight rooms can use
              the two-sided column layout from the simulator&apos;s presets: shelves along two adjacent sides
              stacked one block above the table, which hits 14 and needs one more shelf added anywhere
              with a clear gap.
            </p>
            <p>
              The gap rule also doubles as a deliberate dial. Early in the game, placing torches in the
              gaps of a full ring drops the counted shelves and pushes the table down to cheap enchantment
              ranges, letting you burn spare levels instead of hoarding for 30. Remove the torches when
              you are ready for the top band again.
            </p>
          </section>

          <section id="symbols">
            <h2>What the enchanting table symbols say</h2>
            <p>
              The glyphs floating off the table are written in the{" "}
              <strong>Standard Galactic Alphabet</strong>, a substitution cipher that maps each of the 26
              English letters to a fixed alien-looking symbol. It is a letter-for-letter writing system —
              not a language Minecraft invented — and it first appeared in the Commander Keen games years
              before Mojang borrowed it for enchanting.
            </p>
            <p>
              Reading the glyphs is pure flavor: the words and fragments they spell are chosen at random
              and never encode the enchantment you are about to buy. But because every symbol matches one
              letter, the script is fully decodable. The{" "}
              <Link href="/minecraft-enchanting-table-translator">Enchanting Table Translator</Link>{" "}
              converts English into copyable glyphs and translates them back, with a complete A-Z chart
              for comparing symbols by eye.
            </p>
            <p>
              Want the same aesthetic for signs and chat? The{" "}
              <Link href="/minecraft-font-generator">Font Generator</Link> renders blocky pixel text and
              the <Link href="/minecraft-color-codes">Color Codes</Link> page documents the magic
              obfuscated code (&sect;k) behind shimmering glyph-style text.
            </p>
          </section>

          <section id="faq" className="faq-section">
            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
