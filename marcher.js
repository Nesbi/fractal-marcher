/**
 * Main method
 */
window.addEventListener("load", () => {
    const marcher = new Marcher(document.getElementById("window"));

    // Demo scenes and camera
    //const demoscene = new Scene([new EchoSphere(new Point(-200,-50,0),20),new Sphere(new Point(50,200,0),20)],[new Point(100,100,100)]);
    const demoscene = new Scene([new InfinitySphere(new Point(-20,-20,0),20,5)],[new Point(100,100,100)]);
    const democamera = new Camera(new Point(-1000,-1000,-200),new Point(0,0,200));


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
            frames = 0;
        }
    }

    // Start render loop
    renderloop();
},false);

/**
 * Base class for ray marcher
 */
class Marcher{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    /**
     * Render a picture of a scene from the perspective of a camera
     * 
     * @param {Camera} camera 
     * @param {Scene} scene 
     */
    render(camera,scene){
        const width = this.canvas.width;
        const height = this.canvas.height;
        const max_path = 10000;
        const min_distance = 0.1;
        const camera_direction = camera.direction;
        const camera_center = camera.center;

        // Iterate through all pixels in the image
        // (Uses while(--x) instead of for(let x = 0; x < width;x++) out of performance reasons)
        let x = width;
        while(--x){
            let y = height;
            while(--y){
                // A ray staring from the camera through the pixel plane
                const ray = camera_direction.add(new Point(x-width/2,y-height/2,0)).normalize();

                // Find the nearest object and hit point
                let path_length = 0;
                let hit_object;
                let hit_point;
                while(path_length < max_path){
                    const point = camera_center.add(ray.multiply(path_length)); 
                    // Estimate all distances and return the object with the lowest distance and the distance
                    const [object, distance] = scene.objects
                                        .map(o => [o,o.distance_estimator(point)])
                                        .sort((a,b) => b[1]-a[1])
                                        .pop();

                    // Check for hit
                    if(distance < min_distance){
                        hit_object = object;
                        hit_point = point;
                        break;
                    }
                    path_length = Math.min(max_path,path_length+distance);
                }

                // Colorize the pixel
                if(hit_object !== undefined){
                    // Set the pixel color based on the object that was hin
                    const normal = hit_object.normal(hit_point);
                    const color_normal = normal.cross(camera_direction).normalize();
                    this.context.fillStyle = `rgba(${255-125*color_normal.x},${255-125*color_normal.y},${255-125*color_normal.z},1)`;
                } else {
                    // Set the pixel as void color
                    this.context.fillStyle = `rgba(0,0,0,1)`;
                }
                // Draw pixel
                this.context.fillRect(x,y,1,1);
            }
        } 
    }
}