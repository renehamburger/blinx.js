/** Load script for the given src dynamicaly & asynchronously */
export function loadScript(src: string, callback?: (successful: boolean) => void) {
  const script = document.createElement('script');
  script.src = src;
  if (callback) {
    script.onload = () => callback(true);
    script.onerror = () => callback(false);
  }
  document.body.appendChild(script);
}
