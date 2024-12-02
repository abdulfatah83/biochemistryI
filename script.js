const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // حجم كل مربع في اللعبة
let score = 0;
const maxScore = 100; // أقصى درجة لتحقيق الفوز

// تحميل الأصوات
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

// موضع الثعبان
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// موضع الطعام
let food = {
    x: Math.floor(Math.random() * 24 + 1) * box,
    y: Math.floor(Math.random() * 24 + 3) * box
};

// تحكم في حركة الثعبان
let d;
document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

// فحص الاصطدام
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// رسم كل شيء على الكانفاس
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? '#FFF' : '#0f0';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // موضع الرأس القديم
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // اتجاه الحركة
    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // إذا أكل الثعبان الطعام
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play();
        food = {
            x: Math.floor(Math.random() * 24 + 1) * box,
            y: Math.floor(Math.random() * 24 + 3) * box
        };
        if (score === maxScore) {
            clearInterval(game);
            ctx.fillStyle = 'white';
            ctx.font = '40px "Press Start 2P"';
            ctx.fillText('You Win!', canvas.width / 4.5, canvas.height / 2);
            document.getElementById('restartBtn').style.display = 'block';
            return;
        }
    } else {
        // إزالة الذيل
        snake.pop();
    }

    // إضافة رأس جديد
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // لعبة تنتهي إذا اصطدم الثعبان بجدار أو بجسمه
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameOverSound.play();
        ctx.fillStyle = 'white';
        ctx.font = '40px "Press Start 2P"';
        ctx.fillText('Game Over', canvas.width / 4.5, canvas.height / 2);
        document.getElementById('restartBtn').style.display = 'block';
    }

    snake.unshift(newHead);

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // الوقت المنقضي بالثواني
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('time').textContent = 'Time: ' + elapsedTime + 's';
}

// تحديث سرعة اللعبة بناءً على الوقت المنقضي
function updateGameSpeed() {
    const elapsedTime = (Date.now() - startTime) / 1000; // الوقت المنقضي بالثواني
    const speed = Math.max(100 - elapsedTime * 2, 50); // تقليل الفاصل الزمني مع مرور الوقت
    clearInterval(game);
    game = setInterval(draw, speed);
}

let startTime = Date.now();
let game = setInterval(draw, 100);
setInterval(updateGameSpeed, 1000); // تحديث سرعة اللعبة كل ثانية

function restartGame() {
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    d = null;
    food = {
        x: Math.floor(Math.random() * 24 + 1) * box,
        y: Math.floor(Math.random() * 24 + 3) * box
    };
    document.getElementById('restartBtn').style.display = 'none';
    startTime = Date.now();
    updateGameSpeed();
}