// Правильный ответ (номер картинки)
const CORRECT_ANSWER = 2; // Например, картинка номер 2 - белка
let selectedImage = null;

// Ссылки на картинки с ImgBB (примерные - замените на свои)
const IMAGE_URLS = [
    "https://i.ibb.co/qYPZn3CM/image.jpg", // Картинка 1
    "https://i.ibb.co/rG6LPXGs/image.jpg", // Картинка 2
    "https://i.ibb.co/XZG72nkB/image.jpg",  // Картинка 3
    "https://i.ibb.co/vvVhnp99/image.jpg"  // Картинка 3
];

// Альтернативные placeholder-изображения
const PLACEHOLDER_URLS = [
    "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Лиса",
    "https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Белка",
    "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Заяц",
    "https://via.placeholder.com/300x200/795548/FFFFFF?text=Медведь"
];

// Описания для картинок
const IMAGE_DESCRIPTIONS = [
    "Лиса",
    "Белка",
    "Заяц",
    "Волк"
];

// Названия животных для подсказки
const ANIMAL_NAMES = ["Лисица", "Белка", "Заяц", "Медведь"];

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const imagesGrid = document.getElementById('images-grid');
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    const selectedCount = document.getElementById('selected-count');
    const resultModal = document.getElementById('result-modal');
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    
    // Загружаем картинки
    loadImages();
    
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
            
            IMAGE_URLS.forEach((url, index) => {
                const imageIndex = index + 1;
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.setAttribute('data-index', imageIndex);
                
                // Генерируем SVG placeholder на случай ошибки
                const placeholderSVG = generatePlaceholderSVG(imageIndex);
                
                imageItem.innerHTML = `
                    <div class="checkmark">
                        <i class="fas fa-check"></i>
                    </div>
                    <img src="${url}" 
                         alt="${IMAGE_DESCRIPTIONS[index]}"
                         data-placeholder="${PLACEHOLDER_URLS[index]}"
                         data-svg-placeholder="${placeholderSVG}"
                         loading="lazy"
                         style="width: 100%; height: 180px; object-fit: cover;">
                    <div class="image-caption">${IMAGE_DESCRIPTIONS[index]}</div>
                `;
                
                imagesGrid.appendChild(imageItem);
                
                // Добавляем обработчик ошибок для каждой картинки
                const imgElement = imageItem.querySelector('img');
                imgElement.onerror = function() {
                    console.warn(`Не удалось загрузить картинку ${imageIndex}. Используем SVG placeholder.`);
                    this.src = this.getAttribute('data-svg-placeholder');
                    this.onerror = null;
                    this.style.objectFit = 'contain';
                    this.style.backgroundColor = getColorForImage(imageIndex);
                };
                
                // Добавляем обработчик клика
                imageItem.addEventListener('click', function() {
                    selectImage(imageIndex);
                });
            });
            
            updateSelectedCount();
            
        }, 500);
    }
    
    // Функция для генерации SVG placeholder
    function generatePlaceholderSVG(index) {
        const colors = ['#FF9800', '#9C27B0', '#4CAF50', '#795548'];
        const color = colors[index - 1] || '#6c757d';
        const animal = ANIMAL_NAMES[index - 1] || `Животное ${index}`;
        
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                <rect width="300" height="200" fill="${color}" opacity="0.8"/>
                <rect x="20" y="20" width="260" height="160" fill="white" opacity="0.2" rx="10"/>
                <text x="150" y="80" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
                    ${animal}
                </text>
                <text x="150" y="120" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">
                    Картинка ${index}
                </text>
                <circle cx="150" cy="160" r="25" fill="white" opacity="0.3"/>
                <text x="150" y="165" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" font-weight="bold">
                    ${index}
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    }
    
    // Функция для получения цвета для placeholder
    function getColorForImage(index) {
        const colors = ['#FF9800', '#9C27B0', '#4CAF50', '#795548'];
        return colors[index - 1] || '#6c757d';
    }
    
    // Функция выбора картинки
    function selectImage(imageIndex) {
        // Если кликаем на уже выбранную картинку - снимаем выбор
        if (selectedImage === imageIndex) {
            selectedImage = null;
        } else {
            selectedImage = imageIndex;
        }
        
        // Обновляем визуальное состояние всех картинок
        const imageItems = document.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            if (itemIndex === selectedImage) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        updateSelectedCount();
        updateSubmitButton();
    }
    
    // Функция обновления счетчика выбранных
    function updateSelectedCount() {
        selectedCount.textContent = selectedImage ? 1 : 0;
        
        // Меняем цвет в зависимости от выбора
        if (selectedImage) {
            selectedCount.style.color = '#9C27B0';
            selectedCount.style.borderColor = '#9C27B0';
            selectedCount.style.backgroundColor = '#f3e5f5';
        } else {
            selectedCount.style.color = '#6c757d';
            selectedCount.style.borderColor = '#6c757d';
            selectedCount.style.backgroundColor = 'white';
        }
    }
    
    // Функция обновления состояния кнопки отправки
    function updateSubmitButton() {
        if (selectedImage) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
    
    // Кнопка очистки выбора
    clearBtn.addEventListener('click', function() {
        selectedImage = null;
        
        // Снимаем выделение со всех картинок
        const imageItems = document.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        updateSelectedCount();
        updateSubmitButton();
    });
    
    // Кнопка завершения
    submitBtn.addEventListener('click', function() {
        checkAnswer();
    });
    
    // Обработчики для модального окна
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = 'task_select.html';
    });
    
    document.getElementById('retry-btn')?.addEventListener('click', function() {
        closeModal();
        clearBtn.click(); // Сбрасываем выбор
    });
    
    document.getElementById('back-to-list-btn2')?.addEventListener('click', function() {
        window.location.href = 'task_select.html';
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
    
    // Функция проверки ответа
    function checkAnswer() {
        // Показываем модальное окно с результатом
        resultModal.style.display = 'flex';
        
        if (selectedImage === CORRECT_ANSWER) {
            // Успех
            successModal.style.display = 'block';
            failureModal.style.display = 'none';
            successModal.style.animation = 'modalAppear 0.5s ease';
            
            // Анимация успеха для выбранной картинки
            const selectedItem = document.querySelector(`.image-item[data-index="${selectedImage}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
                selectedItem.style.animation = 'pulseSelected 2s infinite';
            }
        } else {
            // Неудача
            successModal.style.display = 'none';
            failureModal.style.display = 'block';
            failureModal.style.animation = 'modalAppear 0.5s ease';
            
            // Подсвечиваем правильный ответ
            const correctItem = document.querySelector(`.image-item[data-index="${CORRECT_ANSWER}"]`);
            if (correctItem) {
                correctItem.classList.add('correct-highlight');
                
                // Анимация для правильного ответа
                correctItem.style.animation = 'pulseSelected 2s infinite';
                correctItem.style.borderColor = '#4CAF50';
                correctItem.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
            }
            
            // Анимация для неправильного ответа (если выбран)
            if (selectedImage) {
                const wrongItem = document.querySelector(`.image-item[data-index="${selectedImage}"]`);
                if (wrongItem) {
                    wrongItem.classList.add('wrong-highlight');
                    wrongItem.style.borderColor = '#f44336';
                }
            }
        }
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        resultModal.style.display = 'none';
        
        // Убираем все дополнительные стили
        const imageItems = document.querySelectorAll('.image-item');
        imageItems.forEach(item => {
            item.classList.remove('correct-highlight', 'wrong-highlight');
            item.style.animation = '';
            item.style.borderColor = '';
            item.style.boxShadow = '';
        });
        
        // Восстанавливаем стиль выбранной картинки
        if (selectedImage) {
            const selectedItem = document.querySelector(`.image-item[data-index="${selectedImage}"]`);
            if (selectedItem) {
                selectedItem.style.animation = 'pulseSelected 2s infinite';
                selectedItem.style.borderColor = '#9C27B0';
            }
        }
    }
    
    // Для отладки
    console.log('Загружаем картинки животных:', IMAGE_URLS);
    console.log(`Правильный ответ: картинка номер ${CORRECT_ANSWER} (${IMAGE_DESCRIPTIONS[CORRECT_ANSWER - 1]})`);
    
    // Инициализация
    updateSubmitButton();
});