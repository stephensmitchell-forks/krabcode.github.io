var mic;
var fft;
var spectrum;
		function windowResized() {
		  resizeCanvas(windowWidth, windowHeight);
		}

    var xRange = 100;
    var yRange = 4.;

    var xDetail = 10;
    var yDetail = 10;

    var markerStroke = .75;
    var lineStroke = 1.;
    var plotLineStroke = .8;
    var plotPointStroke = 1.;

    var lineStrokeW = 1;
    var markerStrokeW = 2;
    var plotLineStrokeW = 3;
    var plotPointStrokeW = 2;

    var plotPrecision = 512;


    var sideSmall    = 1080;  // smaller window axis length
    var sideSmallest = 1920/2;  /// bigger window axis length
    var sideBig      = 1920;  /// biggest window axis length

   function setup() {

        createCanvas(windowWidth, windowHeight);
        colorMode(HSB, 1, 1, 1, 1);
        rectMode(CENTER);
        ellipseMode(CENTER);
        textAlign(LEFT, CENTER);
        sideBig = max(width, height);
        sideSmall = min(width, height);
        sideSmallest = min(width, height)*2;

		 	 	fft = new p5.FFT();
		 	 	mic = new p5.AudioIn();
		 	 	fft.setInput(mic);
		 	 	mic.start();
    }

    function draw() {
				spectrum = fft.analyze();
        background(0);
        translate(width/2, height/2);
        //drawCoordinateGuide();
        plot();
    }

		//main graphing function
    function plot() {
         var lastX = 0;
         var lastY = 0;

				 var mod = .002;

         var modA = map(mouseX, width/2- sideSmallest /2, width/2+ sideSmallest /2, -yRange*mod, yRange*mod);
         var modB = map(mouseY, height/2- sideSmallest /2, height/2+ sideSmallest /2, yRange*mod, -yRange*mod);

				var a = fft.getEnergy("mid", "treble")*modA;
				var b = fft.getEnergy("bass")*modB;
        //edit eq to be same as y declaration
        var eq ="a = "+nf(a, 1, 2)+"\n"+
                "b = "+nf(b, 1, 2)+"\n"+
                "y = sin(x*a)*cos(x*b)";
        fill(.7);
        textSize(40);
      // text(eq, -sideSmall/2,-sideSmall/4);

        for (var i = 0; i < plotPrecision; i++) {

            var x = map(i, 0, plotPrecision, -xRange, xRange);

            // edit y to match eq
            var y = sin(x*a)*cos(x*b);
            //

            var canvasX = map(x, -xRange, xRange, -sideSmallest /2, sideSmallest /2);
            var canvasY = map(y, -yRange, yRange, -sideSmallest /2, sideSmallest /2)*-1;

            strokeWeight(plotPointStrokeW);
            point(canvasX, canvasY);
            if (i%2==0) {
                // fill(1);
                // textSize(20);
                //  text(nf(x,1,1)+", "+nf(y, 1, 1), canvasX+10, canvasY+10);
            }
            if (i > 0) { //need to wait one loop for lastX and lastY
		            stroke(1-map(abs(x), 0, xRange, 0, 1));
                strokeWeight(plotLineStrokeW);
                line(canvasX, canvasY, lastX, lastY);
            }
            lastX = canvasX;
            lastY = canvasY;
        }
    }

//do not touch
    function drawCoordinateGuide() {
        stroke(lineStroke);
        strokeWeight(lineStrokeW);
        fill(1);
        var markerSize = 20;
        line(0, -sideSmallest /2, 0, sideSmallest /2);
        for (var i = 0; i < yDetail; i++) {
            var val = (round(map(i, 0, yDetail, -yRange, yRange))*-1);
            var y = map(i, 0, yDetail, -sideSmallest /2, sideSmallest /2);
            if (i > 0 && val != 0 && i < yDetail) {
                stroke(markerStroke);
                strokeWeight(markerStrokeW);
                line(-markerSize, y, markerSize, y);
								stroke(markerStroke);
								fill(markerStroke);
                textSize(20);
                text(""+val, markerSize, y+markerSize);
            }
        }
        stroke(lineStroke);
        strokeWeight(lineStrokeW);
        line(-sideSmallest /2, 0, sideSmallest /2, 0);
        for (var i = 0; i < xDetail+1; i++) {
            var val = map(i, 0, xDetail, -xRange, xRange);
            var x = map(i, 0, xDetail, -sideSmallest /2, sideSmallest /2);
            if (i > 0 && val != 0 && i < xDetail) {
								stroke(markerStroke);
								fill(markerStroke);
                strokeWeight(markerStrokeW);
                line(x, -markerSize, x, markerSize);
                textSize(20);
                text(nf(val, 1, 2), x, markerSize*2);
            }
        }
				stroke(markerStroke);
				fill(markerStroke);
        textSize(40);
        text("x", -sideSmall /2+80, 80);
        text("y", 80, sideSmall /2-80);
    }
