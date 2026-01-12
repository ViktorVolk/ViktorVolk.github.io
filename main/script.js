// Скрипт для интерактивности плиток
document.addEventListener('DOMContentLoaded', function() {
    // Все плитки
    const tiles = document.querySelectorAll('.tile');
    
    // Обработчики кликов по плиткам
    tiles.forEach(tile => {
        tile.addEventListener('click', function(e) {
            e.preventDefault();
            const tileId = this.id;
            const tileTitle = this.querySelector('.tile-title').textContent;
            
            alert(`Вы выбрали: "${tileTitle}"\n\nНа реальном сайте здесь будет переход на соответствующую страницу.`);
            
            // Пример перехода для разных плиток
            switch(tileId) {
                case 'order-tile':
                    // window.location.href = 'order.html';
                    break;
                case 'presentation-tile':
                    // window.location.href = 'presentation.html';
                    break;
                case 'extra-sentence-tile':
                    // window.location.href = 'extra-sentence.html';
                    break;
                case 'split-texts-tile':
                    // window.location.href = 'split-texts.html';
                    break;
                case 'missing-words-tile':
                    // window.location.href = 'missing-words.html';
                    break;
                case 'pictures-description-tile':
                    // window.location.href = 'pictures-description.html';
                    break;
            }
        });
    });
    
    // Добавляем эффект при наведении
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});