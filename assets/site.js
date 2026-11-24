// Shorts Studio site: shared settings and page behaviour.
// Change these two values in one place when the app or the release setup changes.
const SITE = {
  // Always points at the newest installer attached to a GitHub Release of this repo.
  downloadUrl: 'https://github.com/Seifpetit/shorts-studio-site/releases/latest/download/ShortsStudio-Setup.exe',
  // The link type the installed app registers with Windows.
  appScheme: 'shortsstudio://open',
};

// Every element marked data-download gets the installer link.
document.querySelectorAll('[data-download]').forEach((a) => { a.href = SITE.downloadUrl; });

// Copy buttons next to terminal commands.
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; }
    catch { btn.textContent = 'Select and copy'; }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
  });
});

// Install guide: install.html?dl=1 starts the download and shows a note.
if (document.body.dataset.page === 'install') {
  const params = new URLSearchParams(location.search);
  if (params.get('dl') === '1') {
    document.getElementById('dl-note').classList.remove('hidden');
    setTimeout(() => { location.href = SITE.downloadUrl; }, 400);
  }
}

// Connect page: hand off to the installed app through its shortsstudio:// link.
// connect.html?to=/series/brakes opens that screen in the app.
// connect.html?auto=1 tries to open the app as soon as the page loads.
if (document.body.dataset.page === 'connect') {
  const params = new URLSearchParams(location.search);
  const to = (params.get('to') || '').replace(/^\/+/, '');
  const target = to ? `${SITE.appScheme}/${encodeURI(to)}` : SITE.appScheme;
  const views = {
    ready: document.getElementById('state-ready'),
    opening: document.getElementById('state-opening'),
    opened: document.getElementById('state-opened'),
  };
  const help = document.getElementById('help');
  const show = (name) => Object.entries(views).forEach(([k, el]) => el.classList.toggle('hidden', k !== name));

  function openApp() {
    show('opening');
    help.classList.add('hidden');
    let handedOff = false;
    // When Windows opens the app, the browser usually loses focus or hides the tab.
    const onLeave = () => { handedOff = true; };
    window.addEventListener('blur', onLeave, { once: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) handedOff = true; }, { once: true });
    location.href = target;
    // A browser prompt may still be open, so help is shown beside the message, not instead of it.
    setTimeout(() => {
      if (handedOff) show('opened');
      help.classList.remove('hidden');
    }, 3000);
  }

  document.querySelectorAll('[data-open-app]').forEach((b) => b.addEventListener('click', openApp));
  if (params.get('auto') === '1') openApp();
}
