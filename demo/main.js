/**
 * Main method
 */
window.addEventListener("load", () => {
    const marcher = new Marcher(document.getElementById("window"));
    const move = 10;

    let = do_render = true;
    // Demo scenes and camera
    //const demoscene = new Scene([new EchoSphere(new Point(-35,-35,0),20,5000),new EchoSphere(new Point(0,0,0),40,5000),new EchoSphere(new Point(35,35,0),20,5000)],[new Point(100,100,500)]);
    //const demoscene = new Scene([new InfinitySphere(20,5)],[new Point(100,100,100)]);
    const demoscene = new Scene([new Sphere(new Point(-20,-20,0),20)],[new Point(100,100,100)]);
    const democamera = new Camera(new Point(0,0,-200),new Point(0,0,200));

    //// Navigation  (Rotating the camera is currently not supported)
    // Zoom controll
    window.onwheel = (event) => {
        if(event.deltaY > 0){
            shift();
            democamera.center.z -= 1;
        } else {
            shift();
            democamera.center.z += 1;
        }
    }

    const shift = () => {
        do_render = true;
        marcher.iter = move;
        marcher.shift = move;
    }

    // Pan controll via arrow keys or wasd
    window.onkeydown = (event) => {
        switch(event.keyCode){
            case 65: // a
            case 37: // Left
                shift();
                democamera.center.x -= move;
                break;
            case 87: // w
            case 38: // Up
                shift();
                democamera.center.y -= move;
                break;
            case 68: // d
            case 39: // Right
                shift();
                democamera.center.x += move;
                break;
            case 83: // s
            case 40: // Down
                shift();
                democamera.center.y += move;
        }
    }

    //// Render loop with fps
    // Init fps
    const fps_span = document.getElementById("fps");
    const set_fps = (fps) => fps_span.innerText = `${fps} fps`;
    const set_pause = () => fps_span.innerText = `Pause`;
    

    let last_time = new Date().getTime();
    let frames = 0;
    // Init render loop
    var renderloop = function(){
        if(do_render){
            if(marcher.iter == 1){
                do_render = false;
            }
            marcher.render(democamera, demoscene);
        }
        frames++;
        requestAnimationFrame(renderloop);
        new_time = new Date().getTime();
        if(new_time - last_time > 1000){
            last_time = new_time;
            if(do_render){
                set_fps(frames);
            } else {
                set_pause();
            }
            frames = 0;
        }

    }

    // Start render loop
    renderloop();
},false);