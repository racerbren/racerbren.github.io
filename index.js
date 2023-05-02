const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const inspector = document.querySelector('div p');

canvas.width = 1024;
canvas.height = 576;

context.fillStyle = 'black';
context.fillRect(512, 288, 2048, 1152);

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 100) {
    collisionsMap.push(collisions.slice(i, i + 100))
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }
    draw() {
        context.fillStyle = 'rgba(255, 0, 0, 0)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
const offset = {
    x: -1700,
    y: -1800
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 0) {
            boundaries.push(new Boundary({position: {x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y}}));
        }
    })
})

console.log(boundaries);

const image = new Image();
image.src = './img/Map.png';

const playerIdleRImage = new Image();
playerIdleRImage.src = './img/Idle Right.png';

const playerIdleLImage = new Image();
playerIdleLImage.src = './img/Idle Left.png';

const playerRightImage = new Image();
playerRightImage.src = './img/Walk Right.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/Walk Left.png';

const chest = new Image();
chest.src = './img/Chest2.png';

const fish = new Image();
fish.src = './img/fish.png';

const jelly = new Image();
jelly.src = './img/jelly.png';

const shark = new Image();
shark.src = './img/Shark.png';

const octopus = new Image();
octopus.src = './img/octopus.png';

const eel = new Image();
eel.src = './img/eel.png';

class Sprite {
    constructor({position, velocity, image, frames = {max: 1}, sprites}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
        this.moving = false;
        this.sprites = sprites;
    }
    draw() {
        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y, 
            this.image.width / this.frames.max,
            this.image.height
        );
        //if (this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

const eel_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2 + 415,
        y: canvas.height / 2 - 48 / 2 + 595
    },
    image: eel,
    frames: {
        max: 4
    }
})

const octopus_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (288 / 6) / 2 -1260,
        y: canvas.height / 2 - 48 / 2 + 255
    },
    image: octopus,
    frames: {
        max: 6
    }
})

const shark_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2 + 1285,
        y: canvas.height / 2 - 48 / 2 -325
    },
    image: shark,
    frames: {
        max: 4
    }
})

const jelly_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2 + 1561,
        y: canvas.height / 2 - 48 / 2 + 400
    },
    image: jelly,
    frames: {
        max: 4
    }
})

const fish_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (192 / 4) / 2 - 1300,
        y: canvas.height / 2 - 48 / 2 + 1150
    },
    image: fish,
    frames: {
        max: 4
    }
})

const chest_object = new Sprite ({
    position: {
        x: canvas.width / 2 - (288 / 8) / 2 + 1600,
        y: canvas.height / 2 - 42 / 2 + 1203
    },
    image: chest,
    frames: {
        max: 8
    }
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - (288 / 4) / 2,
        y: canvas.height / 2 - 48 / 2
    },
    image: playerIdleRImage,
    frames: {
        max: 4
    },
    sprites: {
        right: playerRightImage,
        left: playerLeftImage,
        idle_right: playerIdleRImage,
        idle_left: playerIdleLImage
    }
})

const background = new Sprite({
    position: {x: offset.x, y: offset.y},
    image: image
})

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false}
}

const movables = [background, ...boundaries, chest_object, fish_object, jelly_object, shark_object, octopus_object, eel_object]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    chest_object.draw();
    jelly_object.draw();
    fish_object.draw();
    shark_object.draw();
    octopus_object.draw();
    eel_object.draw();
    player.draw();

    if (background.position.x <= -240 && background.position.x >= -640 &&
        background.position.y <= -1855 && background.position.y >= -2255) {
            inspector.innerHTML = "Higher temperatures due to climate change affect the behavior and development of octopus populations.\
            Birth rates, population size, and energy distribution all decline dramatically with slight changes in temperatures.";
    }
    else if (background.position.x <= -2785 && background.position.x >= -3185 &&
             background.position.y <= -1275 && background.position.y >= -1675) {
                inspector.innerHTML = "Sharks are a keystone species in many coastal ecosystems. Changes in water temperatures increase\
                 the chances that sharks will migrate to more preferable conditions, leaving other species to suffer.";
    }
    else if (background.position.x <= -1915 && background.position.x >= -2315 &&
             background.position.y <= -2195 && background.position.y >= -2595) {
                inspector.innerHTML = "Climate change is pushing freshwater eels closer to extinction. Fewer young eels are likely to\
                 survive in warmer waters. These changes also decrease the survival rate of larvae and drift.";
    }
    else if (background.position.x <= -3265 + 200 && background.position.x >= -3265 - 200 &&
             background.position.y <= -2200 + 200 && background.position.y >= -2200 - 200) {
                inspector.innerHTML = "Jellyfish populations tend to grow in warmer climates. However, jellyfish have very few predators,\
                 such as leatherback sea turtles and whale sharks, which means that their growing populations will be hard to stop and they\
                  will become a harmful invasive species in many ecosystems.";
    }   
    else if (background.position.x <= -395 + 200 && background.position.x >= -395 - 200 &&
        background.position.y <= -2950 + 200 && background.position.y >= -2950 - 200) {
           inspector.innerHTML = "Many species of fish thrive in specific environments. Too much or too little ph, temperature, or nutrients\
            can affect the species' chances for survival. All of these factors fluctuate with the onset of climate change.";
    }
    else {
        if (background.position.y >= -2080) {
            inspector.innerHTML = "Kelp forests form vast and diverse habitats for many species living along coastal waters. These ecosystems\
             thrive in nutrient-rich cool waters. Warming oceans directly decrease the presence of kelp forests and the diverse life that it fosters.";
        }
        else if (background.position.y < -2080 && background.position.y >= -2700) {
            inspector.innerHTML = "Even the slightest increase or decrease in water temperatures can stress out coral polyps and lead to coral\
             bleaching and then to death. This can also lead to harmful algal blooms. Coral reefs are home to the most biodiverse ecosystem on Earth. ";
        }
        else if (background.position.y < -2700) {
            inspector.innerHTML = "Warming oceans causes changes in oceanic currents which can introduce sea turtles to new predators and harm\
             the coral reefs they need to survive. Even the temperature of beach sand may drive sea turtles into extinction by shortage of males.";
        }
        else inspector.innerHTML = "nothing to see";
    } 

    boundaries.forEach(boundary => {
        boundary.draw();
    })

    let lastkey = '';
    let moving = true;
    player.moving = false;
    if (lastkey === 'a') player.image = player.sprites.idle_left;
    else player.image = player.sprites.idle_right;
    player.frames.max = 4;
    canvas.width / 2 - (288 / 4) / 2;
    if (keys.w.pressed) {
        player.moving = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 5
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 5;
            })
        }  
    }
    if (keys.a.pressed) {
        player.moving = true;
        player.image = player.sprites.left;
        player.frames.max = 6;
        player.position.x = canvas.width / 2 - (288 / 6) / 2;
        lastkey = 'a';
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 5,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving) {
        movables.forEach((movable) => {
            movable.position.x += 5;
        })
        }
    }
    if (keys.s.pressed) {
        player.moving = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 5
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving) {
        movables.forEach((movable) => {
            movable.position.y -= 5;
        })
        }
    }
    if (keys.d.pressed) {
        player.moving = true;
        player.image = player.sprites.right;
        player.frames.max = 6;
        player.position.x = canvas.width / 2 - (288 / 6) / 2;
        lastkey = 'd';
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 5,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving) {
        movables.forEach((movable) => {
            movable.position.x -= 5;
        })
        }
    }
    console.log(background.position.x, background.position.y);
    
}

animate();

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})
