const speakerBtn = document.getElementById("speaker-btn");
const listenerBtn = document.getElementById("listener-btn");
const listenerModal = document.getElementById("listener-modal");
const closeListenerModal = document.getElementById("close-listener-modal");
const listenerForm = document.getElementById("listener-form");
const razuLink = document.getElementById("razu-link");
const file1 = document.getElementById("file1");
const privacyLink = document.getElementById("privacy-link");

listenerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  listenerModal.style.display = "flex";
});

closeListenerModal.addEventListener("click", function () {
  listenerModal.style.display = "none";
});

// Обработка отправки формы
listenerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Показываем пользователю, что идет отправка
  const submitBtn = this.querySelector(".submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Отправка...";
  submitBtn.disabled = true;

  try {
    const formData = new FormData(this);

    // Отправка через Fetch API
    const response = await fetch(this.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      alert("Регистрация успешно отправлена!");
      listenerModal.style.display = "none";
      this.reset(); // Очищаем форму
    } else {
      throw new Error("Ошибка отправки формы");
    }
  } catch (error) {
    alert("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.");
    console.error("Error:", error);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Остальной код остается без изменений
razuLink.addEventListener("click", function () {
  // Теперь это обычная ссылка, алерт не нужен.
});

file1.addEventListener("click", function (e) {
  alert("Начинается скачивание файла.");
});

speakerBtn.addEventListener("click", function (e) {
  // Кнопка ведет на внешний сайт
});
