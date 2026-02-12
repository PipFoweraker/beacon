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
    html += '<p class="footer-contact">Inquiries: <a href="mailto:admin@beacongcr.org">admin@beacongcr.org</a></p>';
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

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertBefore(buildNav(), document.body.firstChild);
    document.body.appendChild(buildFooter());
  });
})();
