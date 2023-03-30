// toggle side nav

$(".menu-open-close").click(function () {
  if ($(".side-nav").css("left") === "-260px") {
    $(".menu-open-close a i").toggleClass("fa-xmark");
    $(".side-nav").animate({ left: "0px" }, 500);
    showTaps();
  } else {
    $(".menu-open-close a i").toggleClass("fa-xmark");
    $(".side-nav").animate({ left: "-260px" }, 500);
    hideTaps();
  }
});

function showTaps() {
  $(".tabs ul li:first-of-type").animate({ top: "0px" }, 500);
  $(".tabs ul li:nth-child(2)").animate({ top: "0px" }, 500);
  $(".tabs ul li:nth-child(3)").animate({ top: "0px" }, 500);
  $(".tabs ul li:nth-child(4)").animate({ top: "0px" }, 500);
  $(".tabs ul li:last-of-type").animate({ top: "0px" }, 500);
}
function hideTaps() {
  $(".tabs ul li:first-of-type").animate({ top: "220px" }, 500);
  $(".tabs ul li:nth-child(2)").animate({ top: "220px" }, 500);
  $(".tabs ul li:nth-child(3)").animate({ top: "220px" }, 500);
  $(".tabs ul li:nth-child(4)").animate({ top: "220px" }, 500);
  $(".tabs ul li:last-of-type").animate({ top: "220px" }, 500);
}

// search

$(".tabs ul li:first-of-type").click(function () {
  $(".container .search").html(`<div class="row justify-content-center">
        <div class="mb-3 col-md-5">
          <input
          onkeyup="SearchByName(this.value)"
            type="text"
            class="form-control bg-transparent text-white"
            id="exampleFormControlInput1"
            placeholder="Search By Name"
          />
        </div>
        <div class="mb-3 col-md-5">
          <input
          onkeyup="SearchByLetter(this.value)"
            type="text"
            maxlength="1"
            class="form-control bg-transparent text-white"
            id="exampleFormControlInput1"
            placeholder="Search By First Letter"
          />
        </div>
      </div>`);
});

async function SearchByName(val) {
  if (val) {
    let data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
    );

    let res = await data.json();

    if (res.meals) {
      if (res.meals.length > 20) {
        res.meals.length = 20;
      }
    }
    display(res.meals);
  }
}

