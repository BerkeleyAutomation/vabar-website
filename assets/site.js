// Keep previously shared section URLs useful after splitting the long page.
(() => {
  const onHome = /\/$|\/index\.html$/.test(location.pathname);
  const destinations = {
    formulation: 'method.html#formulation', criteria: 'method.html#criteria',
    records: 'method.html#records', components: 'method.html#components',
    skills: 'method.html#skills', diagnosis: 'results.html#diagnosis',
    materials: 'resources.html#materials', overview: 'index.html#top'
  };
  function routeLegacyAnchor() {
    const destination = destinations[location.hash.slice(1)];
    if (onHome && destination) location.replace(destination);
  }
  routeLegacyAnchor();
  window.addEventListener('hashchange', routeLegacyAnchor);
  // All clips are user-initiated and expose native keyboard-accessible controls.
  // Pause media outside the viewport to avoid hidden playback on long task pages.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
    });
    document.querySelectorAll('video').forEach(video => observer.observe(video));
  }
})();
