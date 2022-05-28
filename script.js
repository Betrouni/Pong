// Commandes : lancer la partie: Enter, droite: D, gauche: Q

// récupération des éléments HTML

var ball = document.getElementById('ball');
var rod1 = document.getElementById('player1');
var rod2 = document.getElementById('player2');

// déclaration des variables

var storeName = "Player Name";
var  storeScore = "Max Score";
var rod1Name = "Player 1";
var rod2Name = "Player 2";


let score,maxScore,movement,rod;
let ballSpeedX = 3,ballSpeedY = 3;

let gameOn = false;

let windowWidth = window.innerWidth,windowHeight = window.innerHeight;

// éxécute le bloc lorssqu'une touche est appuyée


    

// Si le localStorage est vide, déclare maxScore, rod et prompt que c'est la première partie
// sinon prompt le score maximal 
// appelle resetBoard()

(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === null || maxScore === null) {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = "Player 1"
    } else {
        alert(rod + " has maximum score of " + maxScore * 100);
    }

    resetBoard();
})();


// place les éléments dans leur position originelle 

function resetBoard() {

    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';
   
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    

    score = 0;
    gameOn = false;

}


// stock en localStorage les input rod et maxScore si score est supérieur au maxScore déjà présent
// stop movement
// appelle resetBoard
// prompt un message de fin de partie

function storeWin(rod, score) {

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(movement);
    resetBoard();

    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));

}



window.addEventListener('keypress', function () {
    let rodSpeed = 30;


    // getBoundingClientRect() est une fonction qui renvoie un object DOMRect incluant 
    // les propriétés du rectangle sur lequel elle est appellée

    let rodRect = rod1.getBoundingClientRect();


    // vérifie quelle touche est appuyée et déplace le paddle en conséquence

    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

// si Enter est appuyé, vérifie gameOn, si non : gameOn deviens true 
// les coordonnées de la balle sont stockées et appelle movement
    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            // stock les données relatives aux coordonnées et dimensions de la balle et paddle

            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;


            // la function est exectutée 8 fois par secondes
            movement = setInterval(function () {

                // déplacement de la balle
                ballX += ballSpeedX;
                ballY += ballSpeedY;


                // on stock les coordonnées en X des deux paddle

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;


                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                // si la balle touche un coté de la fenêtre, elle rebondis en inversant ballSpeedX

                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }
                let ballPos = ballX + ballDia / 2;

                // si la balle touche rod1 ou rod2, elle rebondis en inversant ballSpeedY et ajoute un point au score
                // stock le score en localStorage

                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; 
                    score++;
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                }
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY;
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }

            }, 8);

        }
    }

});