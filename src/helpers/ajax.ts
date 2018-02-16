import { u } from 'umbrellajs';

// [INTERNAL USE ONLY]
// Parse JSON without throwing an error
function parseJson(jsonString: string) {
  try {
    let o = JSON.parse(jsonString);
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking
    // so we must check for that, too.
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) { }

  return false;
}

// Slightly modified version of Umbrella's ajax function

// Perform ajax calls
export function ajax(action: string, options?: Umbrella.AjaxOptions, doneCallback?: Umbrella.AjaxAfter, before?: Umbrella.AjaxBefore): XMLHttpRequest {
  const done = doneCallback || function () { };

  // A bunch of options and defaults
  const opt: any = options || {};
  const bodyProvided = !!opt.body;
  opt.body = opt.body || {};
  opt.method = (opt.method || 'GET').toUpperCase();
  opt.headers = opt.headers || {};

  // Tell the back-end it's an AJAX request
  if (bodyProvided) {
    opt.headers['X-Requested-With'] = opt.headers['X-Requested-With'] || 'XMLHttpRequest';
  }

  if (typeof FormData === 'undefined' || !(opt.body instanceof FormData)) {
    opt.headers['Content-Type'] = opt.headers['Content-Type'] || 'application/x-www-form-urlencoded';
  }

  // If it's of type JSON, encode it as such
  if (/json/.test(opt.headers['Content-Type'])) {
    opt.body = JSON.stringify(opt.body);
  }

  if ((typeof opt.body === 'object') && !(opt.body instanceof FormData)) {
    opt.body = u().param(opt.body);
  }

  // Create and send the actual request
  let request = new XMLHttpRequest();

  // An error is just an error
  // This uses a little hack of passing an array to u() so it handles it as
  // an array of nodes, hence we can use 'on'. However a single element wouldn't
  // work since it a) doesn't have nodeName and b) it will be sliced, failing
  u(request as any).on('error timeout abort', function () {
    done(new Error(), null, request);
  }).on('load', function () {
    // Also an error if it doesn't start by 2 or 3...
    // This is valid as there's no code 2x nor 2, nor 3x nor 3, only 2xx and 3xx
    // We don't want to return yet though as there might be some content
    let err = /^(4|5)/.test('' + request.status) ? new Error('' + request.status) : null;

    // Attempt to parse the body into JSON
    let body = parseJson(request.response) || request.response;

    return done(err, body, request);
  });

  // Create a request of the specified type to the URL and ASYNC
  request.open(opt.method, action);

  request.withCredentials = true;

  // Set the corresponding headers
  for (let name in opt.headers) {
    request.setRequestHeader(name, opt.headers[name]);
  }

  // Load the before callback before sending the data
  if (before) before(request);

  request.send(opt.body);

  return request;
}
