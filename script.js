class ConferenceApp {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.initMap();
  }

  initializeElements() {
    // Кнопки
    this.listenerBtn = document.getElementById("listener-btn");
    this.closeListenerModal = document.getElementById("close-listener-modal");

    // Модальные окна и формы
    this.listenerModal = document.getElementById("listener-modal");
    this.listenerForm = document.getElementById("listener-form");

    // Ссылки
    this.razuLink = document.getElementById("razu-link");
    this.file1 = document.getElementById("file1");
    this.privacyLink = document.getElementById("privacy-link");
  }

  bindEvents() {
    // Открытие модального окна
    this.listenerBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.openModal(this.listenerModal);
    });

    // Закрытие модального окна
    this.closeListenerModal?.addEventListener("click", () => {
      this.closeModal(this.listenerModal);
    });

    // Закрытие модального окна при клике вне его
    this.listenerModal?.addEventListener("click", (e) => {
      if (e.target === this.listenerModal) {
        this.closeModal(this.listenerModal);
      }
    });

    // Обработка отправки формы
    this.listenerForm?.addEventListener("submit", (e) => {
      this.handleFormSubmit(e);
    });

    // Обработка скачивания файла
    this.file1?.addEventListener("click", (e) => {
      this.handleFileDownload(e);
    });

    // Закрытие по ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(this.listenerModal);
      }
    });
  }

  openModal(modal) {
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector(".submit-btn");

    if (!submitBtn) return;

    // Валидация формы
    if (!this.validateForm(form)) {
      alert("Пожалуйста, заполните все обязательные поля правильно.");
      return;
    }

    // Показ состояния загрузки
    this.setLoadingState(submitBtn, true);

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Регистрация успешно отправлена!");
        this.closeModal(this.listenerModal);
        form.reset();
      } else {
        throw new Error("Ошибка отправки формы");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.");
    } finally {
      this.setLoadingState(submitBtn, false);
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        this.highlightInvalidField(field);
      } else {
        this.removeHighlight(field);
      }

      // Специфическая валидация для email
      if (field.type === "email" && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          this.highlightInvalidField(field);
        }
      }

      // Специфическая валидация для телефона
      if (field.type === "tel" && field.value.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(field.value)) {
          isValid = false;
          this.highlightInvalidField(field);
        }
      }
    });

    return isValid;
  }

  highlightInvalidField(field) {
    field.style.borderColor = "#ff4444";
    field.style.boxShadow = "0 0 0 2px rgba(255, 68, 68, 0.2)";
  }

  removeHighlight(field) {
    field.style.borderColor = "";
    field.style.boxShadow = "";
  }

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.classList.add("loading");
      button.textContent = "Отправка...";
    } else {
      button.disabled = false;
      button.classList.remove("loading");
      button.textContent = "Зарегистрироваться";
    }
  }

  handleFileDownload(e) {
    // Можно добавить аналитику или дополнительную логику здесь
    console.log("Начинается скачивание файла требований к оформлению статей");
  }

  initMap() {
    const address = "Рязанский проспект, 99к5, Москва, 109542";
    const mapFrame = document.querySelector(".map iframe");

    if (mapFrame) {
      mapFrame.src = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
        address
      )}&z=16&l=map`;
    }
  }
}

// Инициализация приложения при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  new ConferenceApp();
});
