class Obstacle {
  constructor() {
    this.position = createVector(random(50, width-50), random(50, height-50));
    this.size = random(10, 30);
  }

  show() {
    strokeWeight(2*this.size);
    stroke(160);
    point(this.position.x, this.position.y);
  }
}
