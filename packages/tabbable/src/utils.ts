type TagMap = HTMLElementTagNameMap;
export function is<Type extends keyof TagMap>(
  type: Type,
  node?: Node | null
): node is TagMap[Type] {
  return node?.nodeName === type.toUpperCase();
}

export function getTabindex(_node: Element) {
  const node = _node as HTMLElement;

  const tabindex = Number(node.getAttribute("tabindex"));

  if (
    is("audio", node) ||
    is("video", node) ||
    is("details", node) ||
    node.isContentEditable
  ) {
    return tabindex || 0;
  }

  return tabindex;
}
