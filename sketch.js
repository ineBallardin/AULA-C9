const PLAY = 1
const END = 0
let gameState = PLAY

let score

let trex, trexRunning, trexCollided
let ground, invisibleGround, groundImage
let cloud, cloudImage, cloudsGroup
let obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
let gameOver, gameOverImg, restart, restartImg

function preload()
{
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trexCollided = loadAnimation("trex_collided.png")

  cloudImage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png")

  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup()
{
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50)
  trex.addAnimation("running", trexRunning)
  trex.addAnimation("trex_collided", trexCollided)
  trex.scale = 0.5
  trex.debug = false

  ground = createSprite(200, 180, 600, 20)
  ground.addAnimation("ground", groundImage)
  ground.x = ground.width / 2

  invisibleGround = createSprite(200, 190, 400, 10)
  invisibleGround.visible = false

  gameOver = createSprite(300, 100)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5

  restart = createSprite(300, 140)
  restart.addImage(restartImg)
  restart.scale = 0.5

  obstacleGroup = new Group()
  cloudsGroup = new Group()

  score = 0

  edges = createEdgeSprites()
}

function draw()
{
  background(255)
  text(`Pontuação: ${score}`, 500, 50)

  if (gameState === PLAY)
  {
    gameOver.visible = false
    restart.visible = false

    ground.velocityX = -(4 + 3 * score/100)

    score += Math.round(getFrameRate()/60)

    if (ground.x < 0)
    {
      ground.x = ground.width / 2
    }
    if (keyDown("space") && trex.y >= 159)
    {
      trex.velocityY = -12
    }

    trex.velocityY += 0.8
    trex.collide(invisibleGround)
    
    spawnClouds()
    spawnObstacles()

    if (obstacleGroup.isTouching(trex)){
      gameState = END
    }
  } else if (gameState === END)
  {
    gameOver.visible = true
    restart.visible = true

    if (mousePressedOver(restart))
    {
      reset()
    }

    trex.changeAnimation("trex_collided", trexCollided)
    trex.velocityY = 0

    ground.velocityX = 0

    obstacleGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)

    cloudsGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-1)
  }

  drawSprites();
}

function spawnClouds()
{
  let r = Math.round(random(10, 140))
  if ((frameCount % 60) === 0)
  {
    cloud = createSprite(600, r, 40, 10)
    cloud.addImage(cloudImage)
    cloud.scale = 0.4
    cloud.velocityX = -(4 + 3 * score/100)
    cloud.lifetime = 200
    cloud.depth = trex.depth
    trex.depth += 1
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles()
{
  if (frameCount % 60 === 0)
  {
    let obstacle = createSprite(600, 170, 10, 40)
    obstacle.velocityX = -(4 + 3 * score/100)
    obstacle.lifetime = 300
    obstacle.scale = 0.35
    obstacleGroup.add(obstacle)

    let rand = Math.round(random(1, 6))
    switch(rand)
    {
      case 1: obstacle.addImage(obstacle1)
              break
      case 2: obstacle.addImage(obstacle2)
              break
      case 3: obstacle.addImage(obstacle3)
              break
      case 4: obstacle.addImage(obstacle4)
              break
      case 5: obstacle.addImage(obstacle5)
              break
      case 6: obstacle.addImage(obstacle6)
              break
      default: break
    }
  }
}

function reset()
{
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false

  score = 0

  obstacleGroup.destroyEach()
  cloudsGroup.destroyEach()

  trex.changeAnimation("running", trexRunning)
}