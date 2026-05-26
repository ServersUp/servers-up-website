const DISCORD_OAUTH_URL =
  "https://discord.com/oauth2/authorize?client_id=1497867221106688181";

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
  function getHeaderOffset() {
    const header = document.querySelector(".site-header");
    if (header instanceof HTMLElement) return header.getBoundingClientRect().height;
    return 0;
  }

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
    const headerOffset = getHeaderOffset();
    const targetY = headerOffset + 8;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const y = Math.max(0, targetTop - targetY);

    window.scrollTo({ top: y, behavior: "smooth" });
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

function setupServerSearch() {
  const inputs = Array.from(document.querySelectorAll("[data-server-search]")).filter(
    (el) => el instanceof HTMLInputElement,
  );

  for (const input of inputs) {
    if (input.closest("[data-wow-servers]")) continue;

    const key = input.getAttribute("data-server-search") || "";
    const list = document.querySelector(`[data-server-list="${CSS.escape(key)}"]`);
    const count = document.querySelector(`[data-server-count="${CSS.escape(key)}"]`);
    if (!(list instanceof HTMLElement)) continue;

    // Sort server rows alphabetically by their key.
    const rows = Array.from(list.querySelectorAll("[data-server-key]")).filter(
      (el) => el instanceof HTMLElement,
    );

    rows.sort((a, b) => {
      const ak = (a.getAttribute("data-server-key") || "").toLowerCase();
      const bk = (b.getAttribute("data-server-key") || "").toLowerCase();
      return ak.localeCompare(bk);
    });
    for (const row of rows) list.appendChild(row);

    const all = rows.length;

    const setCount = (visible) => {
      if (!(count instanceof HTMLElement)) return;
      count.textContent = `${visible} / ${all}`;
    };

    const apply = () => {
      const q = (input.value || "").trim().toLowerCase();
      let visible = 0;
      for (const row of rows) {
        const k = (row.getAttribute("data-server-key") || "").toLowerCase();
        const show = q.length === 0 || k.includes(q);
        row.style.display = show ? "" : "none";
        if (show) visible += 1;
      }
      setCount(visible);
    };

    input.addEventListener("input", apply);
    input.addEventListener("search", apply);
    apply();
  }
}

const WOW_REGION_LABELS = { us: "US", eu: "EU", kr: "KR", tw: "TW" };

function setupWowRegionServers() {
  const panel = document.querySelector("[data-wow-servers]");
  if (!(panel instanceof HTMLElement)) return;

  const lists = Array.from(panel.querySelectorAll("[data-wow-region-list]")).filter(
    (el) => el instanceof HTMLElement,
  );
  const input = panel.querySelector('[data-server-search="wow"]');
  const count = panel.querySelector('[data-server-count="wow"]');
  const searchLabel = panel.querySelector("[data-wow-search-label]");
  const tabs = panel.querySelectorAll("[data-wow-region-tab]");

  let region = panel.getAttribute("data-wow-region") || "us";
  let rows = [];

  function listFor(r) {
    return lists.find((el) => el.getAttribute("data-wow-region-list") === r) ?? null;
  }

  function setActiveTab(next) {
    region = next;
    panel.setAttribute("data-wow-region", next);
    for (const tab of tabs) {
      if (!(tab instanceof HTMLButtonElement)) continue;
      const r = tab.getAttribute("data-wow-region-tab") || "";
      const active = r === next;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }
  }

  function applyFilter() {
    const q = input instanceof HTMLInputElement ? input.value.trim().toLowerCase() : "";
    let visible = 0;
    for (const row of rows) {
      const k = (row.getAttribute("data-server-key") || "").toLowerCase();
      const show = q.length === 0 || k.includes(q);
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    }
    if (count instanceof HTMLElement) count.textContent = `${visible} / ${rows.length}`;
  }

  function showRegion(next) {
    setActiveTab(next);
    const activeList = listFor(next);
    for (const list of lists) list.hidden = list !== activeList;
    rows = activeList
      ? Array.from(activeList.querySelectorAll("[data-server-key]")).filter((el) => el instanceof HTMLElement)
      : [];

    const label = WOW_REGION_LABELS[next] || next.toUpperCase();
    if (searchLabel instanceof HTMLLabelElement) {
      searchLabel.setAttribute("aria-label", `Search World of Warcraft ${label} servers`);
    }
    if (input instanceof HTMLInputElement) {
      const example = rows[0]?.getAttribute("data-server-key") || "illidan";
      input.placeholder = `Search ${label} realms (e.g. ${example})`;
      input.value = "";
    }
    applyFilter();
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      if (!(tab instanceof HTMLButtonElement)) return;
      const next = tab.getAttribute("data-wow-region-tab");
      if (!next || next === region) return;
      showRegion(next);
    });
  }

  if (input instanceof HTMLInputElement) {
    input.addEventListener("input", applyFilter);
    input.addEventListener("search", applyFilter);
  }

  showRegion(region);
}

setYear();
setupMobileNav();
setupSmoothScroll();
hardenExternalLinks();
setupServerSearch();
setupWowRegionServers();

