// Правильные ответы для задания 3 (номера лишних предложений)
const CORRECT_ANSWERS = [8, 9]; // Номера 8 и 9
let selectedNumbers = [];

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const numberItems = document.querySelectorAll('.number-item');
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    const selectedCount = document.getElementById('selected-count');
    const resultModal = document.getElementById('result-modal');
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    
    // Обработчики для номеров
    numberItems.forEach(item => {
        item.addEventListener('click', function() {
            const number = parseInt(this.getAttribute('data-number'));
            
            if (selectedNumbers.includes(number)) {
                // Удаляем, если уже выбран
                selectedNumbers = selectedNumbers.filter(n => n !== number);
                this.classList.remove('selected');
            } else {
                // Добавляем, если не выбран
                selectedNumbers.push(number);
                this.classList.add('selected');
            }
            
            // Обновляем счетчик
            updateSelectedCount();
        });
    });
    
    // Кнопка очистки
    clearBtn.addEventListener('click', function() {
        selectedNumbers = [];
        numberItems.forEach(item => {
            item.classList.remove('selected');
        });
        updateSelectedCount();
    });
    
    // Кнопка завершения
    submitBtn.addEventListener('click', function() {
        checkAnswers();
    });
    
    // Кнопки в модальном окне
    document.getElementById('next-task-btn')?.addEventListener('click', function() {
        alert('Вы успешно прошли все задания раздела "Найди лишнее предложение"!');
        window.location.href = 'extra-sentence.html';
    });
    
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = 'extra-sentence.html';
    });
    
    document.getElementById('retry-btn')?.addEventListener('click', function() {
        closeModal();
        selectedNumbers = [];
        numberItems.forEach(item => {
            item.classList.remove('selected');
        });
        updateSelectedCount();
    });
    
    document.getElementById('back-to-list-btn2')?.addEventListener('click', function() {
        window.location.href = 'extra-sentence.html';
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
    
    // Функция обновления счетчика выбранных
    function updateSelectedCount() {
        selectedCount.textContent = selectedNumbers.length;
        
        // Меняем цвет в зависимости от количества выбранных
        if (selectedNumbers.length === 0) {
            selectedCount.style.color = '#9D4EDD';
        } else if (selectedNumbers.length === CORRECT_ANSWERS.length) {
            selectedCount.style.color = '#6f42c1';
        } else {
            selectedCount.style.color = '#ffc107';
        }
    }
    
    // Функция проверки ответов
    function checkAnswers() {
        // Сортируем выбранные номера для сравнения
        const sortedSelected = [...selectedNumbers].sort((a, b) => a - b);
        const sortedCorrect = [...CORRECT_ANSWERS].sort((a, b) => a - b);
        
        // Преобразуем в строки для сравнения
        const selectedStr = JSON.stringify(sortedSelected);
        const correctStr = JSON.stringify(sortedCorrect);
        
        // Показываем модальное окно с результатом
        resultModal.style.display = 'flex';
        
        if (selectedStr === correctStr) {
            // Успех - выбраны именно 8 и 9
            successModal.style.display = 'block';
            failureModal.style.display = 'none';
            
            // Анимация успеха
            successModal.style.animation = 'modalAppear 0.5s ease';
        } else {
            // Неудача
            successModal.style.display = 'none';
            failureModal.style.display = 'block';
            
            // Анимация неудачи
            failureModal.style.animation = 'modalAppear 0.5s ease';
            
            // Подсвечиваем правильные ответы
            numberItems.forEach(item => {
                const num = parseInt(item.getAttribute('data-number'));
                if (CORRECT_ANSWERS.includes(num) && !selectedNumbers.includes(num)) {
                    item.classList.add('correct-missing');
                }
            });
        }
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        resultModal.style.display = 'none';
        
        // Убираем подсветку правильных ответов
        numberItems.forEach(item => {
            item.classList.remove('correct-missing');
        });
    }
    
    // Инициализация
    updateSelectedCount();
    
    // Добавляем стили для подсветки пропущенных правильных ответов
    const style = document.createElement('style');
    style.textContent = `
        .correct-missing {
            animation: pulseMissing 2s infinite;
            border: 2px solid #6f42c1 !important;
            background: #f5f0ff !important;
        }
        
        @keyframes pulseMissing {
            0% { box-shadow: 0 0 0 0 rgba(111, 66, 193, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(111, 66, 193, 0); }
            100% { box-shadow: 0 0 0 0 rgba(111, 66, 193, 0); }
        }
    `;
    document.head.appendChild(style);
});