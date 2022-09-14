import { isTabbable } from "./isTabbable";
import { defaultOption } from "./option";
import { getTabindex } from "./utils";

function* traverse(root: Element, option = defaultOption) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    (node) =>
      isTabbable(node as Element, option)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
  );

  while (walker.nextNode()) {
    yield walker.currentNode as Element;
  }

  return;
}

function tabbable(root: Element, option = defaultOption) {
  const zero_index_elements: Element[] = [];
  const positive_index_map = new Map<number, Element[]>();

  for (const element of traverse(root, option)) {
    const index = getTabindex(element);

    if (index === 0) {
      zero_index_elements.push(element);
    } else if (positive_index_map.has(index)) {
      positive_index_map.get(index)?.push(element);
    } else {
      positive_index_map.set(index, [element]);
    }
  }

  const positive_index_elements = Array.from(positive_index_map.entries())
    .sort((a, b) => a[0] - b[0])
    .flatMap(([_, elements]) => elements);

  return [...positive_index_elements, ...zero_index_elements];
}

export { tabbable };
