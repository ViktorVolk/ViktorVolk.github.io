// Правильный порядок картинок (по их исходным номерам)
const CORRECT_ORDER = [4, 3, 2, 1]; // Порядок: 1 → 2 → 3 → 4
let currentOrder = [1, 4, 2, 3]; // Начинаем с правильного порядка

// Ссылки на картинки с ImgBB (примерные - замените на свои)
const IMAGE_URLS = [
    "https://i.ibb.co/Nn1xCBS0/photo-2025-12-09-17-29-27.jpg", // Картинка 1 - Покупка продуктов
    "https://i.ibb.co/k6HsXhZ2/photo-2025-12-09-17-29-25.jpg", // Картинка 2 - Чистка яблок
    "https://i.ibb.co/wZrbR2T6/photo-2025-12-09-17-29-23.jpg", // Картинка 3 - Замес теста
    "https://i.ibb.co/7NZ4t2Dy/photo-2025-12-09-17-29-21.jpg"  // Картинка 4 - Выпечка пирога
];

// Альтернативные placeholder-изображения
const PLACEHOLDER_URLS = [
    "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Покупка+продуктов",
    "https://via.placeholder.com/300x200/67B26F/FFFFFF?text=Чистка+яблок",
    "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Замес+теста",
    "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Выпечка+пирога"
];

