// Правильный порядок картинок (по их исходным номерам)
const CORRECT_ORDER = [1, 2, 3]; // Порядок: 1 → 2 → 3
let currentOrder = [3, 2, 1]; // Начинаем с правильного порядка

// Преобразованные ссылки на Google Drive для прямого доступа
const IMAGE_URLS = [
    "https://i.ibb.co/DHVvHvpt/photo-2025-12-09-17-21-22.jpg", // Картинка 1
    "https://i.ibb.co/V0QZ23wN/photo-2025-12-09-17-21-19.jpg", // Картинка 2
    "https://i.ibb.co/gF376Tpx/photo-2025-12-09-17-21-17.jpg"  // Картинка 3
];

// Альтернативные placeholder-изображения (на случай проблем с Google Drive)
const PLACEHOLDER_URLS = [
    "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Мальчик+лепит+снежный+ком",
    "https://via.placeholder.com/300x200/67B26F/FFFFFF?text=Мальчик+находит+веточки",
    "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Мальчик+надевает+ведро"
];

// Описания для картинок (соответствуют сюжету текста)
const IMAGE_DESCRIPTIONS = [
    "Мальчик лепит снежный ком",
    "Мальчик находит веточки и морковку",
    "Мальчик надевает ведро на снеговика"
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
                
                imageItem.innerHTML = `
                    <div class="image-number">${position + 1}</div>
                    <img id="${imgId}" 
                         src="${IMAGE_URLS[imageIndex - 1]}" 
                         alt="${IMAGE_DESCRIPTIONS[imageIndex - 1]}"
                         data-placeholder="${PLACEHOLDER_URLS[imageIndex - 1]}"
                         loading="lazy">
                    <div class="image-caption">${IMAGE_DESCRIPTIONS[imageIndex - 1]}</div>
                `;
                
                imagesGrid.appendChild(imageItem);
                
                // Добавляем обработчик ошибок для каждой картинки
                const imgElement = document.getElementById(imgId);
                imgElement.onerror = function() {
                    console.warn(`Не удалось загрузить картинку ${imageIndex}. Используем placeholder.`);
                    this.src = this.getAttribute('data-placeholder');
                    this.onerror = null; // Предотвращаем бесконечный цикл
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
            currentOrderText.style.backgroundColor = '#ffffffff';
        } else {
            currentOrderText.style.color = '#000000ff';
            currentOrderText.style.borderColor = '#676767ff';
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
    
    // Дополнительная функция для форматирования ссылок Google Drive
    function formatGoogleDriveUrl(originalUrl) {
        // Если это уже форматированная ссылка, возвращаем как есть
        if (originalUrl.includes('uc?export=view')) {
            return originalUrl;
        }
        
        // Извлекаем ID файла из разных форматов ссылок Google Drive
        let fileId = '';
        
        // Формат 1: https://drive.google.com/file/d/FILE_ID/view
        const match1 = originalUrl.match(/\/d\/([^\/]+)/);
        if (match1) {
            fileId = match1[1];
        }
        
        // Формат 2: https://drive.google.com/open?id=FILE_ID
        const match2 = originalUrl.match(/[?&]id=([^&]+)/);
        if (!fileId && match2) {
            fileId = match2[1];
        }
        
        if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
        
        // Если не удалось извлечь ID, возвращаем оригинальную ссылку
        return originalUrl;
    }
    
    // Проверяем и форматируем ссылки при загрузке
    for (let i = 0; i < IMAGE_URLS.length; i++) {
        IMAGE_URLS[i] = formatGoogleDriveUrl(IMAGE_URLS[i]);
    }
    
    // Для отладки: выводим отформатированные ссылки в консоль
    console.log('Отформатированные ссылки на картинки:', IMAGE_URLS);
});