let jiggleCounter = 0;
let idToImgDir = {};

// Update the source of an image from idToImgDir
function updateImg(id) {
    const img = document.getElementById(id);
    const url = idToImgDir[id];
    img.src = `assets/${url}/img${jiggleCounter}.png`;
}

// Read instructions CSV
let instructions;
d3.text('code/url.txt').then(url => {
    d3.csv(url).then(instructions_ => {
        instructions = instructions_;
        instructions.forEach(row => {
            if (row.trigger === 'start') {
                idToImgDir[row.id] = row.dir;
                updateImg(row.id);
            }
        });
    });
});

// Update the face position on mousemove
document.addEventListener('mousemove', (event) => {
    const puppet = document.getElementById('puppet');
    const face = document.getElementById('face');

    const puppetRect = puppet.getBoundingClientRect();
    const faceRect = face.getBoundingClientRect();

    const widthPercent = event.clientX / window.innerWidth;
    const heightPercent = event.clientY / window.innerHeight;

    const faceX = widthPercent * (puppetRect.width - faceRect.width);
    const faceY = heightPercent * (puppetRect.height - faceRect.height);

    face.style.left = `${faceX}px`;
    face.style.top = `${faceY}px`;
});

// Key event handlers
function handleKeyEvent(event, eventType) {
    instructions.forEach(row => {
        if (row.trigger === eventType && row.key === event.code) {
            idToImgDir[row.id] = row.dir;
            console.log(row);
            console.log('updating', row.id);
            updateImg(row.id);
        }
    });
}

document.addEventListener('keydown', (event) => {
    handleKeyEvent(event, 'keydown');
});

document.addEventListener('keyup', (event) => {
    handleKeyEvent(event, 'keyup');
});

let lastTick = Date.now();

function tick() {
    const now = Date.now();

    // Check if at least 100ms have passed
    if (now - lastTick >= 100) {
        jiggleCounter = (jiggleCounter + 1) % 3;
        Object.keys(idToImgDir).forEach(updateImg);

        lastTick = now;
    }

    requestAnimationFrame(tick);
}

// Start the animation loop
requestAnimationFrame(tick);
