function init(){
	// Initialize canvas
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.addEventListener("click", ClickHandler, false)

	messageArea = document.getElementById("message_area");
	canvasBorder = new Rect(0, 0, canvas.width, canvas.height);

	// Reset everything
	if (mainAnimation){
		mainAnimation.stop();
	 }
	if (delayTimer) {
		clearTimeout(delayTimer);
	}
	currentDecimalExpansion = "0.";
	addNines = false;
	resetEverything();
	clearScreen();

	// Get inputs
	inputNumerator = document.getElementById("numerator").value;
	inputDenominator = document.getElementById("denominator").value;
	animationSpeed = 11 - document.getElementById("animation-speed").value;
	if (inputNumerator >= inputDenominator){
		inputNumerator = inputDenominator - 1;
		document.getElementById("numerator").value = inputDenominator - 1;
	}
	inputNumerator = clamp(inputNumerator, minNumerator, maxNumerator);
	inputDenominator = clamp(inputDenominator, minDenominator, maxDenominator);
	inputNumerator = Math.floor(inputNumerator);
	inputDenominator = Math.floor(inputDenominator);
	value = inputNumerator / inputDenominator;
	valuePosition = numberlineX + (value * numberlineWidth);

  // Initialize number line values
  currentLeftNumerator = 0;
	currentDenominator = 10;

	// Create drawings for intervals and main number line
  createStaticDrawings();
	createNumberlineTicks(primaryNumberlineTicks, 0, 10, numberlineX, numberlineWidth, numberlineEndpointFontSize, numberlineTickFontSize, color_Black);
	createValueTick();
	createRegionHighlight();
	createRegionChoice();
	createShorthandN();

	if (currentDecimalExpansion + String(value).charAt(Math.log10(currentDenominator) + 1)  == String(value)){
		drawAll();
		chooseNextInterval();
	} else {
		generateNextAnimation();
		drawAll();
		displayDecimalExpansion(false);
	}
}

function resetEverything(){
	// Animations
	clearTimeout(delayTimer);
	clearAllTimers();
	if (mainAnimation) {
		mainAnimation.stop();
	}
	if (highlightAnimation){
		highlightAnimation.stop();
	}
	mainAnimation = null;
	highlightAnimation = null;

	// Drawings
	primaryLineDrawing = new Drawing();
	regionDrawing = new Drawing();
	regionChoiceDrawing = new Drawing();
	primaryNumberlineTicks = new Drawing();
	newNumberline = new Drawing();
	valueTick = new Drawing();
	regionHighlight = new Drawing();
	shorthandN = new Drawing();

	// Other stuff
	messageArea.innerHTML = "Change the fraction at the top left or click START to begin.";
	animationStarted = false;
	awaitingInput = false;
	fromTheRight = true;
	var startButton = document.getElementById("start");
	startButton.disabled = false;
}

function drawAll(){
	// canvasBorder is a sometimes food
	canvasBorder.drawRect();

  primaryLineDrawing.draw();
  regionDrawing.draw();
  primaryNumberlineTicks.draw();
	newNumberline.draw();
	valueTick.draw();
	regionHighlight.draw();
	regionChoiceDrawing.draw();
	shorthandN.draw();
}

function startButtonPressed(){
	var button = document.getElementById("start");
	if (!animationStarted && !awaitingInput){
		animationStarted = true;
		generateNextAnimation();
		startAnimation()
		button.value = 'RESET';
		messageArea.innerHTML = "";
	} else {
		//location.reload();
		button.value = 'START';
		resetEverything();
		init();
	}
}

function changedNumber(){
	var button = document.getElementById("start")
	button.value = "START";
	resetEverything();
	init();
}

function changedSpeed(){
	animationSpeed = 11 - document.getElementById("animation-speed").value;
}

