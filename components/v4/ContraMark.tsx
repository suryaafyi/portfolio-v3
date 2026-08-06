/**
 * The Contra brand logo (iridescent star mark). Sized by the parent via the
 * .contra-mark class; the parent handles any idle/hover animation.
 */
export default function ContraMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="contra-mark" src="/contra-logo.webp" alt="Contra" />
  );
}
