export const handleRedirect = (url) =>
  setTimeout(() => {
    window.location.href = url;
  }, 2000);

export const handleInstantRedirect = (url) => (window.location.href = url);

export const handleReload = () =>
  setTimeout(() => window.location.reload(), 2000);
