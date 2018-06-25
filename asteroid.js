function Asteroid(pos, r) {
    if (pos) {
        this.position = pos.copy();
    } else {
        this.position = createVector(random(width), random(height));
    }
    if (r) {
        this.r = r*0.5;    
    } else {
        this.r = random(10, 35);
    }
    this.velocity = p5.Vector.random2D();
    this.total = floor(random(5,15));
    this.offset = [];

    for ( var i = 0; i < this.total; i++ ) {
        this.offset[i] = random(-this.r*0.5, this.r*0.5);
    }

    this.update = function() {
        this.position.add(this.velocity)
    }

    this.render = function() {
        push();
        translate(this.position.x, this.position.y);
        beginShape();
        for ( var i = 0; i < this.total; i++ ) {
            var angel = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i]
            var x = r * cos(angel);
            var y = r * sin(angel);
            vertex(x,y);
        }
        endShape(CLOSE);
        pop();
    }

    this.edges = function() {
        if (this.position.x > width + this.r) {
          this.position.x = -this.r;
        } else if (this.position.x < - this.r) {
          this.position.x = width + this.r;
        }
        if (this.position.y > height + this.r) {
          this.position.y = -this.r;
        } else if (this.position.y < - this.r) {
          this.position.y = height + this.r;
        }
      }

    this.breakup = function() {
        var newA = [];
        newA[0] = new Asteroid(this.position, this.r);
        newA[1] = new Asteroid(this.position, this.r);
        return newA;
    }
}