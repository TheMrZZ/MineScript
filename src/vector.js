/**
 * A 3D vector class, with a unit that will be included on displays
 */
class Vector {
    constructor(x, y, z, unit) {
        this.unit = (unit === undefined ? '' : unit)
        this.x = x
        this.y = y
        this.z = z
    }

    /**
     * Get the inverse of the vector
     * @return {Vector} the inverse of the vector
     */
    negative() {
        return new Vector(-this.x, -this.y, -this.z, this.unit)
    }

    /**
     * Add the given vector or number
     * @param v {Vector|number} the vector to add, or a number to add to each coordinate
     * @return {Vector} the sum of the vectors
     */
    add(v) {
        if ([null, undefined].includes(v)) throw new TypeError('Invalid argument for Vector.add: ' + v)
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z, this.unit)
        else return new Vector(this.x + v, this.y + v, this.z + v, this.unit)
    }

    /**
     * Subtract the given vector or number
     * @param v {Vector|number} the vector to substract, or a number to substract to each coordinate
     * @return {Vector} the difference of the vectors
     */
    subtract(v) {
        if ([null, undefined].includes(v)) throw new TypeError('Invalid argument for Vector.subtract: ' + v)
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z, this.unit)
        else return new Vector(this.x - v, this.y - v, this.z - v, this.unit)
    }

    /**
     * Multiply by the given vector, or by the given number
     * @param v {Vector|number} the vector or number to multiply by
     * @return {Vector} the product
     */
    multiply(v) {
        if ([null, undefined].includes(v)) throw new TypeError('Invalid argument for Vector.multiply: ' + v)
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z, this.unit)
        else return new Vector(this.x * v, this.y * v, this.z * v, this.unit)
    }

    /**
     * Divide by the given vector, or by the given number
     * @param v {Vector|number} the vector or number to divide by
     * @return {Vector} the division
     */
    divide(v) {
        if ([null, undefined].includes(v)) throw new TypeError('Invalid argument for Vector.divide: ' + v)
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z, this.unit)
        else return new Vector(this.x / v, this.y / v, this.z / v, this.unit)
    }

    /**
     * Checks if two vectors are equal
     * @param v {Vector} the vector to check
     * @return {boolean} true if they are both equal, else false
     */
    equals(v) {
        if ([null, undefined].includes(v)) throw new TypeError('Invalid argument for Vector.equals: ' + v)
        return this.x === v.x && this.y === v.y && this.z === v.z
    }

    /**
     * Gets an array of the coordinates of the vector
     * @return {number[]} an array of coordinates
     */
    toArray() {
        return [this.x, this.y, this.z]
    }

    /**
     * Adds all the elements of the vector separated by the given separator
     * @param separator {string} the separator
     * @return {string} all the elements separated by the given string
     */
    join(separator) {
        return this.toArray().join(this.unit + separator) + this.unit
    }
}

module.exports = Vector