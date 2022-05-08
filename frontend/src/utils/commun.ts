const isInViewport = (element: any, { top = 0, left = 0, bottom = 0, right = 0 }) => {
  if (!element) return;
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= top &&
    rect.left >= left &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - bottom &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) - right
  );
};

export { isInViewport };