function startAnimation() {
	if (mainAnimation && highlightAnimation && !highlightAnimation.animationRunning && !mainAnimation.animationRunning && Math.log10(currentDenominator) <= maxNumberOfDigits){
		currentDecimalExpansion += String(nextInterval);
		if (Math.log10(currentDenominator) >= numberLineShortenFranctionsAt){
			shorthandN.hidden = false;
			shorthandN.components[0].changeString("n = " + currentDecimalExpansion.substring(2, currentDecimalExpansion.length) + "0");
		}
		this.fadedBlack = new Color(0, 0, 0, 0);
		for (i = 0; i < 4; i++){
			primaryNumberlineTicks.components[2 * nextInterval + i].hidden = true;
		}
		createNumberlineTicks(newNumberline, (currentLeftNumerator + nextInterval) * 10, currentDenominator * 10, numberlineX + (nextInterval * numberlineWidth / 10),numberlineWidth / 10, numberlineSmallFontSize, numberlineSmallFontSize, fadedBlack);
		highlightAnimation.start();  // mainAnimation is triggered at the end of highlightAnimation
	}
}

function calculateNextInterval(){
	if (fromTheRight){
		return Number(String(value).charAt(Math.log10(currentDenominator) + 1)) || 0;
	} else {
		if (addNines) {
			return 9;
		} else {
			 var expansionWithNextDigit = currentDecimalExpansion + String(value).charAt(Math.log10(currentDenominator) + 1) || 0;
			if (Number(expansionWithNextDigit) == value ){
				addNines = true;
				return Number(String(value).charAt(Math.log10(currentDenominator) + 1)) - 1;
			}
			else {
				return Number(String(value).charAt(Math.log10(currentDenominator) + 1)) || 0;
			}
		}
	}
}

function createStaticDrawings(){
    primaryLineDrawing.addComponents(
        new Line(numberlineX, numberlineY, numberlineX + numberlineWidth, numberlineY, numberlineThickness, numberlineColor)
    );

    regionDrawing.addComponents(
        new Line(numberlineX, regionY, numberlineX + numberlineWidth, regionY, regionThickness, regionColor)
    );
    for (var i = 0; i < 11; i++){
        var xPos = numberlineX + i * (numberlineWidth / 10);
        regionDrawing.addComponents(
            new Line(xPos, regionY - 1, xPos, regionY + regionTickHeight, regionThickness, regionColor)
        );
        if (i < 10){
            regionDrawing.addComponents(
                new TextString(i, xPos + (numberlineWidth / 20), regionY - regionLabelGap, regionFontSize + "px sans-serif", regionColor, "center")
            );
        }
    }
}

function createNumberlineTicks(numberline, startNumerator, denominator, position, width, endpointFontSize, tickFontSize, color){
	if (Math.log10(denominator) < numberLineShortenFranctionsAt + 1){
		// Left endpoint
		numberline.addComponents(
			new Line(position, numberlineY - numberlineEndpointHeight, position, numberlineY + numberlineEndpointHeight, numberlineThickness, color),
			new Fraction(startNumerator, denominator, position, numberlineY + numberlineEndpointLabelGap, endpointFontSize + "px sans-serif", color, numberlineFractionBarThickness)
		);
		// Middle points
		for(var i = 0; i < 9; i++){
			var xPos = position + (i + 1) * (width / 10);
			numberline.addComponents(
				new Line(xPos, numberlineY - numberlineTickHeight, xPos, numberlineY + numberlineTickHeight, numberlineTickThickness, color),
				new Fraction(startNumerator + i + 1, denominator, xPos, numberlineY + numberlineEndpointLabelGap, tickFontSize + "px sans-serif", color, numberlineFractionBarThickness)
			);
		}
		// Right endpoint
		numberline.addComponents(
			new Line(position + width, numberlineY - numberlineEndpointHeight, position + width, numberlineY + numberlineEndpointHeight, numberlineThickness, color),
			new Fraction(startNumerator + 10, denominator, position + width, numberlineY + numberlineEndpointLabelGap, endpointFontSize + "px sans-serif", color, numberlineFractionBarThickness)
		);
	} else {
		// Left endpoint
		numberline.addComponents(
			new Line(position, numberlineY - numberlineEndpointHeight, position, numberlineY + numberlineEndpointHeight, numberlineThickness, color),
			new ShortenedFraction(0, Math.log10(denominator), position, numberlineY + numberlineEndpointLabelGap, endpointFontSize + "px sans-serif", color, numberlineFractionBarThickness)
		);
		// Middle points
		for(var i = 0; i < 9; i++){
			var xPos = position + (i + 1) * (width / 10);
			numberline.addComponents(
				new Line(xPos, numberlineY - numberlineTickHeight, xPos, numberlineY + numberlineTickHeight, numberlineTickThickness, color),
				new ShortenedFraction(i + 1, Math.log10(denominator), xPos, numberlineY + numberlineEndpointLabelGap, tickFontSize + "px sans-serif", color, numberlineFractionBarThickness)
			);
		}
		// Right endpoint
		numberline.addComponents(
			new Line(position + width, numberlineY - numberlineEndpointHeight, position + width, numberlineY + numberlineEndpointHeight, numberlineThickness, color),
			new ShortenedFraction(10, Math.log10(denominator), position + width, numberlineY + numberlineEndpointLabelGap, endpointFontSize + "px sans-serif", color, numberlineFractionBarThickness)
		);
	}
}

