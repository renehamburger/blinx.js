/** Load script for the given url dynamically & asynchronously */
export function loadScript(url: string, callback: (succesful: boolean) => void): void;
export function loadScript(url: string): Promise<void>;
export function loadScript(url: string, callback?: (succesful: boolean) => void): Promise<void> | void {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
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
