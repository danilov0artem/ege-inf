document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("taskModal");
  const closeBtn = modal.querySelector(".close");
  const content = document.getElementById("taskContent");

  // При клике на задачу
  document.querySelectorAll(".task-link").forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = link.dataset.id;
      content.innerHTML = "Загрузка...";
      modal.style.display = "block";

      try {
        const res = await fetch(`https://kompege.ru/api/v1/task/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки задачи");
        const data = await res.json();

        content.innerHTML = `
          <h2>${data.comment}</h2>
          <div class="task-text">${data.text}</div>
          <button id="showAnswerBtn">Показать ответ</button>
          <div id="answerBlock" class="hidden">
            <p><strong>Ответ:</strong> ${data.key}</p>
          </div>
        `;

        // Перерисовываем LaTeX формулы с помощью MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([content]);
        }

        // Обработка кнопки "Показать ответ"
        const showAnswerBtn = document.getElementById("showAnswerBtn");
        const answerBlock = document.getElementById("answerBlock");

        showAnswerBtn.addEventListener("click", () => {
          // Переключаем видимость блока с ответом
          answerBlock.classList.toggle("hidden");

          // Меняем текст на кнопке
          showAnswerBtn.textContent = 
            answerBlock.classList.contains("hidden") 
              ? "Показать ответ" 
              : "Скрыть ответ";
        });

      } catch (err) {
        content.innerHTML = `<p style="color:red;">Ошибка: ${err.message}</p>`;
      }
    });
  });

  // Закрытие окна
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
  // Закрытие окна по клавише Esc
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
});