function createValueTick(){
	var xPos = numberlineX + (value * numberlineWidth);
	valueTick.addComponents(
		new Line(xPos, numberlineY - numberlineValueTickHeight, xPos, numberlineY + numberlineValueTickHeight, numberlineValueThickness, valueColor),
		new Fraction(inputNumerator, inputDenominator, xPos, numberlineY + numberlineValueLabelGap, numberlineValueFontSize + "px sans-serif", valueColor, 1)
	);
}

function createRegionHighlight(){
	this.regionWidth = numberlineWidth / 10;
	this.color = new Color(regionHighlightColor.r, regionHighlightColor.g, regionHighlightColor.b, 0);

	regionHighlight.addComponents(
		new Line(numberlineX, regionY, numberlineX + this.regionWidth, regionY, 2*regionThickness, this.color),
		new Line(numberlineX, regionY - 3, numberlineX, regionY + regionTickHeight, 2*regionThickness, this.color),
		new Line(numberlineX + this.regionWidth, regionY - 3, numberlineX + this.regionWidth, regionY + regionTickHeight, 2*regionThickness, this.color),
		new TextString("0", numberlineX + (this.regionWidth / 2), regionY - regionLabelGap, regionFontSize + "px sans-serif", this.color, "center")
	);

}

function createRegionChoice(){
	var regionWidth = numberlineWidth / 10;
	var choicesColor = new Color(0, 200, 240, 1);
	regionChoiceDrawing.hidden = true;

	regionChoiceDrawing.addComponents(
		new Line(numberlineX, regionY, numberlineX + regionWidth, regionY, regionThickness, choicesColor),
		new Line(numberlineX + regionWidth, regionY, numberlineX + (2 * regionWidth), regionY, regionThickness, choicesColor),
		new Line(numberlineX, regionY, numberlineX, regionY + regionTickHeight, regionThickness, choicesColor),
		new Line(numberlineX + regionWidth, regionY, numberlineX + regionWidth, regionY + regionTickHeight, regionThickness, choicesColor),
		new Line(numberlineX + regionWidth, regionY, numberlineX + regionWidth, regionY + regionTickHeight, regionThickness, choicesColor),
		new Line(numberlineX + (2 * regionWidth), regionY, numberlineX + (2 * regionWidth), regionY + regionTickHeight, regionThickness, choicesColor),
		new TextString("0", numberlineX + (regionWidth / 2), regionY - regionLabelGap, regionFontSize + "px sans-serif", choicesColor, "center"),
		new TextString("1", numberlineX + (3 * regionWidth / 2), regionY - regionLabelGap, regionFontSize + "px sans-serif", choicesColor, "center")
	);

	regionChoiceDrawing.moveLeftChoiceTo = function(rightInterval){
		var regionWidth = numberlineWidth / 10;
		var xPos = numberlineX + (rightInterval - 1)*regionWidth;
		// Move drawings
		regionChoiceDrawing.components[0].moveTo(xPos, xPos + regionWidth);
		regionChoiceDrawing.components[1].moveTo(xPos + regionWidth, xPos + 2*regionWidth);
		regionChoiceDrawing.components[2].moveTo(xPos);
		regionChoiceDrawing.components[3].moveTo(xPos + regionWidth);
		regionChoiceDrawing.components[4].moveTo(xPos + regionWidth)
		regionChoiceDrawing.components[5].moveTo(xPos + 2*regionWidth);
		regionChoiceDrawing.components[6].moveTo(xPos + regionWidth/2);
		regionChoiceDrawing.components[7].moveTo(xPos + 3*regionWidth/2);
		// Relabel highlighted region
		regionChoiceDrawing.components[6].changeString(rightInterval - 1);
		regionChoiceDrawing.components[7].changeString(rightInterval);
	}

}

