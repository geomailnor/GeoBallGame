const canvas = document.getElementById("gameCanvas");
const button = document.getElementById("button");
const restartButton = document.getElementById("restartButton");
const infoBar = document.getElementById("infoBar");
const ctx = canvas.getContext("2d");
let brVragove = 3;
const BR_TOPKI = 50;
let broiki = BR_TOPKI;
// Масив за топките
let balls = [];
let playerBall = null;
let speed = 3;
let isPaused = false, spacePressed = false;
let chocar = false; // Използва се за рестартиране на играта, след сблъсък.
let btnStartPressed = false;
const katasSound = new Audio("sounds/explosion.wav");
const pobedaSound = new Audio("sounds/snakeBonus.wav");
let posoka = "i";
// Масив за противниците
let enemies = [];
let points = 0;
canvResized = false;
let broyach = 0;
let zakacheni = 0;
let fin = false;
let brFin = 0;
let enemiSkor1 = 0.5, enemiSkor2 = 1.5;
// Функция за запазване на избраната трудност в sessionStorage
//Тя се извиква по късно от button_click
const saveDifficulty = () => {
    const selected = document.querySelector('input[name="trudnost"]:checked'); // Избира избрания радио бутон
    if (selected) {
        sessionStorage.setItem('difficulty', selected.id); // Запазва ID на избраната трудност
    }
};
// Функция за зареждане на избраната трудност при зареждане на страницата
const loadDifficulty = () => {
    const savedDifficulty = sessionStorage.getItem('difficulty'); // Проверява дали има запазена стойност
    if (savedDifficulty) {
        const savedRadio = document.getElementById(savedDifficulty);
        if (savedRadio) {
            savedRadio.checked = true; // Маркира запазената трудност като избрана
        }
    }
};
// Зарежда запазената трудност, когато страницата се зареди
window.addEventListener('DOMContentLoaded', loadDifficulty);
restartButton.addEventListener("click", function(){
    location.reload(); // Рестартиране на играта
});
button.addEventListener ("click", function(){
    this.style.display = "none";
    cont.style.display = "none";
    canvas.style.cursor = 'none';
    btnStartPressed = true;
    saveDifficulty(); // Запазва избора на трудност
    if(easy.checked){
        speed = 3;
        enemiSkor2 = 1.5;
        enemiSkor1 = 0.5;
        /* speedTimer = 30; */
    }
    else if(medium.checked){
        speed = 4;
        brVragove = 4;
        enemiSkor2 = 2.0;
        enemiSkor1 = 1.0;
        /* speedTimer = 20; */
    }
    else{
        speed = 5;
        brVragove = 5;
        enemiSkor2 = 2.5;
        enemiSkor1 = 1.5;
        /* speedTimer = 10; */
    }
    createEneBalls();
    drawGame();
    });

function resizeCanvas() { 
    if(fin) return;
    if(canvResized === true && btnStartPressed === false && broyach > 0 ||(chocar)){
        location.reload(); // Рестартиране на играта
    }
        //Начало
        updateInfoBar();
        canvas.width = window.innerWidth;  // Задава ширината на видимия прозорец
        canvas.height = window.innerHeight - infoBar.offsetHeight; // Задава височината на видимия прозорец
        canvas.style.cursor = 'none';
        isPaused = false; //Igrata da prodalzhi
        canvResized = true; 
        broyach ++;
        if(infoBar.style.backgroundColor = "rgba(180, 180, 180, 1)"){
            nastroiResumedGame();
        }  
}
window.addEventListener("blur", function () {
    if (!isPaused && btnStartPressed) {
        isPaused = true;
        nastroiPausedGame();
        //printNaPauza();
    }
});
// Извикване на resizeCanvas при зареждане на страницата и при промяна на размера на прозореца
window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Първоначално оразмеряванe

