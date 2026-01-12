// Скрипт для страницы заданий
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления плиток
    const tiles = document.querySelectorAll('.task-tile');
    
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Функция для начала задания
function startTask(taskNumber) {
    // Здесь можно добавить проверку или предупреждение
    const confirmStart = confirm(`Вы начинаете Задание ${taskNumber}. Перейти к выполнению?`);
    
    if (confirmStart) {
        // В реальном проекте здесь будет переход на страницу задания
        // Например: window.location.href = `task${taskNumber}.html`;
        
        // Временное сообщение для демонстрации
        alert(`Запуск Задания ${taskNumber}\n\nНа реальном сайте здесь будет открываться страница с текстом для анализа.`);
        
        // Можно добавить анимацию перед переходом
        const tile = document.getElementById(`task${taskNumber}-tile`);
        if (tile) {
            tile.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tile.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Функция для возврата на главную
function goToMainPage() {
    window.location.href = 'index.html';
}

// Добавляем обработчики для клавиатуры
document.addEventListener('keydown', function(e) {
    // Ctrl+1, Ctrl+2, Ctrl+3 для быстрого выбора заданий
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                startTask(1);
                break;
            case '2':
                e.preventDefault();
                startTask(2);
                break;
            case '3':
                e.preventDefault();
                startTask(3);
                break;
        }
    }
    
    // Escape для возврата на главную
    if (e.key === 'Escape') {
        goToMainPage();
    }
});