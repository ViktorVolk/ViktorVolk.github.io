// Данные для задания 3
const wordsData = [
    { id: 'зима', text: 'зима' },
    { id: 'снег', text: 'снег' },
    { id: 'одеялом', text: 'одеялом' },
    { id: 'снежных', text: 'снежных' },
    { id: 'крышах', text: 'крышах' },
    { id: 'двор', text: 'двор' },
    { id: 'снежки', text: 'снежки' },
    { id: 'снежную', text: 'снежную' },
    { id: 'носа', text: 'носа' },
    { id: 'красные', text: 'красные' },
    { id: 'замечали', text: 'замечали' },
    { id: 'чай', text: 'чай' },
    { id: 'малиновым', text: 'малиновым' },
    { id: 'окна', text: 'окна' },
    { id: 'снежинки', text: 'снежинки' },
    { id: 'лучший', text: 'лучший' },
    { id: 'зимы', text: 'зимы' }
];

// Текущее состояние
let filledGaps = {};
let draggedWord = null;

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const wordsPool = document.getElementById('words-pool');
    const gaps = document.querySelectorAll('.gap');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-btn');
    const filledCount = document.getElementById('filled-count');
    const totalGaps = document.getElementById('total-gaps');
    const progressFill = document.getElementById('progress-fill');
    const resultModal = document.getElementById('result-modal');
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    const errorDetails = document.getElementById('error-details');

    // Инициализация
    totalGaps.textContent = gaps.length;
    updateProgress();
    
    // Создаем слова в пуле
    createWordItems();
    
    // Обработчики событий для слов
    setupWordDragAndDrop();
    
    // Обработчики для пропусков
    setupGapDropZones();
    
    // Кнопка сброса
    resetBtn.addEventListener('click', resetGame);
    
    // Кнопка проверки
    submitBtn.addEventListener('click', checkAnswers);
    
    // Кнопки в модальном окне
    document.getElementById('next-task-btn')?.addEventListener('click', function() {
        alert('Вы успешно прошли все задания раздела "Вставьте пропущенные слова"!');
        window.location.href = 'missing-words.html';
    });
    
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = 'missing-words.html';
    });
    
    document.getElementById('retry-btn')?.addEventListener('click', function() {
        closeModal();
        resetGame();
    });
    
    document.getElementById('back-to-list-btn2')?.addEventListener('click', function() {
        window.location.href = 'missing-words.html';
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

    // Функции
    function createWordItems() {
        // Перемешиваем слова
        const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);
        
        shuffledWords.forEach(wordData => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.textContent = wordData.text;
            wordElement.setAttribute('data-word', wordData.id);
            wordElement.setAttribute('draggable', 'true');
            wordElement.setAttribute('id', `word-${wordData.id}`);
            
            wordsPool.appendChild(wordElement);
        });
    }
    
    function setupWordDragAndDrop() {
        const wordItems = document.querySelectorAll('.word-item');
        
        wordItems.forEach(word => {
            word.addEventListener('dragstart', handleDragStart);
            word.addEventListener('dragend', handleDragEnd);
        });
    }
    
    function handleDragStart(e) {
        if (this.classList.contains('used')) {
            e.preventDefault();
            return;
        }
        
        draggedWord = this;
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.getAttribute('data-word'));
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedWord = null;
    }
    
    function setupGapDropZones() {
        gaps.forEach(gap => {
            gap.addEventListener('dragover', handleDragOver);
            gap.addEventListener('dragenter', handleDragEnter);
            gap.addEventListener('dragleave', handleDragLeave);
            gap.addEventListener('drop', handleDrop);
            
            // Клик для удаления слова из пропуска
            gap.addEventListener('click', function(e) {
                if (this.classList.contains('filled')) {
                    removeWordFromGap(this);
                }
            });
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }
    
    function handleDragLeave() {
        this.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const wordId = e.dataTransfer.getData('text/plain');
        const wordElement = document.getElementById(`word-${wordId}`);
        
        if (!wordElement || wordElement.classList.contains('used')) {
            return;
        }
        
        // Проверяем, не заполнен ли уже этот пропуск
        if (this.classList.contains('filled')) {
            return;
        }
        
        // Заполняем пропуск
        fillGap(this, wordId, wordElement.textContent);
        
        // Помечаем слово как использованное
        wordElement.classList.add('used');
        
        // Сохраняем состояние
        filledGaps[this.getAttribute('data-id')] = wordId;
        
        // Обновляем прогресс
        updateProgress();
    }
    
    function fillGap(gapElement, wordId, wordText) {
        gapElement.textContent = wordText;
        gapElement.classList.add('filled');
        gapElement.setAttribute('data-filled', wordId);
    }
    
    function removeWordFromGap(gapElement) {
        const wordId = gapElement.getAttribute('data-filled');
        const wordElement = document.getElementById(`word-${wordId}`);
        
        if (wordElement) {
            wordElement.classList.remove('used');
        }
        
        gapElement.textContent = '______';
        gapElement.classList.remove('filled');
        gapElement.removeAttribute('data-filled');
        
        // Удаляем из состояния
        delete filledGaps[gapElement.getAttribute('data-id')];
        
        // Обновляем прогресс
        updateProgress();
    }
    
    function updateProgress() {
        const filled = Object.keys(filledGaps).length;
        const total = gaps.length;
        const percentage = (filled / total) * 100;
        
        filledCount.textContent = filled;
        progressFill.style.width = `${percentage}%`;
        
        // Меняем цвет прогресс-бара
        if (percentage === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #28a745 0%, #20c997 100%)';
        } else if (percentage >= 50) {
            progressFill.style.background = 'linear-gradient(90deg, #ffc107 0%, #ffd54f 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #FFD166 0%, #FFE08A 100%)';
        }
    }
    
    function resetGame() {
        // Очищаем пропуски
        gaps.forEach(gap => {
            gap.textContent = '______';
            gap.classList.remove('filled', 'correct', 'incorrect');
            gap.removeAttribute('data-filled');
        });
        
        // Возвращаем слова в пул
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach(word => {
            word.classList.remove('used');
        });
        
        // Очищаем состояние
        filledGaps = {};
        
        // Обновляем прогресс
        updateProgress();
        
        // Убираем подсветку ошибок
        gaps.forEach(gap => {
            gap.classList.remove('correct', 'incorrect');
        });
    }
    
    function checkAnswers() {
        let correctCount = 0;
        const total = gaps.length;
        
        // Проверяем каждый пропуск
        gaps.forEach(gap => {
            const gapId = gap.getAttribute('data-id');
            const filledWord = gap.getAttribute('data-filled');
            const correctWord = gap.getAttribute('data-correct');
            
            if (filledWord === correctWord) {
                gap.classList.add('correct');
                gap.classList.remove('incorrect');
                correctCount++;
            } else if (filledWord) {
                gap.classList.add('incorrect');
                gap.classList.remove('correct');
            } else {
                gap.classList.remove('correct', 'incorrect');
            }
        });
        
        // Показываем результат
        resultModal.style.display = 'flex';
        
        if (correctCount === total) {
            // Все правильно
            successModal.style.display = 'block';
            failureModal.style.display = 'none';
            successModal.style.animation = 'modalAppear 0.5s ease';
        } else {
            // Есть ошибки
            successModal.style.display = 'none';
            failureModal.style.display = 'block';
            failureModal.style.animation = 'modalAppear 0.5s ease';
            
            const errors = total - correctCount;
            errorDetails.textContent = `Правильно заполнено: ${correctCount} из ${total} пропусков. Попробуйте еще раз!`;
        }
    }
    
    function closeModal() {
        resultModal.style.display = 'none';
        
        // Убираем подсветку
        gaps.forEach(gap => {
            gap.classList.remove('correct', 'incorrect');
        });
    }
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        .word-item {
            transition: all 0.3s ease;
        }
        
        .gap {
            transition: all 0.3s ease;
        }
        
        @keyframes pulseCorrect {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        
        @keyframes pulseIncorrect {
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
        }
        
        .gap.correct {
            animation: pulseCorrect 2s;
        }
        
        .gap.incorrect {
            animation: pulseIncorrect 2s;
        }
    `;
    document.head.appendChild(style);
});