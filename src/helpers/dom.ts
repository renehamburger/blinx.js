/** Load script for the given src dynamicaly & asynchronously */
export function loadScript(src: string, callback?: (successful: boolean) => void): void {
  const script = document.createElement('script');
  script.src = src;
  if (callback) {
    script.onload = () => callback(true);
    script.onerror = () => callback(false);
  }
  document.body.appendChild(script);
}

export function loadCSS(src: string, callback?: (successful: boolean) => void): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = src;
  if (callback) {
    link.onload = () => callback(true);
    link.onerror = () => callback(false);
  }
  document.head.appendChild(link);
}
