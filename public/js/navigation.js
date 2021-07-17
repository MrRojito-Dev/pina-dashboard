function select(link) {
    const item = link.parentNode;
    const tabs = item.parentNode;
    const index = Array.prototype.indexOf.call(tabs.children, item);
    const items = tabs.querySelectorAll('.nav-item');

    tabs.style.setProperty('--index', index + 1);
    items.forEach(item => item.classList.remove('active'));
    item.classList.add('active');
}