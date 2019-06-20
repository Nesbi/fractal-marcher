/**
 * Simple 3D point
 */
class Point{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(point){
        return new Point(this.x+point.x, this.y+point.y, this.z+point.z);
    }
    subtract(point){
        return new Point(this.x-point.x, this.y-point.y, this.z-point.z);
    }
    cross(point){
        return new Point(   this.y*point.z-this.z*point.y,
                            this.z*point.x-this.x+point.z, 
                            this.x*point.y-this.y*point.x   )
    }
    multiply(scalar){
        return new Point(this.x*scalar, this.y*scalar, this.z*scalar)
    }
    divide(scalar){
        return this.multiply(1/scalar)
    }
    /**
     * Normalize this point as if it would be a vector starting from 0,0,0 
     * Returns the normalized point
     */
    normalize(){
        return this.divide(this.norm());
    }
    /**
     *  Calculate the l2 norm of a (3D) point
     *  
     * @param {Point} point 
     */
    norm(){
        return Math.sqrt(this.x**2+this.y**2+this.z**2);
    }
}

/**
 * Simple 3D Sphere
 */
class Sphere{
    constructor(center, radius){
        this.center = center;
        this.radius = radius;
    }
    /**
     * Return a normal vector pointing from center to a specified point
     * 
     * @param {Point} point 
     */
    normal(point){
        return point.subtract(this.center).normalize();
    }
    /**
     * Estimate the distance between point and this sphere
     * 
     * @param {Point} point 
     */
    distance_estimator(point){
        return Math.max(point.subtract(this.center).norm() - this.radius, 0); 
    }
}

/**
 * A infinite array of spheres which are specified by a distance between another
 * TODO still buggy and only works with a broken modulo
 */
class InfinitySphere{
    constructor(radius, distance){
        this.center = new Point(-20,-20,0);
        this.radius = radius;
        this.distance = distance;
    }
    /**
     * Return a normal vector pointing from the center of the nearest sphere to a specified point
     * 
     * @param {Point} point 
     */
    normal(point){
        return this._to_infinity_point(point).subtract(this.center).normalize();
    }
    /**
     * Estimate the distance between point and the nearest sphere
     * 
     * @param {Point} point 
     */
    distance_estimator(point){
        return Math.max(this._to_infinity_point(point).subtract(this.center).norm() - this.radius, 0); 
    }
    /**
     * Transform a point to an infinity point thats. 
     * This point will represent the nearest point to all spheres independent 
     * of the previous position.
     * 
     * @param {*} point 
     */
    _to_infinity_point(point){
        const space = this.radius*this.distance;
        return new Point(broken_mod(point.x,space),broken_mod(point.y,space),broken_mod(point.z,space))
    }
}

/**
 * A recursive shape of spheres and borders of spheres 
 */
class EchoSphere{
    constructor(center, radius, distance){
        this.center = center;
        this.radius = radius;
        this.distance = distance;
    }
    /**
     * Return a normal vector pointing from the center of the nearest sphere border to a specified point
     * 
     * @param {Point} point 
     */
    normal(point){
        return point.subtract(this.center).normalize();
    }

    /**
     * Estimate the distance between point and the nearest sphere border
     * 
     * @param {Point} point 
     */
    distance_estimator(point){
        return Math.max((point.subtract(this.center).norm()%this.distance) - this.radius, 0); 
    }
}

// TODO
class Box{
    constructor(center, radius){
        this.center = center;
        this.radius = radius;
    }

    distance_estimator(point){
        return point.subtract(this.center).norm() - this.radius; 
    }
}


// Additional Math functions
/**
 * Calculate the modulo of x to y (x mod y)
 * @param {*} x 
 * @param {*} y 
 */
function broken_mod(x,y) {
    let m = x % y;
    return (m > 0) ? m - y : m;
}
function mod(x,y) {
    if(x < 0){
        const t = Math.abs(x) > y ? Math.ceil(Math.abs(x) / y) : 1;
        return (x+(t*y)) % y;
    } else {
        return x % y;
    }
}