function createShorthandN(){
	shorthandN.addComponents(
		new TextString("n = ", shorthandNX, shorthandNY, shorthandNFontSize + "px sans-serif", new Color(0, 0, 0, 1))
	);
	shorthandN.hidden = true;
}

function displayDecimalExpansion(highlightNewDigit){
	ctx.beginPath();
	ctx.font = expansionFontSize + "px sans-serif";
	ctx.fillStyle = expansionColor.getRGBAString();
	ctx.textAlign = "left";
	if (highlightNewDigit){
		this.slicedExpansion = currentDecimalExpansion.slice(0,currentDecimalExpansion.length - 1);
		ctx.fillText(this.slicedExpansion, expansionX, expansionY);
		ctx.fillStyle = regionHighlightColor.getRGBAString();
		ctx.fillText(currentDecimalExpansion.charAt(currentDecimalExpansion.length - 1), expansionX + ctx.measureText(this.slicedExpansion).width, expansionY);
	} else {
		ctx.fillText(currentDecimalExpansion, expansionX, expansionY);
		ctx.stroke();
	}

}

function moveNumberlineTicks(numberline, startX, width){
	for (i = 0, end = numberline.components.length; i < end; i += 2){
		var tickPosition = startX + (i / 2) * (width / 10);
		if (tickPosition < numberlineX - 5  || tickPosition > numberlineX + numberlineWidth + 5){
			numberline.components[i].hidden = true;
			numberline.components[i+1].hidden = true;
		} else {
			numberline.components[i].moveTo(tickPosition);
			numberline.components[i+1].moveTo(tickPosition);
		}
	}
}

function moveValueTick(newX){
	valueTick.components[0].moveTo(newX);
	valueTick.components[1].moveTo(newX);
}

function generateNextAnimation(){
	nextInterval = calculateNextInterval();
	mainAnimation = new Animation(
	  animationSpeed,
	  function(){
			animationDelay();
		}
	);

	mainAnimation.addAnimationComponents(
		new ZoomInOnIntervalAnimation(500, primaryNumberlineTicks, numberlineX, -numberlineWidth * nextInterval + numberlineX, numberlineWidth, 10 * numberlineWidth),
		new ZoomInOnIntervalAnimation(500, newNumberline, numberlineX + (nextInterval * numberlineWidth / 10), numberlineX, numberlineWidth / 10, numberlineWidth),
		new AdjustValueAnimation(500),
		new ScaleFractionFontsAnimation(500, newNumberline, numberlineSmallFontSize, numberlineEndpointFontSize, numberlineSmallFontSize, numberlineTickFontSize)
	);

	highlightAnimation = new Animation(
		animationSpeed,
		function(){
			mainAnimation.start();
		}
	);

	highlightAnimation.addAnimationComponents(
		new HighlightRegionAnimation(200, nextInterval, regionHighlightColor)
	);
}

