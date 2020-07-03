let uniqueNumber = 0;

/** Load script for the given url dynamically & asynchronously */
export function loadScript(url: string, callback: (succesful: boolean) => void): void;
export function loadScript(url: string): Promise<void>;
export function loadScript(
  url: string,
  callback?: (succesful: boolean) => void
): Promise<void> | void {
  const script = document.createElement('script');
  // Add unique qualifier to prevent caching by IE10, which leads to onload not being called the second time.
  // (This happens in specs if the parser language is changed from 'en' to 'de' and then back to 'en')
  script.src = url + (/\?/.test(url) ? '&' : '?') + `_=${uniqueNumber++}`;
  document.head.appendChild(script);
  if (callback) {
    script.onload = () => callback(true);
    script.onerror = () => callback(false);
  } else if ('Promise' in window) {
    return new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject();
    });
  }
}

/** Load script for the given url dynamically & asynchronously */
export function loadCSS(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject();
    document.head.appendChild(link);
  });
}

export function injectCSS(content: string): void {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = content;
  document.head.appendChild(style);
}
