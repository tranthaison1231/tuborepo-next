import { getTabindex, is } from "./utils";
import { defaultOption } from "./option";

function isTabbable(node: Element, option = defaultOption) {
  if (node.hasAttribute("disabled")) {
    return false;
  }

  if (option.displayCheck) {
    if (node.getClientRects().length <= 0) {
      return false;
    }

    const style = getComputedStyle(node);
    if (style.visibility === "hidden") {
      return false;
    }
  }

  if (node.hasAttribute("tabindex")) {
    return getTabindex(node) >= 0;
  }

  if (
    node.hasAttribute("contenteditable") &&
    node.getAttribute("contenteditable") !== "false"
  ) {
    return true;
  }

  if (
    is("details", node.parentNode) &&
    is("summary", node) &&
    node.parentNode.querySelector("summary") === node
  ) {
    return true;
  }

  if (is("details", node.parentNode) && !node.parentNode.open) {
    return false;
  }

  if (is("details", node) && !node.querySelector("summary")) {
    return true;
  }

  if (
    (is("audio", node) || is("video", node)) &&
    node.hasAttribute("controls")
  ) {
    return true;
  }

  if (is("a", node) && node.hasAttribute("href")) {
    return true;
  }

  if (
    node.matches(
      "fieldset[disabled] > legend:first-child :where(input, button, select, textarea)"
    )
  ) {
    return !node.closest("fieldset[disabled]")?.matches("fieldset[disabled] *");
  }

  const enabled = !node.matches("fieldset:disabled *");

  if (is("button", node) && enabled) {
    return true;
  }

  if (is("input", node) && enabled && node.type === "radio") {
    if (!node.name) return true;

    const name = CSS.escape(node.name);

    if (node.form) {
      const selector = `input[type="radio"][name=${name}]:checked`;
      const checked = node.form.querySelector(selector);

      return !checked || node === checked;
    }

    const root = node.getRootNode() as Element;
    const selector = `input[type="radio"][name=${name}]:checked:not(form *)`;
    const checked = root.querySelector(selector);

    return !checked || node === checked;
  }

  if (is("input", node) && enabled) {
    return true;
  }

  if (is("select", node) && enabled) {
    return true;
  }

  if (is("textarea", node) && enabled) {
    return true;
  }

  return false;
}

export { isTabbable };
