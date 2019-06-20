/**
 * Basic camera inside a scene
 */
class Camera{
    constructor(center,direction){
        this.center = center;
        this.direction = direction;
    }
}

/**
 * Basic Scene with objects and lights
 */
class Scene{
    constructor(objects,lights){
        this.objects = objects;
        this.lights = lights;
    }
}

/**
 * Base class for ray marcher
 */
class Marcher{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.shift = 10;
        this.iter = 0;
        this.iter_delta = 1;
    }

    /**
     * Render a picture of a scene from the perspective of a camera
     * 
     * @param {Camera} camera 
     * @param {Scene} scene 
     */
    render(camera,scene){
        const height = this.canvas.height;
        const width = this.canvas.width;
        const max_path = 10000;
        const min_distance = 0.1;
        const camera_direction = camera.direction;
        const camera_center = camera.center;

        // Iterate through all pixels in the image
        // (Uses while(--x) instead of for(let x = 0; x < width;x++) out of performance reasons)
        let x_area = Math.floor(height * this.iter / this.shift);
        while(--x_area+1){
            const x = x_area * (this.shift - this.iter); 
            let y_area =  Math.floor(width * this.iter / this.shift);
            while(--y_area+1){
                const y = y_area * (this.shift - this.iter); 
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
                this.context.fillRect(x,y,(this.shift - this.iter),(this.shift - this.iter));
            }
        } 
        this.iter = (this.iter >= this.shift) ? 0 : (this.iter + this.iter_delta);
    }
}