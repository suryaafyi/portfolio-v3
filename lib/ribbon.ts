// Ribbon-helix layout, ported verbatim from the Claude Design source
// (Spiral Gallery — study 1a). A snaking vertical ribbon in real 3D: x/z trace a
// helix via sin/cos, y spreads the cards down the column. `p` is the card's
// position along the loop (0..L), `L` the card count.
export function ribbonLayout(p: number, L: number) {
  const t = p - L / 2;
  const f = 0.62;
  const si = Math.sin(t * f);
  const co = Math.cos(t * f);
  return {
    x: 250 * si + t * 10,
    y: t * 84,
    z: 235 * co,
    rx: -co * 5,
    ry: -si * 15,
    rz: si * 5,
    op: Math.max(0, Math.min(1, (L / 2 - Math.abs(t)) / 1.3)),
  };
}
