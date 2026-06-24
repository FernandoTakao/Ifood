const mealInput = document.getElementById("mealInput");
const searchButton = document.getElementById("searchMeal");

const popup = document.getElementById("popupReceita");
const fechar = document.querySelector(".fechar");

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const mealName = mealInput.value.trim();

  if (!mealName) {
    alert("Digite o nome de uma receita.");
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
    true
  );

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      if (!data.meals) {
        alert("Receita não encontrada.");
        return;
      }

      const popupConteudo = document.querySelector(".popup-conteudo");

      popupConteudo.innerHTML = `
        <span class="fechar">&times;</span>
        <h2>Escolha sua refeição</h2>

        <div id="mealsContainer" class="meals-container"></div>
      `;

      const mealsContainer =
        document.getElementById("mealsContainer");

      data.meals.forEach((meal) => {
        const card = document.createElement("div");

        card.classList.add("meal-card");

        card.innerHTML = `
          <img
            src="${meal.strMealThumb}"
            alt="${meal.strMeal}"
            class="meal-card-image"
          >

          <h3>${meal.strMeal}</h3>

          <button class="meal-card-button">
            Fazer Pedido
          </button>
        `;

        card
          .querySelector(".meal-card-button")
          .addEventListener("click", () => {
            alert(`Pedido realizado: ${meal.strMeal}`);
          });

        mealsContainer.appendChild(card);
      });

      popup.style.display = "flex";

      document
        .querySelector(".fechar")
        .addEventListener("click", () => {
          popup.style.display = "none";
        });
    } else {
      alert("Erro ao consultar a API.");
    }
  };

  xhr.onerror = function () {
    alert("Erro de conexão.");
  };

  xhr.send();
});

popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

mealInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});