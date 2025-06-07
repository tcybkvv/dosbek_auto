const carsPerPage = 24;
let currentPage = 1;
let currentData = [];
let originalData = [];
let inDollars = false;

const loader = document.querySelector(".loader");

const renderCars = () => {
    const main = document.querySelector(".main");
    main.classList.remove("details-view");
    const container = document.getElementById("cars");
    container.innerHTML = "";
    const start = (currentPage - 1) * carsPerPage;
    const end = start + carsPerPage;
    currentData.slice(start, end).forEach(car => {
        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
            <img src="${car.photos[0]}" alt="${car.name}">
            <h3 class="car-name">${car.name}</h3>
            <p>${formatPrice(car.price)}</p>
        `;
        card.onclick = () => showCarDetails(car);
        container.appendChild(card);
    });
    renderPagination();
    window.scrollTo(0, 0);
};

const renderPagination = () => {
    const pages = Math.ceil(currentData.length / carsPerPage);
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;
        btn.onclick = () => { currentPage = i; renderCars(); };
        pagination.appendChild(btn);
    }
};

const formatPrice = (price) => {
    if (inDollars) {
        const usdPrice = Math.round(price / 87.45);
        return usdPrice.toLocaleString('ru-RU') + ' usd';
    } else {
        return price.toLocaleString('ru-RU') + ' сом';
    }
};

const showCarDetails = (car) => {
    const main = document.querySelector(".main");
    main.classList.add("details-view");
    const container = document.getElementById("cars");
    container.innerHTML = "";
    container.style.display = "block";

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "car-details-container";

    const backButton = document.createElement("button");
    backButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/images/icon-arrow-back.svg" alt="Back icon"> Вернуться`;
    backButton.onclick = () => {
        renderCars();
        container.style.display = "flex";
    };

    const textButton = document.createElement("button");
    textButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/images/icon-text.svg" alt="Text icon"> Написать`;
    textButton.onclick = () => {
        const phoneNumber = "+996502101215";
        const message = encodeURIComponent(`Здравствуйте! Интересует ${car.name} за ${formatPrice(car.price)}.`);
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank");
    };

    const carousel = document.createElement("div");
    carousel.className = "carousel";
    const imagesContainer = document.createElement("div");
    imagesContainer.className = "images";
    car.photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo;
        if (index === 0) img.className = "active";
        imagesContainer.appendChild(img);
    });

    const prevButton = document.createElement("div");
    prevButton.className = "carousel-button prev";
    prevButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/images/icon-left-arrow.svg" alt="leftButton"/>`;

    const nextButton = document.createElement("div");
    nextButton.className = "carousel-button next";
    nextButton.innerHTML = `<img src="https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/images/icon-right-arrow.svg" alt="rightButton"/>`;

    let currentIndex = 0;
    const showNext = () => {
        const images = imagesContainer.querySelectorAll("img");
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
    };
    const showPrev = () => {
        const images = imagesContainer.querySelectorAll("img");
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        images[currentIndex].classList.add("active");
    };
    prevButton.onclick = showPrev;
    nextButton.onclick = showNext;

    carousel.appendChild(prevButton);
    carousel.appendChild(imagesContainer);
    carousel.appendChild(nextButton);
    detailsContainer.appendChild(carousel);

    const details = document.createElement("div");
    details.className = "car-details";
    details.innerHTML = `
        <h2>${car.name}</h2>
        <h3>${formatPrice(car.price)}</h3>
        <p><b>Год выпуска:</b> ${car.year}</p>
        <p><b>Руль:</b> ${car.steering}</p>
        <p><b>Цвет:</b> ${car.color}</p>
        <p><b>Кузов:</b> ${car.body}</p>
        <p><b>Привод:</b> ${car.drive}</p>
        <p><b>Пробег:</b> ${car.mileage} km</p>
        <p><b>Двигатель:</b> ${car.engine}</p>
        <p><b>Состояние:</b> ${car.condition}</p>
    `;
    details.appendChild(textButton);
    details.appendChild(backButton);
    detailsContainer.appendChild(details);

    container.appendChild(detailsContainer);
};

const updateCars = () => {
    const sortValue = sortSelect.value;
    const brandValue = brandSelect.value;
    const priceMin = parseFloat(priceMinInput.value) || 0;
    const priceMax = parseFloat(priceMaxInput.value) || Infinity;

    currentData = originalData.slice();

    if (brandValue !== "all") {
        currentData = currentData.filter(car => car.name.split(" ")[0] === brandValue);
    }

    currentData = currentData.filter(car => {
        const price = inDollars ? Math.round(car.price / 87.45) : car.price;
        return price >= priceMin && price <= priceMax;
    });

    if (sortValue === "asc") {
        currentData.sort((a, b) => a.price - b.price);
    } else if (sortValue === "desc") {
        currentData.sort((a, b) => b.price - a.price);
    } else if (sortValue === "brand-asc") {
        currentData.sort((a, b) => a.name.split(" ")[0].localeCompare(b.name.split(" ")[0]));
    } else if (sortValue === "brand-desc") {
        currentData.sort((a, b) => b.name.split(" ")[0].localeCompare(a.name.split(" ")[0]));
    }

    currentPage = 1;
    renderCars();
};

// Проверка наличия элементов перед установкой обработчиков
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) sortSelect.onchange = updateCars;

const brandSelect = document.getElementById("brandSelect");
if (brandSelect) brandSelect.onchange = updateCars;

const priceMinInput = document.getElementById("priceMin");
if (priceMinInput) priceMinInput.oninput = updateCars;

const priceMaxInput = document.getElementById("priceMax");
if (priceMaxInput) priceMaxInput.oninput = updateCars;

const toggle = document.getElementById("currencyToggle");
if (toggle) toggle.onchange = () => {
    inDollars = toggle.checked;
    updateCars();
};


loader.style.display = "flex";

fetch("https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/data/cars.json")
    .then(res => res.json())
    .then(json => {
        originalData = json.cars.slice();
        currentData = originalData.slice();
        if (document.getElementById("cars")) renderCars();
    })
    .catch(err => console.error("Ошибка загрузки JSON:", err))
    .finally(() => {
        loader.style.display = "none";
    });

// TOGGLE THEME
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', () => {
            document.documentElement.classList.toggle('dark-theme');
            if (document.documentElement.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // BURGER MENU
    const burger = document.querySelector('.menu__burger');
    const nav = document.querySelector('.menu__nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
});

// FOOTER DATE
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();