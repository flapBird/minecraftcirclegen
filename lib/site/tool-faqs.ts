import type { ToolKey } from "./tools";

export interface ToolFaq {
  question: string;
  answer: string;
}

export const TOOL_FAQS: Record<ToolKey, ToolFaq[]> = {
  circle: [
    {
      question: "What is a Minecraft circle generator?",
      answer: "A Minecraft circle generator converts a diameter into a block-by-block circle blueprint, showing exactly which blocks to place on the square Minecraft grid.",
    },
    {
      question: "How do I make a perfect circle in Minecraft?",
      answer: "Choose a diameter, mark the center axes, and copy the generated rows symmetrically. Grid lines make it easier to verify every turn in the outline.",
    },
    {
      question: "Should I use an odd or even diameter?",
      answer: "Odd circles have one center block, while even circles are centered between four blocks. Both are accurate; choose the alignment that suits your entrances and interior layout.",
    },
    {
      question: "Can I create a filled circle?",
      answer: "Yes. Turn on Filled for a solid foundation or platform, or leave it off for a one-block outline.",
    },
    {
      question: "How many blocks do I need?",
      answer: "The blueprint statistics count every occupied cell in the generated layout, giving you an exact material total for the selected size and mode.",
    },
  ],
  oval: [
    {
      question: "How do I make an oval in Minecraft?",
      answer: "Set the width and height independently, then copy the balanced block outline shown in the preview. A larger difference between the two values creates a more stretched oval.",
    },
    {
      question: "What can I build with a Minecraft oval?",
      answer: "Ovals work well for racetracks, stadiums, gardens, elongated rooms, decorative windows, airships, and curved roof plans.",
    },
    {
      question: "Can the oval be filled?",
      answer: "Yes. Hollow mode creates a one-block perimeter, while Filled creates a solid elliptical floor or foundation.",
    },
    {
      question: "Does the oval blueprint work in Java and Bedrock?",
      answer: "Yes. It is a general block layout and can be followed in either Minecraft edition.",
    },
  ],
  sphere: [
    {
      question: "Is this a 3D Minecraft sphere generator?",
      answer: "Yes. The tool represents the full 3D sphere as a sequence of horizontal block layers that you build from bottom to top.",
    },
    {
      question: "How do I build a sphere from the layer plans?",
      answer: "Build Layer 1 at the bottom, move up one Y level, and repeat the displayed plan for each layer until you reach the top.",
    },
    {
      question: "What is the difference between hollow and filled spheres?",
      answer: "Hollow mode keeps only the outer shell and saves materials. Filled mode occupies the entire volume and is useful for solid terrain or sculptural forms.",
    },
    {
      question: "Does the block total cover the whole sphere?",
      answer: "Yes. The statistics distinguish the blocks in the current layer from the total required for every layer of the sphere.",
    },
  ],
  dome: [
    {
      question: "How do I build a dome in Minecraft?",
      answer: "Start with the widest base layer, then move upward one block at a time while following each progressively smaller blueprint until the peak closes.",
    },
    {
      question: "What is the difference between a dome and a sphere?",
      answer: "A sphere includes both its upper and lower halves. A dome uses only the upper hemisphere, making it suitable for roofs and covered halls.",
    },
    {
      question: "Should a Minecraft dome be hollow or filled?",
      answer: "Hollow is normally best for roofs because it leaves usable interior space. Filled is useful when the dome is part of solid terrain or a sculpted mound.",
    },
    {
      question: "How many layers does a dome need?",
      answer: "The number depends on the diameter. The layer control displays the exact base-to-peak sequence for the selected size.",
    },
  ],
  gradient: [
    {
      question: "What is a Minecraft block gradient?",
      answer: "A Minecraft block gradient is an ordered sequence of real blocks that moves gradually from one color or material to another. Builders use gradients to add shading, depth, atmosphere, and smoother transitions to walls, roofs, terrain, statues, and pixel art.",
    },
    {
      question: "How are gradient blocks selected?",
      answer: "The generator measures the representative color of each block texture, creates evenly spaced targets in a perceptual color space, and matches each target to a close unused block in the selected palette. In Minecraft blocks mode, your start and end blocks always stay fixed.",
    },
    {
      question: "What is the difference between Minecraft blocks and Exact colors?",
      answer: "Minecraft blocks mode starts from two materials you choose and keeps them as fixed endpoints. Exact colors mode starts from two hex colors and finds vanilla blocks that approximate those visual targets.",
    },
    {
      question: "Does the gradient include modded blocks?",
      answer: "No. The current library uses vanilla Java Edition block names and texture previews. Block availability and appearance can vary between Minecraft versions, and some materials may differ or be unavailable in Bedrock Edition, so check the final list against the version you play.",
    },
    {
      question: "Why can a block look different in the finished build?",
      answer: "The generator matches representative texture colors, but Minecraft lighting, shadows, biome tint, shaders, block faces, and directional textures can change the result in game. Use the real texture ribbon as a first check, then test a small section in your world before gathering every material.",
    },
    {
      question: "Can I use the gradient in survival?",
      answer: "Yes. Select Common survival blocks to favor familiar building materials, then copy the ordered list or download the PNG plan. Always review the result because resource availability depends on your world and progression.",
    },
    {
      question: "Does the generator create a 3D Minecraft model?",
      answer: "No. The tool focuses on choosing a smooth, practical block sequence and shows it as a color target, real texture ribbon, and numbered build order. It does not create or export a 3D structure, schematic, or world file.",
    },
  ],
  "pixel-art": [
    {
      question: "Are uploaded images sent to a server?",
      answer: "No. Image decoding and block matching happen in your browser, and the source image is not uploaded or stored by the tool.",
    },
    {
      question: "What images make the best Minecraft pixel art?",
      answer: "Images with bold shapes, limited detail, and clear contrast usually produce the most readable and practical block builds.",
    },
    {
      question: "Does the generator calculate materials?",
      answer: "Yes. After conversion it counts each matched block type so you can prepare an exact material list.",
    },
    {
      question: "Can it export a schematic or Litematica file?",
      answer: "The current version exports a visual blueprint and material list, not a world, schematic, or Litematica file.",
    },
  ],
  "map-art": [
    {
      question: "How large is one Minecraft map-art tile?",
      answer: "A standard map covers a 128×128-block area, so one image pixel in a single-map plan corresponds to one placed block.",
    },
    {
      question: "Does this generator create flat map art?",
      answer: "Yes. The current version focuses on flat, human-buildable layouts and matches the image to practical Minecraft map colors.",
    },
    {
      question: "Can I make art larger than one map?",
      answer: "Yes. Choose a multi-map layout and the preview marks the boundaries between each 128×128 tile.",
    },
    {
      question: "Does it create a map.dat or world file?",
      answer: "No. It produces a PNG blueprint and material counts; it does not modify saves or generate map.dat files.",
    },
  ],
  font: [
    {
      question: "What characters does the Minecraft font generator support?",
      answer: "It supports letters, numbers, spaces, common punctuation, multiple text lines, and Minecraft-style colour and formatting codes using § or &.",
    },
    {
      question: "Does this use the official Minecraft font?",
      answer: "No. The generator uses an original 5×7 pixel alphabet designed for a Minecraft-inspired block look; it does not include or extract Mojang font assets.",
    },
    {
      question: "Which Minecraft formatting codes can I use?",
      answer: "Use colour codes 0–9 and a–f, plus l for bold, o for italic, n for underline, m for strikethrough, k for obfuscated text, and r to reset formatting.",
    },
    {
      question: "Why does line spacing only affect some text?",
      answer: "Line spacing adds empty block rows between separate text lines. Add a line break in the text box to use it.",
    },
    {
      question: "What does the Scale setting change?",
      answer: "Scale changes how many exported image pixels are used for each pixel-grid cell without changing the number of Minecraft blocks in the blueprint.",
    },
    {
      question: "What is the difference between Copy PNG and Copy blueprint?",
      answer: "Copy PNG copies the rendered image for pasting into compatible apps. Copy blueprint copies a character grid that marks text, shadow, outline, and empty blocks for planning a Minecraft build.",
    },
    {
      question: "Does the transparent checkerboard appear in the downloaded PNG?",
      answer: "No. The checkerboard only identifies transparent areas in the preview. It is never included in the copied or downloaded PNG.",
    },
    {
      question: "Can I build the generated letters in Minecraft?",
      answer: "Yes. Copy the text blueprint for a block-by-block plan, or use the PNG as a visual reference for signs, walls, and display builds.",
    },
  ],
};
