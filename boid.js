const maxSpeed = 4;

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
  }

  align(boids) {
    const steering = createVector();
    for (let other of boids) {
      if (other != this) {
        steering.add(other.velocity);
      }
    }
    if (boids.length > 1) steering.div(boids.length-1);
    return steering.sub(this.velocity).div(5);
  }

  cohesion(boids) {
    const centerOfMass = createVector();
    for (let other of boids) {
      if (other != this) {
        centerOfMass.add(other.position);
      }
    }
    if (boids.length > 1) centerOfMass.div(boids.length-1);
    return centerOfMass.sub(this.position).div(70);
  }

  separation(boids) {
    const radius = 15;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < radius) {
        steering.sub(createVector(other.position.x-this.position.x, other.position.y-this.position.y).setMag(radius-d))
      }
    }
    return steering.div(5);
  }

  flock(boids) {
    this.acceleration.add(this.align(boids).mult(alignSlider.value()));
    this.acceleration.add(this.cohesion(boids).mult(cohesionSlider.value()));
    this.acceleration.add(this.separation(boids).mult(separationSlider.value()));
  }

  update() {
    const edgeAvoidanceRadius = 20;
    const edgeAvoidanceStrength = 2.5;
    if (this.position.x < edgeAvoidanceRadius) this.acceleration.x += edgeAvoidanceStrength;
    if (this.position.x > width - edgeAvoidanceRadius) this.acceleration.x -= edgeAvoidanceStrength;
    if (this.position.y < edgeAvoidanceRadius) this.acceleration.y += edgeAvoidanceStrength;
    if (this.position.y > height - edgeAvoidanceRadius) this.acceleration.y -= edgeAvoidanceStrength;

    this.velocity.add(this.acceleration);
    this.velocity.limit(maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(1);
    stroke(255);
    const direction1 = this.velocity.copy();
    direction1.setMag(5);
    const direction2 = direction1.copy().rotate(2/3*PI);
    const direction3 = direction1.copy().rotate(4/3*PI);
    direction1.setMag(10);
    triangle(this.position.x+direction1.x, this.position.y+direction1.y,
      this.position.x+direction2.x, this.position.y+direction2.y,
      this.position.x+direction3.x, this.position.y+direction3.y);
  }
}

const distMult = 65;
const distBase = 20;
const andleMult = 1;
class ReducedPerceptionBoid extends Boid {
  flock(boids) {
    const visibleBoids = boids.filter((e) => {
      const angle = this.velocity.angleBetween(createVector(e.position.x-this.position.x, e.position.y-this.position.y));
      const d = customSlider.value() * distMult + distBase;
      return dist(this.position.x, this.position.y, e.position.x, e.position.y) < d && angle < andleMult*QUARTER_PI && angle > -andleMult*QUARTER_PI;
    })
    super.flock(visibleBoids);
  }

  show() {
    super.show();
    const d = customSlider.value() * distMult + distBase;
    strokeWeight(1);
    stroke(128);
    const direction1 = this.velocity.copy();
    direction1.setMag(50);
    const direction2 = direction1.copy().rotate(andleMult*QUARTER_PI);
    direction1.rotate(-andleMult*QUARTER_PI);
    arc(this.position.x, this.position.y, 2*d, 2*d, direction1.heading(), direction2.heading(), PIE);
  }
}

class FollowGoalBoid extends Boid {
  follow() {
    if (mouseIsPressed) {
      return createVector(mouseX-this.position.x, mouseY-this.position.y).mult(dist(mouseX, this.position.x, mouseY, this.position.y) / 200).limit(1);
    } else {
      return createVector();
    }
  }

  flock(boids) {
    super.flock(boids);
    this.acceleration.add(this.follow().mult(customSlider.value()));
  }
}

const buffer = 10;
class ObstacleAvoidanceBoid extends Boid {
  avoid(obstacles) {
    const steering = createVector();

    for (let o of obstacles) {
      const d = dist(this.position.x, this.position.y, o.position.x, o.position.y);
      if (d <= o.size+buffer) {
        steering.add(createVector(this.position.x-o.position.x, this.position.y-o.position.y).setMag(o.size-d + buffer));
      } else if (d <= 2*(o.size+buffer)) {
        steering.add(createVector(this.position.x-o.position.x, this.position.y-o.position.y).setMag(20/(d-o.size)));
      }
    }

    return steering;
  }

  flock(boids) {
    super.flock(boids);
    this.acceleration.add(this.avoid(obstacles));
  }
}
