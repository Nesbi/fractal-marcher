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