
(()=>{
    //Aliases
    var Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite;

    const GAME_WIDTH = 700, GAME_HEIGTH = 500;
    //Create the renderer
    var renderer = autoDetectRenderer(GAME_WIDTH, 500);//figures out whether to use the Canvas Drawing API or WebGL to render graphics

    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);

    //Create a container object called the `stage`
    var stage = new Container();//the root container

    renderer.backgroundColor = 0x22780F;
    console.log(renderer.view.width);
    //Tell the `renderer` to `render` the `stage`
    //renderer.render(stage);

    var title = new PIXI.Text("THE CUP GAME", {font:"45px Arial", fill:"white"});
    title.alpha = 0;
    stage.addChild(title);
    title.position.set(150, 5);

    var msg = new PIXI.Text("Press Start to see where the ball is", {font:"25px Arial", fill:"white"});
    stage.addChild(msg);
    msg.position.set(0.5*(GAME_WIDTH - msg.width), 360);

    //title.text = "Text changed!";
    createjs.Tween.get(title).to({alpha:1}, 1000).call(handleComplete);
    function handleComplete() {
        //Tween complete
    }


    //Use Pixi's built-in `loader` object to load an image
    loader
      .add("images/cup.png")
      .add("images/ball.png")
      .add("images/button.png")
      .load(setup);


    var cupContainer = [];
    var cup = [];
    var ball = [];
    var button, textBtn;
    var gameState = 0;
    var nbSwitchMax = 5;
    var nbSwitch = 0;
    var duration = 400;
    var difficulty = -1;
    var ballIndex;
    var difficultyLegend = ['VERY EASY',"EASY","NORMAL","HARD","VERY HARD","IMPOSSIBLE"];
    const CUP_Y = 220, CUP_DX = 170;


    //This `setup` function will run when the image has loaded
    function setup() {

      button = new Sprite(
        resources["images/button.png"].texture
      );
      button.x = 0.5*GAME_WIDTH - 0.5*button.width;
      button.y = 410;

      textBtn = new PIXI.Text("START", {font:"30px Arial", fill:"black"});
      button.addChild(textBtn);

      textBtn.x = 0.5*(button.width - textBtn.width);
      textBtn.y = 0.5*(button.height - textBtn.height);

      // buttonmode+interactive = acts like a button
      //button.buttonMode = true;
      //button.interactive = true;


      button.mousedown = button.touchstart = function(data){
        msg.text = "";

        if ( gameState === 0 ){
          initGame();

          //difficulty++;
          /*if ( difficulty <= 5 ){
            nbSwitchMax += 2;
            duration = duration > 200 ? duration-50 : duration;
          }else{
            difficulty = 0;
            nbSwitchMax = 2;
            duration = 500;
          }*/

          //$("#difficulty").text('Difficulty: '+difficultyLegend[difficulty]);
          //put a ball in a box
          ballIndex = getRandomInt(0,2);
          ball[ballIndex].visible = true;


          //$("#ball"+ballIndex).blink({delay: 100});
          createjs.Tween.get(cup[ballIndex]).to({y:-50}, 500)
          .wait(500)
          .to({y:0}, 500)
          .call(()=>{
            console.log("ok");
          });

          textBtn.text = 'Shuffle!';
          msg.text = 'Press the button again to shuffle the boxes';
          msg.position.set(0.5*(GAME_WIDTH - msg.width), 360);
          gameState++;

        }else if( gameState === 1 ){
            button.alpha = 0.5;
            notClickable(button);
            switchBox(duration,()=>{

              msg.text = 'Can you tell where the ball is ?';
              msg.position.set(0.5*(GAME_WIDTH - msg.width), 360);

              for(let i=0;i<3;i++){
                clickable(cupContainer[i]);
              }
              button.visible = false;
              notClickable(button);
              //button.visible = false;
              //button.buttonMode = false;

              gameState++;

            });

        }

      }



      //Create the cup and ball sprite from the texture
      for(let i=0;i<3;i++){

        cupContainer[i] = new Container();

        cup[i] = new Sprite(
            resources["images/cup.png"].texture
        );
        ball[i] = new Sprite(
            resources["images/ball.png"].texture
        );

        cupContainer[i].x = CUP_DX + CUP_DX*i;
        cupContainer[i].y = CUP_Y;
        cupContainer[i].mousedown = button.touchstart = function(data){
          console.log("clic on cup "+ i);
          if ( i === ballIndex ){
            //$("#ball"+ballIndex).show();

            //$("#startButton").show();
            msg.text = 'Well done ! Clic the button bellow to play again.';
            button.alpha = 1;
            msg.position.set(0.5*(GAME_WIDTH - msg.width), 360);
            createjs.Tween.get(cup[ballIndex]).to({y:-50}, 1000).call(()=>{
                button.visible = true;
                clickable(button);
                textBtn.text = "START";
            });

            gameState = 0;
            //initGame();
          }else{
            msg.text = 'Oups...the ball is not here !';
            msg.position.set(0.5*(GAME_WIDTH - msg.width), 360);
          }
        }

        ball[i].x = 0;
        ball[i].y = 0.5*(cup[i].height - ball[i].height);

        cup[i].anchor.x = 0.5;
        cup[i].anchor.y = 0.5;

        ball[i].anchor.x = 0.5;
        ball[i].anchor.y = 0.5;

        cupContainer[i].addChild(ball[i]);
        cupContainer[i].addChild(cup[i]);

        stage.addChild(cupContainer[i]);
        stage.addChild(button);

      }

      //cup[1].y = -50;
      //cup[1].width = 80;
      //cup[1].scale.set(0.5, 0.5);
      //cup[1].anchor.x = 0.5;
      //cup[1].anchor.y = 0.5;

      //stage.removeChild(cup[0]);
      //ball[1].visible = false;

      //Render the stage
      renderer.render(stage);

      initGame();

      //Start the game loop
      gameLoop();
    }




    function gameLoop() {

      //Loop this function at 60 frames per second
      requestAnimationFrame(gameLoop);

      //Update the current game state:
      state();
      //Render the stage to see the animation
      renderer.render(stage);
    }


    function play() {
      //Move the cat 1 pixel to the right each frame
      //cup[0].x += 1;

    }

    //Set the game's current state to `play`:
    var state = play;


    var initGame = ()=>{
        button.buttonMode = true;
        button.interactive = true;
        textBtn.text = "START";

        for(let i=0;i<3;i++){
            ball[i].visible = false;
            cup[i].buttonMode = true;
            cup[i].y = 0;
            cup[i].interactive = true;
            cupContainer[i].x = CUP_DX + CUP_DX*i;
            cupContainer[i].y = CUP_Y;
            notClickable(cupContainer[i]);
        }

        gameState = 0;
        //nbSwitchMax = 3;
        nbSwitch = 0
    }

    //Reverses the positions of two cup choosen randomly
    var switchBox = (duration, cb)=>{

        var idList = [0,1,2];

        shuffle(idList);

        var id1 = idList[0];
        var id2 = idList[1];

        var x1 = cupContainer[id1].x;
        var x2 = cupContainer[id2].x;

        createjs.Tween.get(cupContainer[id1]).to({x:x2}, duration);

        createjs.Tween.get(cupContainer[id2]).to({x:x1}, duration).call(()=>{
          nbSwitch++;
          if ( nbSwitch < nbSwitchMax ){
            setTimeout(()=>{
                switchBox(duration, cb);
            },100);
          }else{
            nbSwitch = 0;
            if ( cb ){ cb(); }
          }
        });

    }

    var CupClickable = function (element) {

        $(element).click(function (e) {
          var idElt = this.getAttribute('id');
          if ( idElt === "box"+ballIndex ){
            $("#ball"+ballIndex).show();
            $("#startButton").show();
            $("#message").text('Well done ! Clic the button bellow to play again.');
            $("#startButton").text('Start');
            gameState = 0;
            //initGame();
          }else{
            $("#message").text('Oups...the ball is not here !');
          }
        });
    };


    var clickable = function (element) {
        element.buttonMode = true;
        element.interactive = true;
    };
    var notClickable = function (element) {
        element.buttonMode = false;
        element.interactive = false;
    };
    //The `randomInt` helper function
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

})();