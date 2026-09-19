function createNavbar(activePage, doc = document) {
  const nav = doc.createElement("nav");
  nav.className = "navbar navbar-expand-lg navbar-dark bg-dark sticky-top";

  const navItems = [
    { page: "home", label: "About", href: "index.html#about" },
    { page: "toolbox", label: "Toolbox", href: "toolbox.html" },
    { page: "resources", label: "Resources", href: "resources.html" },
    { page: "contact", label: "Contact", href: "index.html#contact" },
  ];

  const links = navItems
    .map(({ page, label, href }) => {
      const isActive = page === activePage;
      const activeAttributes = isActive
        ? ' class="nav-link active" aria-current="page"'
        : ' class="nav-link"';

      return `<li class="nav-item"><a href="${href}"${activeAttributes}>${label}</a></li>`;
    })
    .join("");

  nav.innerHTML = `
    <div class="container">
      <a class="navbar-brand fw-extrabold" href="index.html">SDS-EDU</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">${links}</ul>
      </div>
    </div>
  `;

  return nav;
}

function createFooter(doc = document, year = new Date().getFullYear()) {
  const footer = doc.createElement("footer");
  footer.className = "bg-dark text-white text-center py-4";
  footer.innerHTML = `
    <div class="container">
      <p class="mb-0 ">
        &copy; ${year} Software Design School &mdash; Open Educational Resources
      </p>
    </div>
  `;

  return footer;
}

function injectLayout(doc = document) {
  const activePage = doc.body.dataset.page;
  const navMount = doc.getElementById("site-nav");
  const footerMount = doc.getElementById("site-footer");

  if (navMount) {
    navMount.replaceChildren(createNavbar(activePage, doc));
  }

  if (footerMount) {
    footerMount.replaceChildren(createFooter(doc));
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createNavbar, createFooter, injectLayout };
}

if (typeof document !== "undefined") {
  injectLayout(document);
}