function chooseNextInterval(){
	var startButton = document.getElementById("start");
	startButton.disabled = true;

	var nextRightInterval = calculateNextInterval();
	var intervalWidth = numberlineWidth / 10;
	var xPosition = numberlineX + (nextRightInterval)*intervalWidth;
	awaitingInput = true;
	messageArea.innerHTML = "The number is in two different regions.  Choose one (both are correct)"
	regionChoiceDrawing.moveLeftChoiceTo(nextRightInterval);
	regionChoiceDrawing.hidden = false;
	regionChoiceDrawing.draw();
	rightRegion = new Rect(xPosition, regionY - 3*regionLabelGap, intervalWidth, 6*regionLabelGap);
	leftRegion = new Rect(xPosition - intervalWidth, regionY - 3*regionLabelGap, intervalWidth, 6*regionLabelGap);
}

function chooseNextIntervalComplete(){
	var startButton = document.getElementById("start");
	startButton.disabled = false;

	if (!animationStarted){
		var button = document.getElementById("start");
		animationStarted = true;
		button.value = 'Reset';
	}
	awaitingInput = false;
	regionSelected = true;
	messageArea.innerHTML = "";
	regionChoiceDrawing.hidden = true;
	generateNextAnimation();
	startAnimation();
	delayTimer = setTimeout(startAnimation, delayBetweenAnimations);
	timers.push(delayTimer);
}

function animationDelay(){
	currentLeftNumerator = (currentLeftNumerator + nextInterval) * 10;
	currentDenominator *= 10;
	regionHighlight.setAlpha(0);
	primaryNumberlineTicks = new Drawing();
	newNumberline = new Drawing();
	createNumberlineTicks(primaryNumberlineTicks, currentLeftNumerator, currentDenominator, numberlineX, numberlineWidth, numberlineEndpointFontSize, numberlineTickFontSize, color_Black);
	clearScreen();
	drawAll();
	displayDecimalExpansion(false);

	if (currentDecimalExpansion + String(value).charAt(Math.log10(currentDenominator) + 1)  == String(value) && !regionSelected){
		chooseNextInterval();
	} else {
		generateNextAnimation();
		delayTimer = setTimeout(startAnimation, delayBetweenAnimations);
		timers.push(delayTimer);
	}
}

// The following animation functions use the animation format from canvasdrawing.js
function ZoomInOnIntervalAnimation(numberOfFrames, numberline, startX, endX, startWidth, endWidth){
	this.numberline = numberline;
	this.numberOfFrames = numberOfFrames;
	this.startX = startX;
	this.endX = endX;
	this.startWidth = startWidth;
	this.endWidth = endWidth;
	this.currentFrame = 0;
	this.animationFinished = false;

	this.currentWidth = this.startWidth;
	this.currentPosition = this.startX;

	if (this.numberOfFrames > 0) {
		this.moveDelta = -(this.currentPosition - this.endX) / this.numberOfFrames;
		this.widthDelta = (this.endWidth - this.currentWidth) / this.numberOfFrames;
	}	else {
		this.moveDelta = 0;
		this.widthDelta = 0;
	}

	this.animate = function() {
		moveNumberlineTicks(numberline, this.currentPosition += this.moveDelta, this.currentWidth += this.widthDelta);
		clearScreen();
		drawAll();
		displayDecimalExpansion(true);

		this.currentFrame++;
		if (this.currentFrame > this.numberOfFrames) {
			this.animationFinished = true;
		}
	}

	this.reset = function() {
		this.currentFrame = 0;
		this.animationFinished = false;
	}

}

