export function filteredBody(body, whitelist) {
  const newParams = {};
  whitelist.forEach(attr => {
    if (Object.prototype.hasOwnProperty.call(body, attr)) {
      newParams[attr] = body[attr];
    }
  });
  
  return newParams;
}
