(() => {
    let inputBox = document.getElementById("input_box");
    let submitBtn = document.getElementById("submit");
    let resetBtn = document.getElementById("reset");
    let submitResetBtn = document.getElementById("submit_reset");
    let canvas = document.getElementById("main_canvas");
    let ctx = canvas.getContext("2d");
    let size = 128;
    let shaderFunc = buildFunc("r = g = b = 0;");
    let ticks = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(0, 0, size, size);

    submitBtn.addEventListener("click", () => {
        shaderFunc = buildFunc(inputBox.value);
    });

    resetBtn.addEventListener("click", () => {
        ticks = 0;
    });

    submitResetBtn.addEventListener("click", () => {
        shaderFunc = buildFunc(inputBox.value);
        ticks = 0;
    });

    canvas.addEventListener("mousemove", (ev) => {
        mouseX = ev.offsetX;
        mouseY = ev.offsetY;
    });

    function buildFunc(input) {
        return Function(`
            "use strict";
            return ((x, y, r, g, b, s, mx, my) => {
                ` + input + `
                return [r, g, b];
            });
        `)();
    }

    function run(func, dots) {
        for (let y = 0; y < size; y++) {
            let yIdxOffset = y * size;
            for (let x = 0; x < size; x++) {
                let idx = (yIdxOffset + x) * 4;
                let r = dots[idx];
                let g = dots[idx + 1];
                let b = dots[idx + 2];
                
                // run user input func
                let res = func(x, y, r, g, b, ticks, Math.floor(mouseX / 4), Math.floor(mouseY / 4));

                dots[idx] = res[0];
                dots[idx + 1] = res[1];
                dots[idx + 2] = res[2];
            }
        }
    }

    function doFrame() {
        let imgData = ctx.getImageData(0, 0, size, size)
        let dots = imgData.data;
        run(shaderFunc, dots);
        ctx.putImageData(imgData, 0, 0);
        ticks += 1;
        window.requestAnimationFrame(doFrame);
    }
    window.requestAnimationFrame(doFrame);
})();