async function SearchByLetter(val) {
  if (val) {
    let data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`
    );

    let res = await data.json();

    if (res.meals) {
      if (res.meals.length > 20) {
        res.meals.length = 20;
      }
    }
    display(res.meals);
  }
}

function display(data) {
  let container = ``;

  if (data) {
    for (let i = 0; i < data.length; i++) {
      container += `
  <div class="col-md-3">
          <div onclick="displayFullMeal(${data[i].idMeal})"  class="product-img rounded-3 overflow-hidden position-relative cursor-pointer">
            <img class="w-100" src="${data[i].strMealThumb}" alt="" />
            <div
              class="w-100 h-100 slide-up p-2 position-absolute z-3 bg-white opacity-75 fs-3 fw-bold d-flex align-items-center"
            >
              ${data[i].strMeal}
            </div>
          </div>
        </div>
  `;
    }
    let row = `<div class="row gy-4">${container}</div>`;
    $(".main-content").html(row);
  } else {
    container = "";
    let row = `<div class="row gy-4">${container}</div>`;
    $(".main-content").html(row);
  }
}

// display full meal

async function displayFullMeal(val) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${val}`
  );

  let res = await data.json();

  $(".main-content").html(`
        <div class="row">
          <div class="col-md-4">
            <img
              class="w-100 rounded-3"
              src="${res.meals[0].strMealThumb}"
              alt="picture"
            />
            <h2 class="text-white">${res.meals[0].strMeal}</h2>
          </div>
          <div class="col-md-8">
            <h2 class="text-white">Instructions</h2>
            <p class="text-white">${res.meals[0].strInstructions}</p>
            <h3 class="text-white">
              <span class="fw-bold">Area</span> : ${res.meals[0].strArea}
            </h3>
            <h3 class="text-white">
              <span class="fw-bold">Category</span> : ${res.meals[0].strCategory}
            </h3>
            <h3 class="text-white">Recipes :</h3>
            <ul class="list-unstyled recipes d-flex g-3 flex-wrap">
            </ul>
            <h3 class="text-white">Tags :</h3>
            <ul class="list-unstyled tags d-flex g-3 flex-wrap">
            </ul>
            <a
              target="_blank"
              href="${res.meals[0].strSource}"
              class="btn btn-success"
              >Source</a
            >
            <a
              target="_blank"
              href="${res.meals[0].strYoutube}"
              class="btn btn-danger"
              >Youtube</a
            >
          </div>
        </div>
      `);
  // to display tags
  if (res.meals[0].strTags) {
    let tags = res.meals[0].strTags.split(",");
    let box = ``;
    for (let i = 0; i < tags.length; i++) {
      box += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
      `;
    }

    $(".tags").html(box);
  }
  // to display recipes
  let recipesValues = Object.values(res.meals[0]);
  let recipes = Object.keys(res.meals[0]);

  let recipesBox = ``;
  for (let i = 0; i < recipes.length; i++) {
    if (
      res.meals[0][`strIngredient${i + 1}`] &&
      res.meals[0][`strMeasure${i + 1}`] &&
      res.meals[0][`strIngredient${i + 1}`] !== " " &&
      res.meals[0][`strMeasure${i + 1}`] !== " "
    ) {
      recipesBox += `
      <li class="alert alert-info m-2 p-1">${
        res.meals[0][`strMeasure${i + 1}`]
      } ${res.meals[0][`strIngredient${i + 1}`]}</li>
     `;
    }
  }
  $(`.recipes`).html(recipesBox);
}

// Categories

$(".tabs ul li:nth-child(2)").click(async function () {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );

  let res = await data.json();

  // console.log(res.categories);

  let categoriesBox = ``;
  for (let i = 0; i < res.categories.length; i++) {
    categoriesBox += `
          <div class="col-sm-6 col-md-4 col-lg-3 ">
            <div onclick="displaycategory ('${res.categories[i].strCategory}')"
              class="product-img rounded-3 overflow-hidden position-relative cursor-pointer"
            >
              <img class="w-100" src="${res.categories[i].strCategoryThumb}" />
              <div
                class="w-100 h-100 slide-up p-2 position-absolute z-3 bg-white text-center opacity-75 fs-3 fw-bold d-flex flex-wrap justify-content-center p-1"
              >
                <h4 class="fs-3 text-black">${res.categories[i].strCategory}</h4>
                <p class="fs-6 fw-normal text-black ">${res.categories[i].strCategoryDescription}</p>
              </div>
            </div>
          </div>
  `;
  }

  let row = `<div class="row gy-4">${categoriesBox}</div>`;
  $(".main-content").html(row);
});

async function displaycategory(val) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${val}`
  );

  let res = await data.json();
  if (res.meals) {
    if (res.meals.length > 20) {
      res.meals.length = 20;
    }
  }

  display(res.meals);
}

// Area

$(".tabs ul li:nth-child(3)").click(async function () {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );

  let res = await data.json();

  console.log(res.meals);

  let areaBox = ``;
  for (let i = 0; i < res.meals.length; i++) {
    areaBox += `
          <div onclick="displayByArea('${res.meals[i].strArea}')" class="col-md-3 text-white justify-content-center text-center cursor-pointer">
            <div><i style="font-size: 60px;" class="fa-solid fa-earth-americas"></i></div>
            <h3>${res.meals[i].strArea}</h3>
          </div>
  `;
  }

  let row = `<div class="row gy-4">${areaBox}</div>`;
  $(".main-content").html(row);
});