function createBalls(){
    
    // Създаване на 50 случайни топки
for (let i = 0; i < BR_TOPKI; i++) {
    balls.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: Math.random() * (canvas.height - 30) + 15,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 15,
        isAttached: false, // Проверява дали топката е част от влакчето
    });
}
// Добавяне на топката на играча
playerBall = {
    x: canvas.width / 2,
    //y: canvas.height - 30,
    y: canvas.height + 40,
    vx: 0,
    vy: -speed,
    radius: 20,
    attachedBalls: [], // Масив за влакчето
};
}
function createEneBalls(){
    // Създаване на 3 противникови топки
for (let i = 0; i < brVragove; i++) {
    enemies.push({
        radius: 10,
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height-10, // Появяват се извън видимия екран
        vy: Math.random() * enemiSkor2 + enemiSkor1, // Скорост на падане
    });
}
}
// Управление на топката на играча
document.addEventListener("keydown", (event) => {
    let zvukPath = "sounds/snakeZavoj.wav";
        switch (event.key) {
            case "i": // Нагоре
            if(posoka != "i"){
                playerBall.vx = 0;
                playerBall.vy = -speed;
                playMoveSound(zvukPath);
                posoka = "i";
                }
            break;
            case "m": // Надолу
            if(posoka != "m"){
                playerBall.vx = 0;
                playerBall.vy = speed;
                playMoveSound(zvukPath);
                posoka = "m";
            }
            break;   
            case "j": // Наляво
            if(posoka != "j"){
                playerBall.vx = -speed;
                playerBall.vy = 0;
                playMoveSound(zvukPath);
                posoka = "j";
            }
            break; 
            case "k": // Надясно
            if(posoka != "k"){
                playerBall.vx = speed;
                playerBall.vy = 0;
                playMoveSound(zvukPath);
                posoka = "k";
            }
            break;
        }
    if(event.code === 'Space' && !spacePressed && btnStartPressed){
        if(chocar === true || fin === true){
            location.reload(); // Рестартиране на играта
        }
        isPaused = !isPaused; // Превключва между пауза и игра
        spacePressed = true; // Задава, че Space е натиснат
        if(isPaused){
            nastroiPausedGame();
        }else{
            nastroiResumedGame();
        }
    }
});
document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        spacePressed = false; // Задава, че Space вече не е натиснат
    }
});

