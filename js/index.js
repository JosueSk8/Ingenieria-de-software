document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  let currentIndex = 0;

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = 'translateX(-' + (slideWidth * currentIndex) + 'px)';
  }

  function moveNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function movePrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextButton.addEventListener('click', () => {
    moveNext();
    resetInterval();
  });

  prevButton.addEventListener('click', () => {
    movePrev();
    resetInterval();
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  // Auto-slide cada 5 segundos (5000 ms)
  let autoSlide = setInterval(moveNext, 5000);

  // Reiniciar temporizador cuando el usuario haga clic en botones
  function resetInterval() {
    clearInterval(autoSlide);
    autoSlide = setInterval(moveNext, 5000);
  }
});
