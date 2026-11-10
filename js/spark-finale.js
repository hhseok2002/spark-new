(() => {
  const openButton = document.querySelector('#spark-celebrate');
  const dialog = document.querySelector('#spark-finale');
  const heading = document.querySelector('#spark-message');
  const typedText = heading.querySelector('span');
  const letters = Array.from(heading.getAttribute('aria-label'));
  const canvas = document.querySelector('#spark-confetti');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let typingTimer;
  let animationFrame;

  function launchConfetti() {
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const colors = ['#526dff', '#ff52b6', '#9cb9ff', '#ffd0ec', '#ffffff'];
    const duration = 2.4;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const pieces = Array.from({ length: 190 }, (_, index) => {
      const fromLeft = index % 2 === 0;
      const direction = fromLeft ? 1 : -1;

      return {
        x: width * (fromLeft ? 0.08 : 0.92),
        y: height * 0.76,
        vx: direction * width * (0.20 + Math.random() * 0.85),
        vy: -220 - Math.random() * 340,
        spin: (Math.random() - 0.5) * 14,
        size: 7 + Math.random() * 10,
        color: colors[index % colors.length]
      };
    });

    const start = performance.now();

    function draw(now) {
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      if (elapsed >= duration) return;

      ctx.globalAlpha = Math.min(1, (duration - elapsed) / 0.7);

      for (const piece of pieces) {
        const x = piece.x + piece.vx * elapsed;
        const y = piece.y + piece.vy * elapsed + 200 * elapsed ** 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(piece.spin * elapsed);
        ctx.fillStyle = piece.color;
        ctx.fillRect(0, 0, piece.size, piece.size * 0.55);
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    animationFrame = requestAnimationFrame(draw);
  }

  openButton.addEventListener('click', () => {
    if (dialog.open) return;

    typedText.textContent = '';
    dialog.showModal();

    if (reducedMotion.matches) {
      typedText.textContent = letters.join('');
      return;
    }

    let index = 0;

    function typeNext() {
      typedText.textContent += letters[index];
      index += 1;

      if (index < letters.length) {
        typingTimer = setTimeout(typeNext, 90);
      } else {
        launchConfetti();
      }
    }

    typeNext();
  });

  dialog.addEventListener('close', () => {
    clearTimeout(typingTimer);
    cancelAnimationFrame(animationFrame);

    if (ctx) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    openButton.focus();
  });
})();