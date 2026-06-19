// ==== embed ====
// builds html embeds for htmlEmbed field
//
// > el: builds element string with escaped attrs/children
// > escape: escapes text for content or attributes
// > images: external <img src> supported via client proxy
// > style: top-level <style> with class scoping

const VOID_TAGS = new Set(["img", "br", "hr", "input"]);

function escape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function el(tag, attributes = {}, content = []) {
  const attrs = Object.entries(attributes)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => ` ${k}="${escape(v)}"`)
    .join("");

  if (VOID_TAGS.has(tag)) return `<${tag}${attrs} />`;

  const inner = Array.isArray(content) ? content.join("") : content;
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

module.exports = { el, escape };
