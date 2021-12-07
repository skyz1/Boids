const flock = [];
const obstacles = [];

let alignSlider, cohesionSlider, separationSlider, customSlider, customP, modeSelector;

function setup() {
  createCanvas(800, 400);

  alignSlider = createSlider(0, 2, 1, 0.02);
  alignSlider.position(10, 450);
  const alignP = createP('Alignment');
  alignP.style('font-size', '16px');
  alignP.style('font-family', 'Arial');
  alignP.position(15, 410);

  cohesionSlider = createSlider(0, 2, 1, 0.02);
  cohesionSlider.position(150, 450);
  const cohesionP = createP('Cohesion');
  cohesionP.style('font-size', '16px');
  cohesionP.style('font-family', 'Arial');
  cohesionP.position(155, 410);

  separationSlider = createSlider(0, 2, 1, 0.02);
  separationSlider.position(290, 450);
  const separationP = createP('Separation');
  separationP.style('font-size', '16px');
  separationP.style('font-family', 'Arial');
  separationP.position(295, 410);

  customSlider = createSlider(0, 2, 1, 0.02);
  customSlider.position(430, 450);
  customP = createP('');
  customP.style('font-size', '16px');
  customP.style('font-family', 'Arial');
  customP.position(435, 410);

  modeSelector = createSelect();
  modeSelector.position(10, 10);
  modeSelector.option('Default');
  modeSelector.option('Reduced perception');
  modeSelector.option('Follow a target');
  modeSelector.option('Avoid collisions');
  modeSelector.selected('Default');
  modeSelector.changed(modeChange);

  modeChange();
  angleMode(RADIANS);
}

function modeChange() {
  flock.length = 0
  obstacles.length = 0
  switch (modeSelector.value()) {
    case 'Reduced perception':
      customSlider.style('visibility', 'visible');
      customP.html('Eyesight');
      customP.style('visibility', 'visible');
      for (let i = 0; i < 50; i++) {
        flock.push(new ReducedPerceptionBoid());
      }
      break;
    case 'Follow a target':
      customSlider.style('visibility', 'visible');
      customP.html('Attraction');
      customP.style('visibility', 'visible');
      for (let i = 0; i < 100; i++) {
        flock.push(new FollowGoalBoid());
      }
      break;
    case 'Avoid collisions':
      customSlider.style('visibility', 'hidden');
      customP.style('visibility', 'hidden');
      for (let i = 0; i < 100; i++) {
        flock.push(new ObstacleAvoidanceBoid());
      }
      for (let i = 0; i < 30; i++) {
        obstacles.push(new Obstacle());
      }
      break;
    default:
      customSlider.style('visibility', 'hidden');
      customP.style('visibility', 'hidden');
      for (let i = 0; i < 100; i++) {
        flock.push(new Boid());
      }
      break;
  }
}

function draw() {
  background(51);
  noFill();
  for (let obstacle of obstacles) {
    obstacle.show();
  }
  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}
