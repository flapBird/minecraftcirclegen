import type { HouseFaq } from "./types";

export type StaircaseDesign = {
  name: string;
  footprint: string;
  dimensions: { width: number; length: number };
  materials: string;
  bestFor: string;
  buildNote: string;
  pattern: string[];
};

export const STAIRCASE_DESIGNS: StaircaseDesign[] = [
  { name: "Straight Staircase", footprint: "2×5", dimensions: { width: 2, length: 5 }, materials: "Stairs + solid landing blocks", bestFor: "Long halls and simple starter houses", buildNote: "Keep two blocks of headroom above every tread and place a landing before the upper doorway.", pattern: ["11", "22", "33", "44", "55"] },
  { name: "L-Shaped Staircase", footprint: "4×4", dimensions: { width: 4, length: 4 }, materials: "Stairs, corner landing, optional rail", bestFor: "Compact two-story houses", buildNote: "Use a 2×2 landing at the turn so the upper run begins without a cramped diagonal corner.", pattern: ["11..", "22..", "3344", "3344"] },
  { name: "U-Shaped Staircase", footprint: "4×6", dimensions: { width: 4, length: 6 }, materials: "Two stair runs + middle landing", bestFor: "Medium houses with a central stair hall", buildNote: "Run the flights in opposite directions and keep the landing at least two blocks deep.", pattern: ["11..", "22..", "33..", "..44", "..55", "..66"] },
  { name: "Spiral Staircase", footprint: "5×5", dimensions: { width: 5, length: 5 }, materials: "Stairs/slabs around a center column", bestFor: "Round towers and vertical bases", buildNote: "Rotate each step around the center column and test the head clearance after every full turn.", pattern: [".344.", "2...5", "2.C.5", "1...6", ".887."] },
  { name: "Compact Staircase", footprint: "2×3", dimensions: { width: 2, length: 3 }, materials: "Stairs, slabs, trapdoor", bestFor: "Tiny houses and loft access", buildNote: "Use slabs to gain half-block height, but verify that the route remains comfortable in your edition and layout.", pattern: ["11", "22", "33"] },
  { name: "Grand Staircase", footprint: "7×6", dimensions: { width: 7, length: 6 }, materials: "Wide stairs, landings, walls or rails", bestFor: "Mansions and large entry halls", buildNote: "Start with a three-block-wide center flight, then split it symmetrically at a generous landing.", pattern: ["..111..", "..222..", "..333..", ".44.55.", "66...77", "66...77"] },
  { name: "Hidden Staircase", footprint: "2×5", dimensions: { width: 2, length: 5 }, materials: "Matching stairs, wall blocks, optional piston system", bestFor: "Secret rooms and concealed storage", buildNote: "The static version hides behind a matching wall or trapdoor; redstone behavior should be tested separately in Java or Bedrock.", pattern: ["##", "#1", "#2", "#3", "#4"] },
  { name: "Basement Staircase", footprint: "3×5", dimensions: { width: 3, length: 5 }, materials: "Stairs, retaining walls, lighting", bestFor: "Cellars, mines, and underground storage", buildNote: "Excavate the full headroom first, then line the opening and add lighting before connecting deeper rooms.", pattern: ["#1#", "#2#", "#3#", "#4#", "#5#"] },
];

export const STAIRCASE_FAQS: HouseFaq[] = [
  { question: "What is the smallest practical Minecraft staircase?", answer: "A 2×3 alternating stair-and-slab route can reach a compact loft, but a 2×5 straight flight is easier to move through and gives more dependable head clearance." },
  { question: "How much headroom does a Minecraft staircase need?", answer: "Plan two clear blocks above the walking surface at every step. Build the opening before decorating the upper floor so ceiling blocks or beams do not interrupt the route." },
  { question: "Which staircase is best for a small house?", answer: "An L-shaped 4×4 stair fits naturally in a corner and feels more deliberate than a ladder. Very small builds can use a 2×3 compact stair or a ladder loft." },
  { question: "How do I plan a spiral staircase?", answer: "Choose an odd footprint such as 5×5, mark the center column, and rotate stairs or slabs around it one level at a time. A round tower planned with the Circle Generator gives the stair a consistent outside wall." },
];

