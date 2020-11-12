const get_meal_btn = document.getElementById('get_meal');
const meal_container = document.getElementById('meal');


get_meal_btn.addEventListener('click', () => {
    showLoader(true);
	fetch('https://www.themealdb.com/api/json/v1/1/random.php')
		.then(res => res.json())
		.then(res => {
			createMeal(res.meals[0]);
		})
		.catch(e => {
			console.warn(e);
        });
});

const favoriteIngredients = []

function getIngredient(event, ingredient) {
	showLoader(true);
	
	const currentIngredientIndex = favoriteIngredients.findIndex(val => val === ingredient)
	if(currentIngredientIndex > -1) favoriteIngredients.splice(currentIngredientIndex, 1)
	else favoriteIngredients.push(ingredient)
	ingredients_panel_container.remove();

	const queryParams = favoriteIngredients.join(",")
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + queryParams).then(result => result.json())
    .then(result =>{
		if(result.meals.length) {
			const randomMeal = result.meals[Math.round(Math.random() * result.meals.length - 1)]
			fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + randomMeal.idMeal).then(res => res.json()).then(meal => {
				createMeal(meal.meals[0])
			})
		}else{
			meal_container.innerHTML = `<h3> There is no meal with those ingridients ! </h3>`;
			showLoader(false);
        }
    })
}

const createMeal = meal => {
    const ingredients = [];

	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			break;
		}
	}

	const newInnerHTML = `
		<div class="row">
			<div class="columns">
				<img src="${meal.strMealThumb}" alt="Meal Image">
				${
					meal.strCategory
						? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
						: ''
				}
				${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
				${
					meal.strTags
						? `<p><strong>Tags:</strong> ${meal.strTags
								.split(',')
								.join(', ')}</p>`
						: ''
				}
				<h4>Ingredients:</h4>
				<ul>
					${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
				</ul>
			</div>
			<div class="columns">
				<h4>${meal.strMeal}</h4>
				<p>${meal.strInstructions}</p>
			</div>
		</div>
		${
			meal.strYoutube
				? `
		<div class="videoColumn">
			<h4>Video Recipe</h4>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
				</iframe>
			</div>
		</div>`
				: ''
		}
	<h5> If you don't like this meal <i onclick="restartApp(event)">click here</i> to reset yor app</h5>
	`;

	showLoader(false);
	meal_container.innerHTML = newInnerHTML;
};

function restartApp(event){
	meal_container.innerHTML = "";
	location.reload();
}

function showLoader(show) {
    let loader;
    if (show) {
      loader = document.createElement("div");
      loader.setAttribute("id", "loader");
      loader.setAttribute("class", "loader");
      document.body.appendChild(loader);
      return;
    }
    loader = document.getElementById("loader");
    loader.remove();
}

const floating_btn = document.querySelector('.floating-btn');
const close_btn = document.querySelector('.close-btn');
const ingredients_panel_container = document.querySelector('.ingredients-panel-container');

floating_btn.addEventListener('click', () => {
ingredients_panel_container.classList.toggle('visible')
});

close_btn.addEventListener('click', () => {
ingredients_panel_container.classList.remove('visible')
});