function nastroiPausedGame(){
    canvas.style.cursor = 'auto';
    infoBar.style.backgroundImage = "linear-gradient(to bottom, rgba(150, 150, 150, 1), rgba(80, 80, 80, 1))";
    infoBar.style.backgroundColor = "rgba(180, 180, 180, 1)";
    infoBar.style.borderTop = "2px solid rgba(120, 120, 120, 1)"; // Сива горна граница
    infoBar.style.borderBottom = "2px solid rgba(200, 200, 200, 1)"; // Светло сива долна граница
    infoBar.textContent = "Играта е на пауза! Натиснете клавиш 'Пауза'";
}
function nastroiResumedGame(){
    canvas.style.cursor = 'none';
    infoBar.style.backgroundImage = "";
    infoBar.style.backgroundColor = "";
    infoBar.style.borderTop = "2px solid #8b0000"; // Оригиналната граница
    infoBar.style.borderBottom = "2px solid #cd5c5c"; // Оригиналната граница
    updateInfoBar();
}
function checkGameOver() {
    // Проверка дали има поне една свободна топка   
    // Ако няма свободни топки, играта свършва с победа
    if (brSvobodniT() === 0) {
        brFin++;
        /* if(brFin > 20){
            narisuvaiPobedaZaguba("pobeda");       
        }   */ 

        // След 1-2 секунди, показваме съобщението и спираме играта окончателно
    }
}
function narisuvaiPobedaZaguba(zagPob){
    let moiText ="";
    let bonusText=" ";
    let infoText = "";
    if(zagPob === "pobeda"){
        isPaused = true;
        fin = true;
        canvas.style.cursor = 'auto';
        moiText = `Победихте! Имате ${zakacheni} топки`;
        infoText = 'Очаквайте продължение... 😉';
        pobedaSound.currentTime = 0;
        pobedaSound.play();
    }
    else { //zaguba
        chocar = true;
        isPaused = true;
        canvas.style.cursor = 'auto';
        moiText = `Сблъсък!!! Загубихте😞. Имате ${zakacheni} топки`;
        infoText = 'Натиснете "Пауза" или "Рестарт" за нова игра.';
        katasSound.currentTime = 0;
        katasSound.play();
    }
    
    // Задаване на стилове за текста
    ctx.font = 'bold 2rem Arial'; // Шрифт и размер
    ctx.textAlign = 'center'; // Центрира текста хоризонтално
    ctx.textBaseline = 'middle'; // Центрира текста вертикално
    //zakacheni = brZakacheniT();

    // Рисуване на сянка
    ctx.fillStyle = 'gray'; // Цвят на сянката
    ctx.fillText(moiText, canvas.width / 2 + 1, canvas.height / 2.4 +2 );
    if(zakacheni === BR_TOPKI){
        bonusText = `Браво, 100% успеваемост ! ! !`;
        ctx.font = 'bold 1.3rem Arial';
        ctx.fillText(bonusText, canvas.width / 2 + 1, canvas.height / 2.4 + 52);
    }
    
    // Рисуване на основния текст
    ctx.font = 'bold 2rem Arial';
    ctx.fillStyle = '#1e1e95'; // Основният цвят на текста
    ctx.fillText(moiText, canvas.width / 2, canvas.height / 2.4);
        ctx.font = 'bold 1.3rem Arial';
        ctx.fillText(bonusText, canvas.width / 2, canvas.height / 2.4 + 50);
    
    ctx.font = '1.2rem Arial';
    ctx.fillStyle ='#555';
    ctx.fillText(infoText, Math.round(canvas.width / 2), Math.round(canvas.height / 1.5));

}
function brSvobodniT(){
    const freeBalls = balls.filter(ball => !ball.isAttached);
    return freeBalls.length;
}
/* function brZakacheniT(){
    const zakachBalls = balls.filter(ball => ball.isAttached);
    return zakachBalls.length;
} */
function playMoveSound(path) {
    if(isPaused === false){
        const moveSoundInstance = new Audio(path);
        moveSoundInstance.play();
    }
}
function updateInfoBar() {
    if(!btnStartPressed){
        broiki= BR_TOPKI;
    }
    else{broiki= brSvobodniT();}
    
    infoBar.textContent = `Хванати: ${points} топки | Дължина: ${zakacheni} топки | Остават: ${broiki} топки`;
}
// увеличаване на точките:
function increasePoints(amount) {
    points += amount;
    updateInfoBar();
}
function drawGame() {
    if (isPaused === false && chocar === false) { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Рисуване на топката на играча
        const gradient0 = ctx.createRadialGradient(playerBall.x - 6, playerBall.y - 6, 3, playerBall.x, playerBall.y, playerBall.radius);
        gradient0.addColorStop(0, "white");
        gradient0.addColorStop(0.5, "#57ff57");
        gradient0.addColorStop(1, "darkgreen");
        ctx.beginPath();
        ctx.arc(Math.round(playerBall.x), Math.round(playerBall.y), playerBall.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient0;
        ctx.fill();
        ctx.closePath();

        if(!isPaused){
        // Проверка за края на играта
        checkGameOver(); // Извикваме проверката за свободни топки
        // Актуализиране на позицията на играча
        playerBall.x += playerBall.vx;
        playerBall.y += playerBall.vy;

        // Ограничаване в границите на canvas
        if (playerBall.x < playerBall.radius) {playerBall.x = playerBall.radius;}
        if (playerBall.x > canvas.width - playerBall.radius) {playerBall.x = canvas.width - playerBall.radius;}
        if (playerBall.y < playerBall.radius) {playerBall.y = playerBall.radius;}
        if (playerBall.y > canvas.height - playerBall.radius && btnStartPressed) {playerBall.y = canvas.height - playerBall.radius; }
        }
        // Рисуване на противниковите топки
        
        enemies.forEach((enemy, index) => {
        const gradiEnem = ctx.createRadialGradient(enemy.x - 3, enemy.y - 3, 2, enemy.x, enemy.y, enemy.radius);
        gradiEnem.addColorStop(0, "white");
        gradiEnem.addColorStop(0.5, "#999");
        gradiEnem.addColorStop(1, "black");
            ctx.beginPath();
            ctx.arc(Math.round(enemy.x), Math.round(enemy.y), enemy.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradiEnem;
            ctx.fill();
            ctx.closePath();

            // Актуализиране на позицията на противника
            enemy.y += enemy.vy;

            // Ако противникът достигне дъното, рестартираме го отгоре
            if (enemy.y > canvas.height) {
                enemy.y = -enemy.radius;
                enemy.x = Math.random() * canvas.width;
            }

            // Проверка за сблъсък с играча
            const dx = playerBall.x - enemy.x;
            const dy = playerBall.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Проверка за сблъсък с опашката
            let zvukCortar = "sounds/minus.wav";
            playerBall.attachedBalls.forEach((attachedBall, attachedIndex) => {
                const dxTail = attachedBall.x - enemy.x;
                const dyTail = attachedBall.y - enemy.y;
                const distanceTail = Math.sqrt(dxTail * dxTail + dyTail * dyTail);
                if (distanceTail < attachedBall.radius + enemy.radius) {
                    // Премахване на част от опашката
                    playerBall.attachedBalls.splice(attachedIndex);
                    zakacheni = playerBall.attachedBalls.length;
                    playMoveSound(zvukCortar);
                    updateInfoBar();
                }
            });
            let buffer = 4;
            if (distance < playerBall.radius + enemy.radius - buffer) {
                //alert("Game Over!");
                chocar = true;
                //narisuvaiPobedaZaguba("zaguba"); //chocar става true               
            }
        });

        // Рисуване и актуализиране на топките
        balls.forEach((ball) => {
            if (!ball.isAttached) {
                const gradient = ctx.createRadialGradient(ball.x - 6, ball.y - 6, 5, ball.x, ball.y, ball.radius);
                gradient.addColorStop(0, "white");
                gradient.addColorStop(0.3, "orange");
                gradient.addColorStop(1, "darkred");
                ctx.beginPath();
                ctx.arc(Math.round(ball.x), Math.round(ball.y), ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                if(btnStartPressed === false) return;
                // Актуализиране на позицията
                ball.x += ball.vx;
                ball.y += ball.vy;
                // Отскачане от стените
                if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.vx *= -1;
                if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) ball.vy *= -1;

                // Проверка за близост с играча
                const dx = playerBall.x - ball.x;
                const dy = playerBall.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance - 15 < playerBall.radius + ball.radius) {
                    let zvukHam = "sounds/ham.wav";
                    ball.isAttached = true;
                    playerBall.attachedBalls.push(ball);
                    zakacheni = playerBall.attachedBalls.length;
                    increasePoints(1); // Увеличаване на точките
                    playMoveSound(zvukHam);
                }
            }
        });

        // Рисуване на влакчето
        let prevX = playerBall.x;
        let prevY = playerBall.y;
        playerBall.attachedBalls.forEach((attachedBall, index) => {
            const followSpeed = 0.2;
            attachedBall.x += (prevX - attachedBall.x) * followSpeed;
            attachedBall.y += (prevY - attachedBall.y) * followSpeed;

            const gradientA = ctx.createRadialGradient(attachedBall.x - 4, attachedBall.y - 4, 3, attachedBall.x, attachedBall.y, attachedBall.radius);
            gradientA.addColorStop(0, "white");
            gradientA.addColorStop(0.3, "#ffff6f");
            gradientA.addColorStop(1, "#9f9f01");
            const gradientB = ctx.createRadialGradient(attachedBall.x - 4, attachedBall.y - 4, 3, attachedBall.x, attachedBall.y, attachedBall.radius);
            gradientB.addColorStop(0, "white");
            gradientB.addColorStop(0.3, "#ff8989");
            gradientB.addColorStop(1, "darkred");
            ctx.beginPath();
            ctx.arc(Math.round(attachedBall.x), Math.round(attachedBall.y), attachedBall.radius, 0, Math.PI * 2);
            ctx.fillStyle = index % 2 === 0 ? gradientA : gradientB;
            ctx.fill();
            ctx.closePath();

            prevX = attachedBall.x;
            prevY = attachedBall.y;
            if(chocar === true){
                updateInfoBar();
                narisuvaiPobedaZaguba("zaguba"); //chocar става true
                return;
            };
            if(brFin > 20){
                narisuvaiPobedaZaguba("pobeda");
            }
        });
    }
    if(btnStartPressed){
        requestAnimationFrame(drawGame);
    }
}
//resizeCanvas();
createBalls();
drawGame();
