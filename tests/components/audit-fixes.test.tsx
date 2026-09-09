// Regression checks for the defects found in the September 2026 site audit.
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { generateShapeLayers } from '@/lib/shape/generate-shape';
import { generateGeometry } from '@/lib/geometry/generate-geometry';
import { HOUSE_BLUEPRINTS } from '@/content/houses/blueprints';
import { generateGiveCommand, type GiveCommandInput } from '@/lib/minecraft/give-command';
import { makeMotdText, DEFAULT_TEXT_STYLES } from '@/lib/minecraft-text/formatting';
import { PlayerLookupTool } from '@/components/player-lookup/player-lookup-tool';
import { GiveCommandGenerator } from '@/components/give-command-generator/give-command-generator';
import { ColorCodesTool } from '@/components/color-codes/color-codes-tool';
import userEvent from '@testing-library/user-event';
import { TextGradientGenerator } from '@/components/gradient-generator/text-gradient-generator';
import { generateTextGradient, textGradientOutputs } from '@/lib/gradient/generate-text-gradient';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); window.history.replaceState(null, '', '/'); });

it('keeps even-diameter domes consistent across generators', () => {
  const actual = generateShapeLayers({ shape: 'dome', width: 20, height: 20, depth: 20, sides: 6, thickness: 1, filled: false, layer: 1 });
  const dedicated = generateGeometry('dome', { diameter: 20, width: 20, height: 20, mode: 'hollow', thickness: 1, layer: 1 });
  expect(actual[0].totalBlocks).toBe(484);
  expect(dedicated.totalBlocks).toBe(484);
});

it('derives the full house material checklist from the grids', () => {
  const house = HOUSE_BLUEPRINTS.find(b => b.slug === '7x7-starter-house')!;
  const count = (symbol: string) => house.layers.reduce((n, l) => n + [...l.rows.join('')].filter(c => c === symbol).length, 0);
  expect(count('R')).toBe(112);
  expect(house.materials.find(m => m.name === 'Oak planks')?.count).toBe(count('F') + count('W') + count('R'));
  expect(count('S')).toBe(24);
  expect(house.materials.find(m => m.name === 'Cobblestone')?.count).toBe(24);
});

it('maps identifiers to the selected Minecraft version', () => {
  const input: GiveCommandInput = { version: 'java-legacy', target: '@p', itemId: 'diamond_sword', amount: 1, customName: '', lore: [], enchantments: [{ id: 'sweeping_edge', level: 3 }], unbreakable: false };
  expect(generateGiveCommand(input)).toMatchObject({ errors: [], command: expect.stringContaining('minecraft:sweeping') });
  expect(generateGiveCommand({ ...input, version: 'java-components', enchantments: [], attributeComponentVersion: '1.20.5', attributes: [{ attribute: 'jump_strength', amount: 1, operation: 'add_value', slot: 'mainhand' }] })).toMatchObject({ errors: [], command: expect.stringContaining('minecraft:generic.jump_strength') });
});

it('downloads slash-free function files while retaining chat syntax', () => {
  const blobs: Blob[] = [];
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn((b: Blob) => { blobs.push(b); return 'blob:audit'; }), revokeObjectURL: vi.fn() }));
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const NativeBlob = Blob;
  let payload = '';
  vi.stubGlobal('Blob', class extends NativeBlob { constructor(parts: BlobPart[], options?: BlobPropertyBag) { super(parts, options); payload = parts.join(''); } });
  render(<GiveCommandGenerator />);
  fireEvent.click(screen.getByRole('button', { name: '.mcfunction' }));
  expect(payload).toBe('give @p minecraft:diamond_sword 1\n');
});

it('escapes MOTD multiline input and literal backslashes', () => {
  expect(makeMotdText('Hello\nWorld', 'a', DEFAULT_TEXT_STYLES)).toBe('\\u00A7aHello\\nWorld');
  expect(makeMotdText('C:\\new', 'a', DEFAULT_TEXT_STYLES)).toBe('\\u00A7aC:\\\\new');
});

it('normalizes gradient stops consistently for preview and export', () => {
  const stops = ['#55', '#55FFFF'];
  const output = textGradientOutputs(generateTextGradient('Hi', stops), stops);
  expect(output.hex).toContain('#FFFFFF');
  expect(output.miniMessage).toBe('<gradient:#FFFFFF:#55FFFF>Hi</gradient>');
});

it('keeps the last valid color and pauses copying during incomplete HEX edits', () => {
  render(<TextGradientGenerator />);
  const input = screen.getByLabelText('Start color HEX');
  const output = document.querySelector('.text-gradient-output pre')!;
  const original = output.textContent;
  fireEvent.change(input, { target: { value: '#55' } });
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copy output' })).toBeDisabled();
  expect(output.textContent).toBe(original);
  fireEvent.change(input, { target: { value: '#123456' } });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copy output' })).toBeEnabled();
  expect(output.textContent).toContain('#123456');
});

it('ignores stale responses after a newer query completes', async () => {
  let resolveOld!: (value: Response) => void;
  const old = new Promise<Response>(resolve => { resolveOld = resolve; });
  const profile = (username: string) => Response.json({ status: 'found', player: { username, uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', uuidCompact: '069a79f444e94726a5befca90e38aaf5', skinUrl: null } });
  vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(old).mockResolvedValueOnce(profile('SecondUser')));
  render(<PlayerLookupTool initialKind="username" />);
  const input = screen.getByLabelText('Minecraft username');
  fireEvent.change(input, { target: { value: 'FirstUser' } });
  fireEvent.click(screen.getByRole('button', { name: 'Check Username' }));
  fireEvent.change(input, { target: { value: 'SecondUser' } });
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Check Username' })); });
  expect(screen.getAllByText('SecondUser').length).toBeGreaterThan(0);
  await act(async () => { resolveOld(profile('FirstUser')); });
  expect(input).toHaveValue('SecondUser');
  expect(window.location.search).toContain('SecondUser');
  expect(screen.queryByText('FirstUser')).not.toBeInTheDocument();
  expect(screen.getAllByText('SecondUser').length).toBeGreaterThan(0);
});

it('exports a valid hyphenated Tailwind key and manages modal keyboard focus', async () => {
  render(<ColorCodesTool />);
  const trigger = screen.getByRole('button', { name: 'Export color palette' });
  trigger.focus();
  fireEvent.click(trigger);
  const close = screen.getByRole('button', { name: 'Close palette export' });
  expect(close).toHaveFocus();
  await userEvent.tab({ shift: true });
  expect(screen.getByRole('button', { name: 'Copy codes' })).toHaveFocus();
  await userEvent.tab();
  expect(close).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: /Tailwind v3/ }));
  fireEvent.change(screen.getByLabelText('Prefix'), { target: { value: 'my-brand' } });
  const code = document.querySelector('.palette-export-output pre')!.textContent!;
  expect(code).toContain('"my-brand": {');
  const exported = { exports: {} };
  new Function('module', code)(exported);
  expect(exported.exports).toHaveProperty('theme.extend.colors.my-brand');
  await userEvent.keyboard('{Escape}');
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.querySelector('[inert]')).toBeNull();
});