async function displayByArea(val) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${val}`
  );

  let res = await data.json();

  console.log(res.meals);
  display(res.meals);
}

// Ingredients

$(".tabs ul li:nth-child(4)").click(async function () {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );

  let res = await data.json();

  res.meals.length = 20;

  console.log(res.meals);

  let Ingredientbox = ``;
  for (let i = 0; i < res.meals.length; i++) {
    Ingredientbox += `
          <div onclick="displaybyIngredient('${
            res.meals[i].strIngredient
          }')" class="col-md-3 text-white justify-content-center text-center cursor-pointer">
            <div><i style="font-size: 60px;" class="fa-solid fa-bowl-food"></i></div>
            <h3>${res.meals[i].strIngredient}</h3>
            <p>${res.meals[i].strDescription.slice(0, 110)}</p>
          </div>
  `;
  }

  let row = `<div class="row gy-4">${Ingredientbox}</div>`;
  $(".main-content").html(row);
});

async function displaybyIngredient(val) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${val}`
  );

  let res = await data.json();
  if (res.meals) {
    if (res.meals.length > 20) {
      res.meals.length = 20;
    }
  }

  display(res.meals);
}

// Contact Us

$(".tabs ul li:last-of-type").click(function (e) {
  $(".main-content").html(`
  <div class="row g-4 justify-content-center vh-100 align-content-center ">
            <div class="col-md-5">
                <input id="nameInput" onkeyup="validation(this)" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-5">
                <input id="emailInput" onkeyup="validation(this)" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-5">
                <input id="phoneInput" onkeyup="validation(this)" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-5">
                <input id="ageInput" onkeyup="validation(this)" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-5">
                <input id="passwordInput" onkeyup="validation(this)" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-5">
                <input id="repasswordInput" onkeyup="validation(this)" type="password" class="form-control " placeholder="Re Enter password">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
            <div class="col-md-12 justify-content-center"></div>
            <button id="submitBtn" class="btn disabled w-auto btn-outline-danger px-2 mt-3">Submit</button>
        </div>

  `);
});


let nameValedate = false;
let phoneValedate = false;
let passValedate = false;
let rePassValedate = false;
let ageValedate = false;
let emailValedate = false;

function validation(e) {
  

  if (e.id === "nameInput") {
    $("#nameAlert").addClass("d-none");

    if (/[a-zA-Z0-9]{1,}$/.test(e.value)) {
      nameValedate = true;
    } else {
      $("#nameAlert").removeClass("d-none");
      nameValedate = false;
    }
  }

  if (e.id === "emailInput") {
    $("#emailAlert").addClass("d-none");

    if (/\w+@\w+\.[a-zA-Z]{2,}$/.test(e.value)) {
      emailValedate = true;
    } else {
      $("#emailAlert").removeClass("d-none");
      emailValedate = false;
    }
  }
  if (e.id === "phoneInput") {
    $("#phoneAlert").addClass("d-none");

    if (/^\d{10,12}$/.test(e.value)) {
      phoneValedate = true;
    } else {
      $("#phoneAlert").removeClass("d-none");
      phoneValedate = true;
    }
  }
  if (e.id === "passwordInput") {
    $("#passwordAlert").addClass("d-none");

    if (/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,}$/.test(e.value)) {
      passValedate = true;
    } else {
      $("#passwordAlert").removeClass("d-none");
      passValedate = true;
    }
  }
  if (e.id === "repasswordInput") {
    if ($("#passwordInput").val() === $("#repasswordInput").val()) {
      $("#repasswordAlert").addClass("d-none");
      rePassValedate = true;
    } else {
      $("#repasswordAlert").removeClass("d-none");
      rePassValedate = false;
    }
  }
  if (e.id === "ageInput") {
    if (+$("#ageInput").val() > 0) {
      $("#ageAlert").addClass("d-none");
      ageValedate = true;
    } else {
      $("#ageAlert").removeClass("d-none");
      ageValedate = false;
    }
  }
  if (
    nameValedate === true &&
    phoneValedate === true &&
    passValedate === true &&
    rePassValedate === true &&
    ageValedate === true &&
    emailValedate === true
  ) {
    $("#submitBtn").removeClass("disabled");
  } else {
    $("#submitBtn").addClass("disabled");
  }
}
