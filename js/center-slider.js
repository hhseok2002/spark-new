document.querySelectorAll(".center-slider").forEach(slider => {
    const track = slider.querySelector(".slider-track");
    const slides = [...track.querySelectorAll(".slide")];
    const prev = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");

    let currentmain = 0;

    function updateSlider() {
        slides.forEach((slide, main) => {
            slide.classList.toggle("active", main === currentmain);
        });
        const activeSlide = slides[currentmain];
        const slideCenter =
            activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
        const containerCenter = slider.clientWidth / 2;

        track.style.transform =
            `translateX(${containerCenter - slideCenter}px)`;
    }

    next.addEventListener("click", () => {
        currentmain = (currentmain + 1) % slides.length;
        updateSlider();
    });
    prev.addEventListener("click", () => {
        currentmain =
            (currentmain -1 + slides.length) % slides.length;
        updateSlider();
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();

    slides.forEach((slide, main) => {
        slide.addEventListener("click", () => {
            currentmain = main;
            updateSlider();
        });
    });
});