// Описания для картинок (соответствуют сюжету текста)
const IMAGE_DESCRIPTIONS = [
    "Зима",
    "Осень",
    "Лето",
    "Весна"
];

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const imagesGrid = document.getElementById('images-grid');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-btn');
    const currentOrderText = document.getElementById('current-order-text');
    const resultModal = document.getElementById('result-modal');
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    
    // Загружаем картинки
    loadImages();
    
    // Инициализируем перетаскивание
    let sortable;
    
    // Функция загрузки картинок
    function loadImages() {
        // Показываем состояние загрузки
        imagesGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-text">Загружаем картинки...</p>
            </div>
        `;
        
        // Создаем элементы картинок
        setTimeout(() => {
            imagesGrid.innerHTML = '';
            
            currentOrder.forEach((imageIndex, position) => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.setAttribute('data-index', imageIndex);
                
                // Создаем уникальный ID для каждой картинки
                const imgId = `img-${imageIndex}`;
                
                // Генерируем SVG placeholder на случай ошибки
                const placeholderSVG = generatePlaceholderSVG(imageIndex);
                
                imageItem.innerHTML = `
                    <div class="image-number">${position + 1}</div>
                    <img id="${imgId}" 
                         src="${IMAGE_URLS[imageIndex - 1]}" 
                         alt="${IMAGE_DESCRIPTIONS[imageIndex - 1]}"
                         data-placeholder="${PLACEHOLDER_URLS[imageIndex - 1]}"
                         data-svg-placeholder="${placeholderSVG}"
                         loading="lazy"
                         style="width: 100%; height: 200px; object-fit: cover;">
                    <div class="image-caption">${IMAGE_DESCRIPTIONS[imageIndex - 1]}</div>
                `;
                
                imagesGrid.appendChild(imageItem);
                
                // Добавляем обработчик ошибок для каждой картинки
                const imgElement = document.getElementById(imgId);
                imgElement.onerror = function() {
                    console.warn(`Не удалось загрузить картинку ${imageIndex}. Используем SVG placeholder.`);
                    this.src = this.getAttribute('data-svg-placeholder');
                    this.onerror = null; // Предотвращаем бесконечный цикл
                    this.style.objectFit = 'contain';
                    this.style.backgroundColor = getColorForImage(imageIndex);
                };
                
                // Добавляем обработчик успешной загрузки
                imgElement.onload = function() {
                    console.log(`Картинка ${imageIndex} успешно загружена`);
                };
            });
            
            // Инициализируем Sortable.js после создания элементов
            setTimeout(() => {
                initSortable();
                updateOrderDisplay();
            }, 100);
            
        }, 500); // Небольшая задержка для лучшего UX
    }
    
    // Функция для генерации SVG placeholder
    function generatePlaceholderSVG(index) {
        const colors = ['#4A90E2', '#67B26F', '#FF6B6B', '#FFC107'];
        const color = colors[index - 1] || '#6c757d';
        const text = IMAGE_DESCRIPTIONS[index - 1];
        
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                <rect width="300" height="200" fill="${color}" opacity="0.8"/>
                <rect x="20" y="20" width="260" height="160" fill="white" opacity="0.2" rx="10"/>
                <text x="150" y="80" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
                    Изображение ${index}
                </text>
                <text x="150" y="120" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">
                    ${text}
                </text>
                <circle cx="150" cy="160" r="20" fill="white" opacity="0.3"/>
                <text x="150" y="165" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" font-weight="bold">
                    ${index}
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    }
    
    // Функция для получения цвета для placeholder
    function getColorForImage(index) {
        const colors = ['#4A90E2', '#67B26F', '#FF6B6B', '#FFC107'];
        return colors[index - 1] || '#6c757d';
    }
    
    // Функция инициализации перетаскивания
    function initSortable() {
        sortable = new Sortable(imagesGrid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onStart: function(evt) {
                evt.item.classList.add('dragging');
            },
            onEnd: function(evt) {
                evt.item.classList.remove('dragging');
                updateOrderFromDOM();
            }
        });
    }
    
    // Функция обновления порядка из DOM
    function updateOrderFromDOM() {
        const items = imagesGrid.querySelectorAll('.image-item');
        currentOrder = Array.from(items).map(item => 
            parseInt(item.getAttribute('data-index'))
        );
        
        // Обновляем номера позиций
        items.forEach((item, index) => {
            item.querySelector('.image-number').textContent = index + 1;
        });
        
        updateOrderDisplay();
    }
    
    // Функция обновления отображения порядка
    function updateOrderDisplay() {
        currentOrderText.textContent = currentOrder.join(' → ');
        
        // Меняем цвет в зависимости от правильности
        if (JSON.stringify(currentOrder) === JSON.stringify(CORRECT_ORDER)) {
            currentOrderText.style.color = '#000000ff';
            currentOrderText.style.borderColor = '#000000ff';
            currentOrderText.style.backgroundColor = '#f8fff9';
        } else {
            currentOrderText.style.color = '#000000ff';
            currentOrderText.style.borderColor = '#202224ff';
            currentOrderText.style.backgroundColor = 'white';
        }
    }
    
    // Кнопка сброса
    resetBtn.addEventListener('click', function() {
        currentOrder = [...CORRECT_ORDER];
        
        // Перестраиваем DOM в правильном порядке
        const items = Array.from(imagesGrid.querySelectorAll('.image-item'));
        items.sort((a, b) => {
            const aIndex = parseInt(a.getAttribute('data-index'));
            const bIndex = parseInt(b.getAttribute('data-index'));
            return currentOrder.indexOf(aIndex) - currentOrder.indexOf(bIndex);
        });
        
        // Очищаем и добавляем отсортированные элементы
        imagesGrid.innerHTML = '';
        items.forEach((item, index) => {
            item.querySelector('.image-number').textContent = index + 1;
            imagesGrid.appendChild(item);
        });
        
        // Нужно переинициализировать Sortable после перестройки DOM
        setTimeout(() => {
            if (sortable) {
                sortable.destroy();
            }
            initSortable();
        }, 50);
        
        updateOrderDisplay();
        
        // Анимация сброса
        imagesGrid.classList.add('correct-order');
        setTimeout(() => {
            imagesGrid.classList.remove('correct-order');
        }, 2000);
    });
    
    // Кнопка завершения
    submitBtn.addEventListener('click', function() {
        checkOrder();
    });
    
    // Обработчики для модального окна
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = 'order_task.html';
    });
    
    document.getElementById('retry-btn')?.addEventListener('click', function() {
        closeModal();
        resetBtn.click(); // Сбрасываем к исходному состоянию
    });
    
    document.getElementById('back-to-list-btn2')?.addEventListener('click', function() {
        window.location.href = 'order_task.html';
    });
    
    // Закрытие модального окна при клике вне его
    resultModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && resultModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Функция проверки порядка
    function checkOrder() {
        // Преобразуем в строки для сравнения
        const currentStr = JSON.stringify(currentOrder);
        const correctStr = JSON.stringify(CORRECT_ORDER);
        
        // Показываем модальное окно с результатом
        resultModal.style.display = 'flex';
        
        if (currentStr === correctStr) {
            // Успех
            successModal.style.display = 'block';
            failureModal.style.display = 'none';
            successModal.style.animation = 'modalAppear 0.5s ease';
            
            // Анимация успеха для сетки картинок
            imagesGrid.classList.add('correct-order');
        } else {
            // Неудача
            successModal.style.display = 'none';
            failureModal.style.display = 'block';
            failureModal.style.animation = 'modalAppear 0.5s ease';
            
            // Анимация неудачи для сетки картинок
            imagesGrid.classList.add('incorrect-order');
            setTimeout(() => {
                imagesGrid.classList.remove('incorrect-order');
            }, 500);
        }
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        resultModal.style.display = 'none';
        
        // Убираем анимации
        imagesGrid.classList.remove('correct-order', 'incorrect-order');
    }
    
    // Для отладки
    console.log('Загружаем 4 картинки по ссылкам:', IMAGE_URLS);
    
    // Проверяем, что у нас 4 картинки
    console.log(`Всего картинок: ${IMAGE_URLS.length}`);
    console.log(`Правильный порядок: ${CORRECT_ORDER.join(' → ')}`);
});