function AdjustValueAnimation(numberOfFrames){
	this.numberOfFrames = numberOfFrames;
	this.currentPosition = valueTick.components[0].x1;
	this.newLeftEndpoint = (currentLeftNumerator + nextInterval) / currentDenominator;
	this.valueOffsetFromLeft = (value - this.newLeftEndpoint) * numberlineWidth * currentDenominator;
	if (addNines){
		this.newPosition = numberlineX + numberlineWidth;
	} else {
		this.newPosition = numberlineX + this.valueOffsetFromLeft;
	}
	this.currentFrame = 0;
	this.animationFinished = false;

	if (this.numberOfFrames > 0) {
		this.moveDelta = -(this.currentPosition - this.newPosition) / this.numberOfFrames;
	}	else {
		this.moveDelta = 0;
	}

	this.animate = function(){
		this.currentFrame++;
		if (this.currentFrame < this.numberOfFrames){
			moveValueTick(this.currentPosition += this.moveDelta);
		} else {
			moveValueTick(this.newPosition);
		}
	}

	this.reset = function(){
		this.currentFrame = 0;
		this.animationFinished = false;
	}
}

function ScaleFractionFontsAnimation(numberOfFrames, numberline, startEndpointFontSize, endEndpointFontSize, startTickFontSize, endTickFontSize){
	this.numberOfFrames = numberOfFrames;
	this.numberline = numberline;
	this.startEndpointFontSize = startEndpointFontSize;
	this.endEndpointFontSize = endEndpointFontSize;
	this.startTickFontSize = startTickFontSize;
	this.endTickFontSize = endTickFontSize;
	this.currentFrame = 0;
	this.animationFinished = false;

	if (this.numberOfFrames > 0){
		this.endpointFontSizeDelta = (this.endEndpointFontSize - this.startEndpointFontSize) / this.numberOfFrames;
		this.tickFontSizeDelta = (this.endTickFontSize - this.startTickFontSize) / this.numberOfFrames;
	} else {
		this.endpointFontSizeDelta = 0;
		this.tickFontSizeDelta = 0;
	}

	this.animate = function(){
		numberline.components[1].addFontSize(this.endpointFontSizeDelta);
		for (i = 3, end = numberline.components.length - 2; i < end; i += 2){
			numberline.components[i].addFontSize(this.tickFontSizeDelta);
		}
		numberline.components[numberline.components.length - 1].addFontSize(this.endpointFontSizeDelta);

		this.currentFrame++;
		if (this.currentFrame > this.numberOfFrames){
			this.animationFinished = true;
		}
	}

	this.reset = function(){
		this.currentFrame = 0;
		this.animationFinished = false;
	}
}

function HighlightRegionAnimation(numberOfFrames, regionNumber, highlightColor){
	this.numberOfFrames = numberOfFrames;
	this.regionNumber = regionNumber;
	this.highlightColor = highlightColor;
	this.currentFrame = 0;
	this.animationFinished = false;

	this.position = numberlineX + this.regionNumber * (numberlineWidth / 10);
	regionHighlight.components[0].moveTo(this.position, this.position + regionWidth);
	regionHighlight.components[1].moveTo(this.position);
	regionHighlight.components[2].moveTo(this.position + regionWidth);
	regionHighlight.components[3].moveTo(this.position + (regionWidth / 2));
	regionHighlight.components[3].changeString(regionNumber);

	if (this.numberOfFrames > 0){
		this.fadeDelta = 1 / this.numberOfFrames;
	} else {
		this.fadeDelta = 0;
	}

	this.animate = function(){
		regionHighlight.components[0].addAlpha(this.fadeDelta);
		newNumberline.components[0].addAlpha(this.fadeDelta);
		clearScreen();
		drawAll();
		displayDecimalExpansion(true);
		this.currentFrame++;
		if (this.currentFrame > this.numberOfFrames){
			this.animationFinished = true;
		}
	}

	this.reset = function(){
		this.currentFrame = 0;
		this.animationFinished = false;
	}

}

// Event handlers

function ClickHandler(event){
    var canvasRect = canvas.getBoundingClientRect();
    var x = event.clientX - canvasRect.left;
    var y = event.clientY - canvasRect.top;

		if (awaitingInput){
			if (leftRegion.isPointInRect(x,y)){
				fromTheRight = false;
				chooseNextIntervalComplete();
			}
			if (rightRegion.isPointInRect(x,y)){
				fromTheRight = true;
				chooseNextIntervalComplete();
			}
		}

}

//// Helper Functions ////
function clearScreen(){
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
