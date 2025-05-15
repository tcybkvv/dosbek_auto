const jsonUrl = 'https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/data/info.json'

const loader = document.getElementById('loader');
const container = document.getElementById('container');

loader.style.display = 'block';

fetch(jsonUrl)
    .then(res => res.json())
    .then(data => {
        container.innerHTML = '';

        data.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.description}</p>
                <div class="tags">${post.tags.join(', ')}</div>
                <small>Создано: ${new Date(post.created_at).toLocaleDateString()}</small>
            `;

            container.appendChild(card);
        });

        loader.style.display = 'none';
    })
    .catch(error => {
        container.innerText = 'Ошибка загрузки данных: ' + error;
        loader.style.display = 'none';
    });
