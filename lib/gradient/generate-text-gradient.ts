export interface GradientCharacter {
  character: string;
  hex: string;
}

export function normalizeTextGradientStops(stops: string[]) {
  return (stops.length >= 2 ? stops : ["#55FF55", "#55FFFF"])
    .map((stop) => /^#[0-9a-f]{6}$/i.test(stop) ? stop.toUpperCase() : "#FFFFFF");
}

function parseHex(hex: string) {
  const clean = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : "ffffff";
  return [0, 2, 4].map((index) => Number.parseInt(clean.slice(index, index + 2), 16));
}

function channelHex(value: number) {
  return Math.round(value).toString(16).padStart(2, "0");
}

function interpolate(start: string, end: string, amount: number) {
  const a = parseHex(start);
  const b = parseHex(end);
  return `#${a.map((channel, index) => channelHex(channel + (b[index] - channel) * amount)).join("")}`.toUpperCase();
}

export function generateTextGradient(text: string, stops: string[]): GradientCharacter[] {
  const activeStops = normalizeTextGradientStops(stops);
  const visibleLength = Math.max(1, [...text].filter((character) => character !== "\n").length - 1);
  let cursor = 0;
  return [...text].map((character) => {
    if (character === "\n") return { character, hex: activeStops[0] };
    const position = cursor++ / visibleLength;
    const scaled = position * (activeStops.length - 1);
    const segment = Math.min(activeStops.length - 2, Math.floor(scaled));
    return { character, hex: interpolate(activeStops[segment], activeStops[segment + 1], scaled - segment) };
  });
}

export function textGradientOutputs(characters: GradientCharacter[], stops: string[]) {
  const plain = characters.map((item) => item.character).join("");
  const miniMessageText = plain.replaceAll("\\", "\\\\").replaceAll("<", "\\<");
  const hex = characters.map((item) => item.character === "\n" ? "\n" : `<${item.hex}>${item.character}`).join("");
  const miniMessage = `<gradient:${normalizeTextGradientStops(stops).join(":")}>${miniMessageText}</gradient>`;
  const jsonComponents = characters.map((item) => ({ text: item.character, color: item.hex.toLowerCase() }));
  const tellraw = `/tellraw @a ${JSON.stringify(jsonComponents)}`;
  const pluginRgb = characters.map((item) => item.character === "\n" ? "\n" : `&${item.hex}${item.character}`).join("");
  return { hex, miniMessage, tellraw, pluginRgb };
}
