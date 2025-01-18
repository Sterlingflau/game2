const storyText = [
    "第一章：神秘的地图\n\n在一个风和日丽的早晨，主角亚历克斯在祖父的阁楼中发现了一张古老的地图。地图上标记着一个传说中的宝藏地点，据说那里藏有无尽的财富和力量。亚历克斯决定踏上这场冒险之旅。",
    "第二章：危险的旅程\n\n亚历克斯的旅程开始于一片茂密的丛林。在这里，他遇到了各种危险的野生动物和自然障碍。与此同时，一个神秘的组织也在追踪这张地图，他们不惜一切代价想要抢夺宝藏。",
    "第三章：敌人的出现\n\n在穿越丛林后，亚历克斯来到了一个废弃的村庄。在这里，他遭遇了神秘组织的成员。经过一场激烈的枪战，亚历克斯成功击退了敌人，但他知道这只是个开始。",
    "第四章：古老的遗迹\n\n亚历克斯终于来到了地图上标记的地点——一座古老的遗迹。遗迹中布满了机关和陷阱，亚历克斯需要运用智慧和勇气才能继续前进。",
    "第五章：最终对决\n\n在遗迹的深处，亚历克斯发现了宝藏的所在地。然而，神秘组织的首领也赶到了这里。经过一场生死攸关的对决，亚历克斯最终战胜了敌人，获得了宝藏。",
    "结局：新的开始\n\n亚历克斯带着宝藏回到了家乡，他决定用这笔财富帮助需要帮助的人。虽然冒险结束了，但亚历克斯知道，新的冒险随时可能开始。"
];

let currentChapter = 0;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let sausageX = 50;
let sausageY = 300;
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let gameInterval;
let enemyInterval;
let gameTime = 60; // 1 minute
let keys = {}; // To track pressed keys
let level = 1; // Start at level 1
let enemySpeed = 1; // Initial enemy speed
const winScore = 50; // Define a score to win the game
let bulletRows = 3; // Start with 3 rows of bullets
let enemiesKilled = 0; // Track number of enemies killed
let levelTime = 0; // Track time spent in current level

function drawSausageMan() {
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.arc(sausageX + 10, sausageY + 10, 10, 0, Math.PI * 2); // Draw a circle
    ctx.fill();
}

function drawBullet(bullet) {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, 5, 5);
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, 20, 20);
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += 5;
        if (bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemySpeed;
        if (enemy.x < 0) {
            enemies.splice(index, 1); // Remove enemy if it goes off screen
        }
        // Check collision with sausage man
        if (enemy.x < sausageX + 20 && enemy.x + 20 > sausageX &&
            enemy.y < sausageY + 20 && enemy.y + 20 > sausageY) { // Adjusted for circle size
            bulletRows--;
            enemies.splice(index, 1); // Remove the enemy that hit
            if (bulletRows <= 0) {
                gameOver = true;
            }
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + 20 && bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 20 && bullet.y + 5 > enemy.y) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score++;
                enemiesKilled++;
                if (enemiesKilled >= 20) { // Check if 20 enemies are killed
                    levelUp();
                }
                if (score % 10 === 0) { // Increase level every 10 points
                    level++;
                    enemySpeed += 0.5; // Increase enemy speed with each level
                    clearInterval(enemyInterval);
                    enemyInterval = setInterval(spawnEnemy, Math.max(1000 - level * 100, 200)); // Decrease spawn interval
                }
            }
        });
    });
}

function spawnEnemy() {
    const enemyY = Math.random() * (canvas.height - 20);
    enemies.push({ x: canvas.width, y: enemyY });
}

function updateSausagePosition() {
    if (keys['ArrowUp'] && sausageY > 0) {
        sausageY -= 2;
    }
    if (keys['ArrowDown'] && sausageY < canvas.height - 20) { // Adjusted for circle size
        sausageY += 2;
    }
    if (keys['ArrowLeft'] && sausageX > 0) {
        sausageX -= 2;
    }
    if (keys['ArrowRight'] && sausageX < canvas.width - 20) { // Adjusted for circle size
        sausageX += 2;
    }
}

function fireBullets() {
    for (let i = 0; i < bulletRows; i++) {
        bullets.push({ x: sausageX + 20, y: sausageY + 25 + i * 10 });
    }
}

function levelUp() {
    level++;
    enemiesKilled = 0;
    levelTime = 0;
    enemySpeed += 0.5;
    bulletRows = 3; // Reset bullet rows
    document.getElementById('story-text').innerText = `Level Up! 现在是等级: ${level}`;
}

function gameLoop() {
    if (gameOver || gameTime <= 0) {
        clearInterval(gameInterval);
        clearInterval(enemyInterval);
        if (score >= winScore) {
            document.getElementById('story-text').innerText = `You Win! 得分: ${score}，等级: ${level}`;
        } else {
            document.getElementById('story-text').innerText = `Game Over! 得分: ${score}，等级: ${level}`;
        }
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateSausagePosition();
    drawSausageMan();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);
    updateBullets();
    updateEnemies();
    checkCollisions();
    levelTime += 0.016; // Increment level time
    if (levelTime >= 20) { // Check if 20 seconds have passed
        levelUp();
    }
    gameTime -= 0.016; // approximately 60 FPS
}

canvas.addEventListener('click', (e) => {
    if (!gameOver) {
        fireBullets();
    }
});

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    // Fire bullets if a non-directional key is pressed
    if (!gameOver && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        fireBullets();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('start-button').addEventListener('click', () => {
    score = 0;
    gameOver = false;
    gameTime = 60;
    bullets = [];
    enemies = [];
    level = 1;
    enemySpeed = 1;
    bulletRows = 3; // Reset bullet rows
    enemiesKilled = 0;
    levelTime = 0;
    document.getElementById('story-text').innerText = "点击画布发射子弹，打中敌人得分！";
    gameInterval = setInterval(gameLoop, 16);
    enemyInterval = setInterval(spawnEnemy, 1000); // Start with a slower spawn rate
}); 