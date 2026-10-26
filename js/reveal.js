const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(entry => entry.isIntersecting);

    visible.forEach((entry, i) => {
            entry.target.style.setProperty ('--delay', `${Math.min(i, 3) * 0.08}s`);
            entry.target.classList.add('show');
            io.unobserve(entry.target);
    });
}, { 
    threshold: 0,
    rootMargin: '0px 0px 150px 0px'
});

document.querySelectorAll(
    '.work-list .work-item, .artwork-list .artwork, section, .exhibition > *,' +
    '.visual > h2, .visual > h1, .visual-text > h3, .visual-lead, ' +
    '.poster-frame, .color-box, ' +
    '.location > h2, .location > h1, .map, .information > div, ' +
    '.e-main-images, .e-information h1, .name-box, .e-title .text, ' +
    '.mockup-list .mockup, ' +
    '.keywords li' 
).forEach(el => io.observe(el));