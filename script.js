// Упрощенный и надежный слайдер для логотипов
class LogosSlider {
  constructor() {
    this.slider = document.querySelector(".logos-slider");
    if (!this.slider) return;

    this.track = this.slider.querySelector(".logos-slider-track");
    this.slides = this.slider.querySelectorAll(".logos-slider-slide");
    this.dots = this.slider.querySelectorAll(".slider-dot");
    this.prevArrow = this.slider.querySelector(".prev-arrow");
    this.nextArrow = this.slider.querySelector(".next-arrow");

    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoSlideInterval = null;
    this.slidesPerView = this.getSlidesPerView();

    this.init();
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 5; // десктоп
  }

  init() {
    this.bindEvents();
    this.updateSlider();
    this.startAutoSlide();
  }

  bindEvents() {
    // Обработчики событий для стрелок
    this.nextArrow.addEventListener("click", () => this.nextSlide());
    this.prevArrow.addEventListener("click", () => this.prevSlide());

    // Обработчики для точек
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Останавливаем автопрокрутку при взаимодействии
    this.slider.addEventListener("mouseenter", () => this.stopAutoSlide());
    this.slider.addEventListener("touchstart", () => this.stopAutoSlide());
    this.slider.addEventListener("mouseleave", () => this.startAutoSlide());

    // Обработчик ресайза окна
    window.addEventListener("resize", () => this.handleResize());
  }

  updateSlider() {
    const slideWidth = 100 / this.slidesPerView;
    const translateX = -this.currentSlide * slideWidth;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Обновляем точки
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });

    // Обновляем состояние стрелок
    this.updateArrows();
  }

  updateArrows() {
    const maxSlide = this.totalSlides - this.slidesPerView;

    if (this.currentSlide <= 0) {
      this.prevArrow.style.opacity = "0.5";
      this.prevArrow.disabled = true;
    } else {
      this.prevArrow.style.opacity = "1";
      this.prevArrow.disabled = false;
    }

    if (this.currentSlide >= maxSlide) {
      this.nextArrow.style.opacity = "0.5";
      this.nextArrow.disabled = true;
    } else {
      this.nextArrow.style.opacity = "1";
      this.nextArrow.disabled = false;
    }
  }

  nextSlide() {
    const maxSlide = this.totalSlides - this.slidesPerView;
    if (this.currentSlide < maxSlide) {
      this.currentSlide++;
      this.updateSlider();
    } else {
      // Если достигли конца, возвращаемся к началу
      this.currentSlide = 0;
      this.updateSlider();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlider();
    } else {
      // Если в начале, переходим к концу
      const maxSlide = this.totalSlides - this.slidesPerView;
      this.currentSlide = maxSlide;
      this.updateSlider();
    }
  }

  goToSlide(index) {
    const maxSlide = this.totalSlides - this.slidesPerView;
    if (index >= 0 && index <= maxSlide) {
      this.currentSlide = index;
      this.updateSlider();
    }
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  handleResize() {
    const oldSlidesPerView = this.slidesPerView;
    this.slidesPerView = this.getSlidesPerView();

    // Сбрасываем на первый слайд только если изменилось количество видимых слайдов
    if (oldSlidesPerView !== this.slidesPerView) {
      this.currentSlide = 0;
      this.updateSlider();
    }
  }
}

// Управление модальным окном
class ModalManager {
  constructor() {
    this.listenerBtn = document.getElementById("listener-btn");
    this.listenerModal = document.getElementById("listener-modal");
    this.closeListenerModal = document.getElementById("close-listener-modal");
    this.listenerForm = document.getElementById("listener-form");

    if (this.listenerBtn && this.listenerModal) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.listenerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.openModal();
    });

    this.closeListenerModal.addEventListener("click", () => this.closeModal());

    // Закрытие модального окна при клике вне его области
    this.listenerModal.addEventListener("click", (e) => {
      if (e.target === this.listenerModal) {
        this.closeModal();
      }
    });

    // Закрытие модального окна при нажатии Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.listenerModal.style.display === "flex") {
        this.closeModal();
      }
    });

    // Обработка отправки формы
    if (this.listenerForm) {
      this.listenerForm.addEventListener("submit", (e) =>
        this.handleFormSubmit(e)
      );
    }
  }

  openModal() {
    this.listenerModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.listenerModal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = this.listenerForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;

    // Показываем состояние загрузки
    submitBtn.textContent = "Отправка...";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(this.listenerForm);

      const response = await fetch(this.listenerForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Регистрация успешно отправлена!");
        this.closeModal();
        this.listenerForm.reset();
      } else {
        throw new Error("Ошибка отправки формы");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  // Инициализируем слайдер
  new LogosSlider();

  // Инициализируем управление модальными окнами
  new ModalManager();

  // Дополнительные обработчики событий
  const file1 = document.getElementById("file1");
  if (file1) {
    file1.addEventListener("click", function (e) {
      alert("Начинается скачивание файла.");
    });
  }
});
