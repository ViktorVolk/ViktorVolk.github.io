// Данные для задания
const SENTENCES = [
    "Мы с папой отправились в плавание на яркой яхте.",
    "Ветер надувал паруса, и мы летели по волнам.",
    "Сегодня утром за окном всё стало белым и сверкающим.",
    "Это выпал первый пушистый снег!",
    "Вдруг мы увидели, как из воды выпрыгнул дельфин!",
    "Я слепил во дворе маленького снеговика с носом-морковкой.",
    "Он плыл рядом с нами, будто показывая дорогу.",
    "Зима — самое волшебное время года!"
];

// Правильное распределение: 1-й текст - предложения 1,2,7,8 (индексы 0,1,6,7)
// 2-й текст - предложения 3,4,5,6 (индексы 2,3,4,5)
const CORRECT_TEXT1 = [1, 2, 5, 7]; // Номера предложений для текста 1
const CORRECT_TEXT2 = [3, 4, 6, 8]; // Номера предложений для текста 2

// Текущее состояние
let currentDistribution = {
    source: [...Array(SENTENCES.length).keys()].map(i => i + 1), // Все предложения в источнике
    text1: [], // Номера предложений в тексте 1
    text2: []  // Номера предложений в тексте 2
};

// DOM элементы
let sortableSource, sortableText1, sortableText2;

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация элементов
    const sourceContainer = document.getElementById('source-sentences');
    const text1Container = document.getElementById('text1-column');
    const text2Container = document.getElementById('text2-column');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultModal = document.getElementById('result-modal');
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    
    // Загружаем начальное состояние
    loadInitialState();
    
    // Инициализируем перетаскивание
    initSortable();
    
    // Обновляем статистику
    updateStats();
    
    // Обработчики кнопок
    resetBtn.addEventListener('click', resetAll);
    submitBtn.addEventListener('click', checkAnswers);
    
    // Обработчики модального окна
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = '../html/task_split.html';
    });
    
    document.getElementById('retry-btn')?.addEventListener('click', function() {
        closeModal();
        resetAll();
    });
    
    document.getElementById('back-to-list-btn2')?.addEventListener('click', function() {
        window.location.href = '../html/task_split.html';
    });
    
    // Закрытие модального окна
    resultModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && resultModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Функция загрузки начального состояния
    function loadInitialState() {
        // Очищаем контейнеры
        sourceContainer.innerHTML = '';
        text1Container.innerHTML = '';
        text2Container.innerHTML = '';
        
        // Добавляем предложения в источник
        SENTENCES.forEach((sentence, index) => {
            const sentenceNumber = index + 1;
            const sentenceElement = createSentenceElement(sentenceNumber, sentence);
            sourceContainer.appendChild(sentenceElement);
        });
        
        // Обновляем стили контейнеров
        updateContainerStyles();
    }
    
    // Функция создания элемента предложения
    function createSentenceElement(number, text) {
        const div = document.createElement('div');
        div.className = 'sentence-item';
        div.setAttribute('data-number', number);
        
        div.innerHTML = `
            <span class="sentence-number">${number}</span>
            <span class="sentence-text">${text}</span>
        `;
        
        return div;
    }
    
    // Функция инициализации перетаскивания
    function initSortable() {
        const sourceContainer = document.getElementById('source-sentences');
        const text1Container = document.getElementById('text1-column');
        const text2Container = document.getElementById('text2-column');
        
        // Настройки для всех контейнеров
        const sortableOptions = {
            group: {
                name: 'sentences',
                pull: true,
                put: true
            },
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onStart: function(evt) {
                evt.item.classList.add('dragging');
            },
            onEnd: function(evt) {
                evt.item.classList.remove('dragging');
                updateDistribution();
                updateStats();
                updateContainerStyles();
            }
        };
        
        // Инициализация каждого контейнера
        sortableSource = new Sortable(sourceContainer, sortableOptions);
        sortableText1 = new Sortable(text1Container, sortableOptions);
        sortableText2 = new Sortable(text2Container, sortableOptions);
    }
    
    // Функция обновления распределения
    function updateDistribution() {
        const sourceContainer = document.getElementById('source-sentences');
        const text1Container = document.getElementById('text1-column');
        const text2Container = document.getElementById('text2-column');
        
        // Получаем номера предложений из каждого контейнера
        currentDistribution.source = Array.from(sourceContainer.querySelectorAll('.sentence-item'))
            .map(item => parseInt(item.getAttribute('data-number')));
            
        currentDistribution.text1 = Array.from(text1Container.querySelectorAll('.sentence-item'))
            .map(item => parseInt(item.getAttribute('data-number')));
            
        currentDistribution.text2 = Array.from(text2Container.querySelectorAll('.sentence-item'))
            .map(item => parseInt(item.getAttribute('data-number')));
        
        console.log('Текущее распределение:', currentDistribution);
    }
    
    // Функция обновления статистики
    function updateStats() {
        const text1Count = document.getElementById('text1-count');
        const text2Count = document.getElementById('text2-count');
        const totalDistributed = document.getElementById('total-distributed');
        const totalSentences = document.getElementById('total-sentences');
        
        const distributedCount = currentDistribution.text1.length + currentDistribution.text2.length;
        
        text1Count.textContent = `${currentDistribution.text1.length} предложений`;
        text2Count.textContent = `${currentDistribution.text2.length} предложений`;
        totalDistributed.textContent = distributedCount;
        totalSentences.textContent = SENTENCES.length;
        
        // Подсвечиваем, если все распределено
        if (distributedCount === SENTENCES.length) {
            totalDistributed.style.color = '#4CAF50';
            totalDistributed.style.fontWeight = 'bold';
        } else {
            totalDistributed.style.color = '#009688';
            totalDistributed.style.fontWeight = 'normal';
        }
    }
    
    // Функция обновления стилей контейнеров
    function updateContainerStyles() {
        const sourceContainer = document.getElementById('source-sentences');
        const text1Container = document.getElementById('text1-column');
        const text2Container = document.getElementById('text2-column');
        
        // Источник
        if (currentDistribution.source.length === 0) {
            sourceContainer.classList.add('empty');
            sourceContainer.innerHTML = '<p class="source-title">Все предложения распределены. Можете перемещать их между колонками.</p>';
        } else {
            sourceContainer.classList.remove('empty');
        }
        
        // Текст 1
        if (currentDistribution.text1.length === 0) {
            text1Container.classList.add('empty');
        } else {
            text1Container.classList.remove('empty');
        }
        
        // Текст 2
        if (currentDistribution.text2.length === 0) {
            text2Container.classList.add('empty');
        } else {
            text2Container.classList.remove('empty');
        }
    }
    
    // Функция сброса всего
    function resetAll() {
        currentDistribution = {
            source: [...Array(SENTENCES.length).keys()].map(i => i + 1),
            text1: [],
            text2: []
        };
        
        loadInitialState();
        
        // Переинициализируем Sortable
        setTimeout(() => {
            if (sortableSource) sortableSource.destroy();
            if (sortableText1) sortableText1.destroy();
            if (sortableText2) sortableText2.destroy();
            initSortable();
        }, 50);
        
        updateStats();
        updateContainerStyles();
        
        // Анимация сброса
        const containers = [sourceContainer, text1Container, text2Container];
        containers.forEach(container => {
            if (container) {
                container.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    container.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }
    
    // Функция проверки ответов
    function checkAnswers() {
        // Сортируем массивы для сравнения
        const userText1 = [...currentDistribution.text1].sort((a, b) => a - b);
        const userText2 = [...currentDistribution.text2].sort((a, b) => a - b);
        const correctText1 = [...CORRECT_TEXT1].sort((a, b) => a - b);
        const correctText2 = [...CORRECT_TEXT2].sort((a, b) => a - b);
        
        // Проверяем, что все предложения распределены
        if (userText1.length + userText2.length !== SENTENCES.length) {
            alert('Пожалуйста, распределите все предложения!');
            return;
        }
        
        // Сравниваем с правильными ответами
        const isText1Correct = JSON.stringify(userText1) === JSON.stringify(correctText1);
        const isText2Correct = JSON.stringify(userText2) === JSON.stringify(correctText2);
        const isCorrect = isText1Correct && isText2Correct;
        
        // Показываем результат
        showResult(isCorrect, userText1, userText2);
    }
    
    // Функция показа результата
    function showResult(isCorrect, userText1, userText2) {
        const resultModal = document.getElementById('result-modal');
        const successModal = document.getElementById('success-modal');
        const failureModal = document.getElementById('failure-modal');
        
        resultModal.style.display = 'flex';
        
        if (isCorrect) {
            successModal.style.display = 'block';
            failureModal.style.display = 'none';
            successModal.style.animation = 'modalAppear 0.5s ease';
            
            // Анимация успеха для колонок
            const text1Container = document.getElementById('text1-column');
            const text2Container = document.getElementById('text2-column');
            
            text1Container.classList.add('success-animation');
            text2Container.classList.add('success-animation');
            
            // Добавляем стили для анимации
            const style = document.createElement('style');
            style.textContent = `
                .success-animation {
                    animation: pulseSuccess 2s ease-in-out;
                    border-color: #4CAF50 !important;
                }
                
                @keyframes pulseSuccess {
                    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
            `;
            document.head.appendChild(style);
            
        } else {
            successModal.style.display = 'none';
            failureModal.style.display = 'block';
            failureModal.style.animation = 'modalAppear 0.5s ease';
            
            // Подсвечиваем правильные и неправильные предложения
            highlightAnswers(userText1, userText2);
        }
    }
    
    // Функция подсветки ответов
    function highlightAnswers(userText1, userText2) {
        // Подсвечиваем предложения в тексте 1
        const text1Container = document.getElementById('text1-column');
        const text1Items = text1Container.querySelectorAll('.sentence-item');
        
        text1Items.forEach(item => {
            const number = parseInt(item.getAttribute('data-number'));
            if (CORRECT_TEXT1.includes(number)) {
                // Правильное предложение
                item.style.borderColor = '#4CAF50';
                item.style.backgroundColor = '#e8f5e9';
                item.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.3)';
            } else {
                // Неправильное предложение
                item.style.borderColor = '#f44336';
                item.style.backgroundColor = '#ffebee';
                item.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.3)';
            }
        });
        
        // Подсвечиваем предложения в тексте 2
        const text2Container = document.getElementById('text2-column');
        const text2Items = text2Container.querySelectorAll('.sentence-item');
        
        text2Items.forEach(item => {
            const number = parseInt(item.getAttribute('data-number'));
            if (CORRECT_TEXT2.includes(number)) {
                // Правильное предложение
                item.style.borderColor = '#4CAF50';
                item.style.backgroundColor = '#e8f5e9';
                item.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.3)';
            } else {
                // Неправильное предложение
                item.style.borderColor = '#f44336';
                item.style.backgroundColor = '#ffebee';
                item.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.3)';
            }
        });
        
        // Подсвечиваем пропущенные правильные предложения (если они еще в источнике)
        const sourceContainer = document.getElementById('source-sentences');
        const sourceItems = sourceContainer.querySelectorAll('.sentence-item');
        
        sourceItems.forEach(item => {
            const number = parseInt(item.getAttribute('data-number'));
            if (CORRECT_TEXT1.includes(number) || CORRECT_TEXT2.includes(number)) {
                // Пропущенное правильное предложение
                item.style.borderColor = '#FF9800';
                item.style.backgroundColor = '#fff3e0';
                item.style.boxShadow = '0 0 0 2px rgba(255, 152, 0, 0.3)';
                item.style.animation = 'pulseMissing 2s infinite';
            }
        });
        
        // Добавляем стили для анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulseMissing {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        const resultModal = document.getElementById('result-modal');
        resultModal.style.display = 'none';
        
        // Убираем все подсветки
        const allItems = document.querySelectorAll('.sentence-item');
        allItems.forEach(item => {
            item.style.borderColor = '';
            item.style.backgroundColor = '';
            item.style.boxShadow = '';
            item.style.animation = '';
        });
        
        // Убираем анимации с контейнеров
        const text1Container = document.getElementById('text1-column');
        const text2Container = document.getElementById('text2-column');
        
        if (text1Container) text1Container.classList.remove('success-animation');
        if (text2Container) text2Container.classList.remove('success-animation');
    }
    
    // Для отладки
    console.log('Всего предложений:', SENTENCES.length);
    console.log('Правильный текст 1:', CORRECT_TEXT1);
    console.log('Правильный текст 2:', CORRECT_TEXT2);
});