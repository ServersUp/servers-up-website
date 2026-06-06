const DISCORD_OAUTH_URL =
  "https://discord.com/oauth2/authorize?client_id=1497867221106688181";

const GAMES = {
  wow: {
    label: "World of Warcraft",
    short: "WoW",
    dataUrl: "./data/wow-servers.json",
    regions: { us: "US", eu: "EU", kr: "KR", tw: "TW" },
    defaultRegion: "us",
    unit: "realms",
  },
  ffxiv: {
    label: "Final Fantasy XIV",
    short: "FFXIV",
    dataUrl: "./data/ffxiv-servers.json",
    regions: { na: "NA", eu: "EU", jp: "JP", oce: "OCE" },
    defaultRegion: "na",
    unit: "worlds",
  },
};

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!(toggle instanceof HTMLButtonElement) || !(links instanceof HTMLElement)) return;

  function setOpen(next) {
    links.classList.toggle("is-open", next);
    toggle.setAttribute("aria-expanded", next ? "true" : "false");
  }

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));

  links.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (!links.classList.contains("is-open")) return;
    if (links.contains(t) || toggle.contains(t)) return;
    setOpen(false);
  });
}

function setupSmoothScroll() {
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const a = t.closest('a[data-scroll="true"]');
    if (!(a instanceof HTMLAnchorElement)) return;

    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!(target instanceof HTMLElement)) return;

    e.preventDefault();
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, targetTop - 12), behavior: "smooth" });
    history.pushState(null, "", href);
  });
}

function hardenExternalLinks() {
  for (const a of document.querySelectorAll('a[target="_blank"]')) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const rel = (a.getAttribute("rel") || "").toLowerCase();
    if (!rel.includes("noreferrer")) a.setAttribute("rel", "noreferrer");
  }

  for (const a of document.querySelectorAll('a[href="' + DISCORD_OAUTH_URL + '"]')) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    a.setAttribute("href", DISCORD_OAUTH_URL);
  }
}

async function loadGameRegions(id) {
  const bundled = window.SERVERSUP_GAME_DATA?.[id];
  if (bundled) return bundled;

  const res = await fetch(GAMES[id].dataUrl);
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  return data.regions || {};
}

async function setupGameBrowser() {
  const root = document.getElementById("game-browser");
  if (!(root instanceof HTMLElement)) return;

  const gameTabs = root.querySelectorAll("[data-game-tab]");
  const regionRow = root.querySelector("[data-region-row]");
  const searchInput = root.querySelector("[data-realm-search]");
  const listEl = root.querySelector("[data-realm-list]");
  const countEl = root.querySelector("[data-realm-count]");
  const statusEl = root.querySelector("[data-realm-status]");

  if (
    !(regionRow instanceof HTMLElement) ||
    !(searchInput instanceof HTMLInputElement) ||
    !(listEl instanceof HTMLElement) ||
    !(countEl instanceof HTMLElement)
  ) {
    return;
  }

  const cache = {};
  let gameId = "wow";
  let region = GAMES.wow.defaultRegion;
  let servers = [];

  async function getRegions(id) {
    if (cache[id]) return cache[id];
    const regions = await loadGameRegions(id);
    cache[id] = regions;
    return regions;
  }

  function setGameTabActive(id) {
    for (const tab of gameTabs) {
      if (!(tab instanceof HTMLButtonElement)) continue;
      const active = tab.getAttribute("data-game-tab") === id;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }
  }

  function renderRegionTabs(regions) {
    regionRow.replaceChildren();
    const cfg = GAMES[gameId];
    const keys = Object.keys(cfg.regions);
    if (!keys.includes(region)) region = cfg.defaultRegion;

    for (const key of keys) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "region-tab";
      btn.setAttribute("data-region-tab", key);
      btn.setAttribute("role", "tab");
      btn.textContent = cfg.regions[key];
      if (key === region) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.setAttribute("aria-selected", "false");
      }
      btn.addEventListener("click", () => {
        if (region === key) return;
        region = key;
        renderRegionTabs(regions);
        applyServers(regions[region] || []);
      });
      regionRow.appendChild(btn);
    }
  }

  function renderList(filtered) {
    listEl.replaceChildren();
    if (filtered.length === 0) {
      const empty = document.createElement("li");
      empty.className = "realm-empty";
      empty.textContent = "No matches.";
      listEl.appendChild(empty);
      return;
    }
    for (const name of filtered) {
      const li = document.createElement("li");
      li.className = "realm-item";
      const code = document.createElement("code");
      code.textContent = name;
      li.appendChild(code);
      listEl.appendChild(li);
    }
  }

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = q.length === 0 ? servers : servers.filter((s) => s.toLowerCase().includes(q));
    renderList(filtered);
    countEl.textContent = `${filtered.length} / ${servers.length}`;
  }

  function applyServers(next) {
    servers = Array.isArray(next) ? [...next].sort((a, b) => a.localeCompare(b)) : [];
    searchInput.value = "";
    applyFilter();
  }

  async function showGame(id) {
    gameId = id;
    region = GAMES[id].defaultRegion;
    setGameTabActive(id);
    if (statusEl instanceof HTMLElement) statusEl.textContent = "Loading…";

    try {
      const regions = await getRegions(id);
      renderRegionTabs(regions);
      applyServers(regions[region] || []);
      if (statusEl instanceof HTMLElement) statusEl.textContent = "";
    } catch {
      regionRow.replaceChildren();
      listEl.replaceChildren();
      countEl.textContent = "—";
      if (statusEl instanceof HTMLElement) statusEl.textContent = "Could not load server list.";
    }
  }

  for (const tab of gameTabs) {
    tab.addEventListener("click", () => {
      if (!(tab instanceof HTMLButtonElement)) return;
      const id = tab.getAttribute("data-game-tab");
      if (!id || id === gameId || !GAMES[id]) return;
      showGame(id);
    });
  }

  searchInput.addEventListener("input", applyFilter);
  searchInput.addEventListener("search", applyFilter);

  showGame(gameId);
}

setYear();
setupMobileNav();
setupSmoothScroll();
hardenExternalLinks();
setupGameBrowser();
