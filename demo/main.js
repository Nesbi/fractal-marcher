/**
 * Main method
 */
window.addEventListener("load", () => {
    const marcher = new Marcher(document.getElementById("window"));

    // Demo scenes and camera
    //const demoscene = new Scene([new EchoSphere(new Point(-35,-35,0),20,5000),new EchoSphere(new Point(0,0,0),40,5000),new EchoSphere(new Point(35,35,0),20,5000)],[new Point(100,100,500)]);
    const demoscene = new Scene([new InfinitySphere(new Point(-20,-20,0),20,5)],[new Point(100,100,100)]);
    const democamera = new Camera(new Point(0,0,-200),new Point(0,0,200));

    //// Navigation  (Rotating the camera is currently not supported)
    // Zoom controll
    window.onwheel = (event) => {
        if(event.deltaY > 0){
            democamera.center.z -= 1;
        } else {
            democamera.center.z += 1;
        }
    }

    // Pan controll via arrow keys or wasd
    window.onkeydown = (event) => {
        switch(event.keyCode){
            case 65: // a
            case 37: // Left
                democamera.center.x -= 10;
                break;
            case 87: // w
            case 38: // Up
                democamera.center.y -= 10;
                break;
            case 68: // d
            case 39: // Right
                democamera.center.x += 10;
                break;
            case 83: // s
            case 40: // Down
                democamera.center.y += 10;
        }
    }

    //// Render loop with fps
    // Init fps
    const fps_span = document.getElementById("fps");
    const set_fps = (fps) => fps_span.innerText = `${fps} fps`;
    

    let last_time = new Date().getTime();
    let frames = 0;
    // Init render loop
    var renderloop = function(){
        marcher.render(democamera,demoscene);
        frames++;
        requestAnimationFrame(renderloop);
        new_time = new Date().getTime();
        if(new_time - last_time > 1000){
            last_time = new_time;
            set_fps(frames);
            frames = 0;
        }
    }

    // Start render loop
    renderloop();
},false);