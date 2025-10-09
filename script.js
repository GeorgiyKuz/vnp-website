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
