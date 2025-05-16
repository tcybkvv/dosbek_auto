const jsonUrl = 'https://raw.githubusercontent.com/tcybkvv/dosbek_data/refs/heads/main/data/info.json'

fetch(jsonUrl)
    .then(res => res.json())
    .then(data => {
        const container = document.querySelector('#main__container');
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
    })
    .catch(error => {
        document.getElementById('container').innerText = 'Ошибка загрузки данных: ' + error;
    });
