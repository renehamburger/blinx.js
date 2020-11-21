import uniqBy = require('lodash/uniqBy');

export function extractOrderedTextNodesFromNodes(nodes: Node[]): Text[] {
  let textNodes: Text[] = [];
  for (const node of nodes) {
    textNodes = textNodes.concat(extractOrderedTextNodesFromSingleNode(node));
  }
  return uniqBy(textNodes, (node) => node);
}

function extractOrderedTextNodesFromSingleNode(node: Node): Text[] {
  const childNodes = [].slice.call(node.childNodes);
  let textNodes: Text[] = [];
  for (const childNode of childNodes) {
    if (isTextNode(childNode)) {
      textNodes.push(childNode);
    } else {
      textNodes = textNodes.concat(extractOrderedTextNodesFromSingleNode(childNode));
    }
  }
  return textNodes;
}

function isTextNode(node: Node): node is Text {
  return node.nodeType === node.TEXT_NODE;
}

export function getAttributeBySelectors(element: Umbrella.Instance, selectors: string[]): string {
  for (const selector of selectors) {
    const value = element.attr(selector.replace(/^.*\[(.*)\]$/, '$1'));
    if (value) {
      return value;
    }
  }
  return '';
}

export function makePureBookReferencesParseable(reference: string): string {
  return reference;
}
