import { Options } from 'src/options/options';
import { loadBlinx } from 'src/main';
import { u } from 'src/lib/u.js';
import { Blinx } from 'src/blinx.class';

export async function testRecognition(
  html: string,
  expectedLinkLabels: (string | RegExp)[],
  expectedOsisPassages: string[],
  // Specify default options, as parser is not always destroyed between tests and can lead to wrong language
  options: Partial<Options> = new Options()
): Promise<[Umbrella.Instance, Blinx]> {
  document.body.innerHTML = html;
  const blinx = loadBlinx(options);
  // Wait until links & tooltips are applied & check linked passages
  await blinx.testability.linksApplied;
  const links: Umbrella.Instance = u('[data-osis]');
  const passages: string[] = [];
  links.each((node) => passages.push(u(node).data('osis')));
  links.array().forEach((link, pos) => {
    expect(link).toMatch(expectedLinkLabels[pos] || '');
  });
  expect(passages).toEqual(expectedOsisPassages);
  return [links, blinx];
}

export function isIE9(): boolean {
  return /\bMSIE 9/.test(navigator.userAgent);
}
