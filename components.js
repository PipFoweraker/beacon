// components.js — Shared navigation and footer for Beacon website
// Single source of truth: edit nav/footer here, all pages update.

(function () {
  'use strict';

  var NAV_ITEMS = [
    { label: 'Home', href: '/' },
    {
      label: 'About',
      href: '/about/',
      children: [
        { label: 'Mission & Theory of Change', href: '/about/theory-of-change.html' },
        { label: 'Scope & Focus', href: '/about/scope.html' },
        { label: 'Team & Governance', href: '/about/team.html' }
      ]
    },
    {
      label: 'Fiscal Sponsorship',
      href: '/fiscal-sponsorship/',
      children: [
        { label: 'Overview', href: '/fiscal-sponsorship/overview.html' },
        { label: 'Is Beacon Right for You?', href: '/fiscal-sponsorship/fit.html' },
        { label: 'Apply', href: '/fiscal-sponsorship/apply.html' },
        { label: 'Current Projects', href: '/fiscal-sponsorship/current-projects.html' }
      ]
    },
    {
      label: 'Resources',
      href: '/resources/',
      children: [
        { label: 'Starting a GCR Project', href: '/resources/starting.html' },
        { label: 'Funding & Grants', href: '/resources/funding.html' },
        { label: 'Grant Budget Builder', href: '/resources/budget-tool.html' },
        { label: 'Budget Templates', href: '/resources/budget-templates.html' },
        { label: 'Budget Reference Data', href: '/resources/budget-reference.html' },
        { label: 'Project Management', href: '/resources/project-management.html' },
        { label: 'Compliance & Governance', href: '/resources/compliance.html' }
      ]
    },
    { label: 'News', href: '/news.html' },
    { label: 'Contact', href: '/contact.html' }
  ];

  var FOOTER_LINKS = [
    { label: 'Privacy Policy', href: '/privacy.html' },
    { label: 'Terms of Use', href: '/terms.html' },
    { label: 'Conflict of Interest Policy', href: '/governance/coi.html' },
    { label: 'Financial Transparency', href: '/governance/financials.html' },
    { label: 'Accessibility', href: '/accessibility.html' }
  ];

  function isCurrentPage(href) {
    var path = window.location.pathname;
    if (href === '/') return path === '/' || path === '/index.html';
    var normalized = href.replace(/\.html$/, '').replace(/\/$/, '');
    return path === href || path === href.replace(/\/$/, '') ||
      path.startsWith(normalized + '/') ||
      path === normalized + '.html';
  }

  function isCurrentSection(item) {
    if (isCurrentPage(item.href)) return true;
    if (item.children) {
      for (var i = 0; i < item.children.length; i++) {
        if (isCurrentPage(item.children[i].href)) return true;
      }
    }
    return false;
  }

  function buildNav() {
    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    var html = '<div class="nav-container">';
    html += '<a href="/" class="nav-logo">Beacon</a>';
    html += '<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">';
    html += '<span></span><span></span><span></span>';
    html += '</button>';
    html += '<ul class="nav-menu">';

    for (var i = 0; i < NAV_ITEMS.length; i++) {
      var item = NAV_ITEMS[i];
      var active = isCurrentSection(item);
      var hasChildren = item.children && item.children.length > 0;

      html += '<li class="nav-item' + (hasChildren ? ' has-dropdown' : '') + (active ? ' current' : '') + '">';
      html += '<a href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';

      if (hasChildren) {
        html += '<ul class="nav-dropdown">';
        for (var j = 0; j < item.children.length; j++) {
          var child = item.children[j];
          var childActive = isCurrentPage(child.href);
          html += '<li><a href="' + child.href + '"' + (childActive ? ' aria-current="page"' : '') + '>' + child.label + '</a></li>';
        }
        html += '</ul>';
      }

      html += '</li>';
    }

    html += '</ul></div>';
    nav.innerHTML = html;

    var toggle = nav.querySelector('.nav-toggle');
    var menu = nav.querySelector('.nav-menu');
    toggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });

    return nav;
  }

  function buildFooter() {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';

    var year = new Date().getFullYear();
    var html = '<div class="footer-container">';
    html += '<div class="footer-main">';
    html += '<div class="footer-about">';
    html += '<p class="footer-name">Beacon Institute for Global Catastrophic Risk</p>';
    html += '<p class="footer-status">501(c)(3) status pending</p>';
    html += '<p class="footer-contact">Inquiries: <a class="email-link" data-name="admin" data-domain="beacongcr.org"></a></p>';
    html += '</div>';
    html += '<div class="footer-links"><ul>';
    for (var i = 0; i < FOOTER_LINKS.length; i++) {
      html += '<li><a href="' + FOOTER_LINKS[i].href + '">' + FOOTER_LINKS[i].label + '</a></li>';
    }
    html += '</ul></div>';
    html += '</div>';
    html += '<div class="footer-bottom">';
    html += '<p>&copy; ' + year + ' Beacon Institute for Global Catastrophic Risk.</p>';
    html += '</div>';
    html += '</div>';

    footer.innerHTML = html;
    return footer;
  }

  function assembleEmailLinks() {
    var links = document.querySelectorAll('.email-link');
    for (var i = 0; i < links.length; i++) {
      var el = links[i];
      var addr = el.getAttribute('data-name') + '@' + el.getAttribute('data-domain');
      el.href = 'mailto:' + addr;
      if (!el.textContent) el.textContent = addr;
    }
  }

  function buildToc() {
    var content = document.querySelector('.content');
    if (!content) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length < 4) return; // Only add ToC for substantial pages

    // Ensure each heading has an ID
    for (var i = 0; i < headings.length; i++) {
      if (!headings[i].id) {
        headings[i].id = 'section-' + headings[i].textContent.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      }
    }

    // Build ToC HTML
    var toc = document.createElement('nav');
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', 'Table of contents');
    var title = document.createElement('span');
    title.className = 'page-toc-title';
    title.textContent = 'On this page';
    toc.appendChild(title);

    var list = document.createElement('ul');
    for (var j = 0; j < headings.length; j++) {
      var h = headings[j];
      var li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-sub' : '';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.setAttribute('data-toc-idx', j);
      li.appendChild(a);
      list.appendChild(li);
    }
    toc.appendChild(list);

    // Wrap content in a flex layout with ToC sidebar
    var wrapper = document.createElement('div');
    wrapper.className = 'toc-layout';
    content.parentNode.insertBefore(wrapper, content);
    wrapper.appendChild(toc);
    wrapper.appendChild(content);

    // Scroll spy: highlight current section
    var tocLinks = list.querySelectorAll('a');
    var debounce = null;
    window.addEventListener('scroll', function () {
      if (debounce) return;
      debounce = setTimeout(function () {
        debounce = null;
        var current = null;
        for (var k = 0; k < headings.length; k++) {
          if (headings[k].getBoundingClientRect().top <= 100) current = k;
        }
        for (var m = 0; m < tocLinks.length; m++) {
          tocLinks[m].parentNode.classList.toggle('active', m === current);
        }
      }, 50);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertBefore(buildNav(), document.body.firstChild);
    document.body.appendChild(buildFooter());
    assembleEmailLinks();
    buildToc();
  });
})();
