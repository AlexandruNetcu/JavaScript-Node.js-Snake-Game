export default class Snake {
    constructor(scene) {
        this.scene = scene;
        this.lastMoveTime = 0; //timpul in milisecunde de la ultima miscare
        this.moveInterval = 100; // 0.1 secunda / 100 milisecunde (1 sec = 1000 milisec)
        this.tileSize = 16;
        this.direction = Phaser.Math.Vector2.DOWN; //directia automata
        this.body = []; //corpul sarpelui definit ca un array gol
        this.body.push(this.scene.add.rectangle(this.scene.game.config.width / 2, this.scene.game.config.height / 2, this.tileSize, this.tileSize, 0xff0000).setOrigin(0)); // 100/100 - coordonatele, 16/16 pixeli (ori scriem 16,16 ori folosim this.tileSize pe care l-am definit mai sus ca fiind 16), culoarea rosie in hexa/ coordonate sarpe/ miscarea corpului sarpelui
        //this.body.push(this.scene.add.rectangle(0, 0, 16, 16, 0x0000ff).setOrigin(0)); //coada sarpelui/culaore albastra - cod de test pentru a vedea ce se intampla cand mai adaugam un box la body-ul sarpelui
        //this.body.push(this.scene.add.rectangle(0, 0, 16, 16, 0xffffff).setOrigin(0)); - cod de test pentru a vedea ce se intampla cand mai adaugam un box la body-ul sarpelui
        this.apple = this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize, 0x00ff00).setOrigin(0); // am creat si adaugat in scena mancarea sarpelui, culoare verde
        this.positionApple();
        scene.input.keyboard.on('keydown', e => { this.keydown(e); }); // de fiecare data cand apasam orice tasta de pe tastatura vedem eventurile/logurile in consola browserului, din acele loguri putem vedea codurile tastelor pentru a putea stii pe care sa le folosim in miscarea sarpelui
    }

    positionApple() {
        this.apple.x = Math.floor(Math.random() * this.scene.game.config.width / this.tileSize) * this.tileSize; // numar random intre 0 si width / 16(tileSize), solosim math.floor sa fie integer
        this.apple.y = Math.floor(Math.random() * this.scene.game.config.height / this.tileSize) * this.tileSize;
    }

    keydown(event) {
        console.log(event);
        switch (event.keyCode) {
            case 37://Left
                if (this.direction !== Phaser.Math.Vector2.RIGHT) //conditie daca directia de deplasare este stanga butonul de directie dreapta nu face nimic/ idem pentru conditiile de mai jos: left-right/up-down
                    this.direction = Phaser.Math.Vector2.LEFT;
                break;
            case 38://Up
                if (this.direction !== Phaser.Math.Vector2.DOWN)
                    this.direction = Phaser.Math.Vector2.UP;
                break;
            case 39://Right
                if (this.direction !== Phaser.Math.Vector2.LEFT)
                    this.direction = Phaser.Math.Vector2.RIGHT;
                break;
            case 40://Down
                if (this.direction !== Phaser.Math.Vector2.UP)
                    this.direction = Phaser.Math.Vector2.DOWN;
                break;
        }
    }

    update(time) {
        if (time >= this.lastMoveTime + this.moveInterval) {
            this.lastMoveTime = time;
            this.move();
        }
    }
    move() {

        let x = this.body[0].x + this.direction.x * this.tileSize;
        let y = this.body[0].y + this.direction.y * this.tileSize;

        if (this.apple.x === x && this.apple.y === y) //conditia ca sarpele sa fii mancat marul 
        {
            this.body.push(this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize, 0xffffff).setOrigin(0));
            this.positionApple();
        }
        // this.body[1].x = this.body[0].x; // this.body[1].x - coada sarpelui x = pozitia x a cozii
        // this.body[1].y = this.body[0].y; inlocuim linia asta si cea de deasupra cu loop-ul for de mai jos

        for (let index = this.body.length - 1; index > 0; index--) {
            this.body[index].x = this.body[index - 1].x;
            this.body[index].y = this.body[index - 1].y;
        }
        this.body[0].x = x;  //misacarea unui box (misca capul sarpelui in alta pozitie) 
        this.body[0].y = y;

        //pierzi daca treci prin pereti/ reset din mijlocul hartei
        if (this.body[0].x < 0 || this.body[0].x >= this.scene.game.config.width || this.body[0].y < 0 || this.body[0].y >= this.scene.game.config.height) {
            this.scene.scene.restart();
        }
        //pierzi daca mananci coada - pozitia capului = oricare din boxurile cozii
        let tail = this.body.slice(1);
        if (tail.some(s => s.x === this.body[0].x && s.y === this.body[0].y)) // varianta mai simpla folosim some nu filter
        //if(tail.filter(s => s.x === this.body[0].x && s.y == this.body[0].y).length > 0) // prin filter vedem daca o parte a unui array indeplineste conditia p usa
        {
            this.scene.scene.restart();
        }
    }
}