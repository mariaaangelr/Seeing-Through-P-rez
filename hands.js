let capture;

let videoDataLoaded = false;

let handsfree;

const circleSize = 5;

let isLoadedBothHands = false;
let isPosing = false;


const targetIndex = [4, 8, 12, 16, 20];


const shapeIndex = [4, 3, 2, 5, 6, 7, 8];

let img;

let imgPosX = 0;
let imgPosY = 0;
let imgSizeX = 0;
let imgSizeY = 0;

let frameCount = 0;
let isFrameCount = false;

function preload() {
  // fetch(`https://source.unsplash.com/random`).then((response) => {
  //   imgURL = response.url;
  //   img = loadImage(imgURL, waitForElement);
  // })
  console.log("hello")
  let imgURL="images/cruz.png";
  let imgURL2="images/color.png";
  let imgArray=[imgURL, imgURL2];
  myimg=random(imgArray);
  console.log(myimg);
  img = loadImage(myimg);
  console.log(img)
}


function setup() {
  capture = createCapture(VIDEO);


  capture.elt.onloadeddata = function () {
    videoDataLoaded = true;
    createCanvas(capture.width, capture.height);
  };

  capture.hide();

  handsfree = new Handsfree({
    showDebug: false,
    hands: true,
    maxNumHands: 2
  });

  handsfree.start();

  noStroke();
 
  console.log(img)
  let windowRatio = windowWidth / windowHeight;
  let imageRatio = img.width / img.height;
  if (windowRatio > imageRatio){img.resize(0,windowHeight-20)}
  else {img.resize(windowWidth-20,0)}
  image(img, 0,0);
}

function draw() {
  if(isFrameCount) {
    frameCount++;
  }

  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  push();
  drawHands();

  drawingContext.clip();

  if (isLoadedBothHands && isPosing) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(capture, 0, 0, width, height);
    pop();

    push();
    imageMode(CENTER);
    if (imgSizeX > imgSizeY) {
      image(img, imgPosX, imgPosY, imgSizeX, img.height * imgSizeX / img.width);
    } else {
      image(img, imgPosX, imgPosY, img.width * imgSizeY / img.height, imgSizeY);
    }
    pop();
  }
  pop();

}

function drawHands() {
  const hands = handsfree.data?.hands;

  
  if (!hands?.multiHandLandmarks) {
    isLoadedBothHands = false;
    return;
  }
  
  else if (!hands?.multiHandLandmarks[1]) {
    isLoadedBothHands = false;
    return;
  } else {
    isLoadedBothHands = true;
  }

  hands.multiHandLandmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {

        circle(width - landmark.x * width, landmark.y * height, circleSize);

    });
  });

  if (isLoadedBothHands) {
    const hand_0 = hands.multiHandLandmarks[0];
    const hand_1 = hands.multiHandLandmarks[1];

  
    let maxDist = dist(width - hand_0[8].x * width, hand_0[8].y * height,
      width - hand_0[7].x * width, hand_0[7].y * height);

   
    let targetDistA = dist(width - hand_0[8].x * width, hand_0[8].y * height,
      width - hand_1[4].x * width, hand_1[4].y * height);

   
    let targetDistB = dist(width - hand_0[4].x * width, hand_0[4].y * height,
      width - hand_1[8].x * width, hand_1[8].y * height);

    if (targetDistA < maxDist && targetDistB < maxDist) {
      isPosing = true;
      frameCount = 0;
      isFrameCount = false;

      
      if (hand_0[2].y < hand_1[2].y) {
        imgPosX = width - (hand_0[2].x + (hand_1[2].x - hand_0[2].x) / 2) * width;
        imgPosY = (hand_0[2].y + (hand_1[2].y - hand_0[2].y) / 2) * height;
      }
     
      else {
        imgPosX = width - (hand_1[2].x + (hand_0[2].x - hand_1[2].x) / 2) * width;
        imgPosY = (hand_1[2].y + (hand_0[2].y - hand_1[2].y) / 2) * height;
      }
    
      imgSizeX = abs((width - hand_0[2].x * width) - (width - hand_0[8].x * width));
      imgSizeY = abs((hand_0[2].y * height) - (hand_0[8].y * height));

      imgSizeX *= 1.25;
      imgSizeY *= 1.25;
    } else {
  
      if (isPosing && frameCount < 5) {
        setImage();
      }
      isPosing = false;
      return;
    }

    fill(0);
    beginShape();
    for (let j = 0; j < hands.multiHandLandmarks.length; j++) {
      for (let i = 0; i < shapeIndex.length; i++) {
        const x = width - hands.multiHandLandmarks[j][shapeIndex[i]].x * width;
        const y = hands.multiHandLandmarks[j][shapeIndex[i]].y * height;

        vertex(x, y);
      }
    }
    endShape(CLOSE);
  }

}

// function waitForElement() {
//   console.log("hi jay");
//   console.log(img)
//   let windowRatio = windowWidth / windowHeight;
//   let imageRatio = img.width / img.height;
//   // if (windowRatio > imageRatio){img.resize(0,windowHeight-20)}
//   // else {img.resize(windowWidth-20,0)}
//   image(img, 0,0);
// }

function setImage() {
  isFrameCount = true;
}