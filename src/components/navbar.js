export function navbar(activePath = '') {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/chat', label: 'Chat' },
    { href: '/about', label: 'About' },
  ];

  return `
    <nav class="appNav">
      ${links.map(link => `
        <a href="${link.href}" class="${activePath === link.href ? 'appNav__link--active' : ''} appNav__link">
          ${link.label}
        </a>
      `).join('')}
    </nav>
  `;
}