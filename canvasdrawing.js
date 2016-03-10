var canvas;
var ctx;
var canvasObjects = [];
var timers = [];

function drawCanvas() {
	clearScreen();
	for (var i = 0, end = canvasObjects.length; i < end; i++){
		canvasObjects[i].draw();
	}
}

function clearScreen(){
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAllTimers(){
	for (i = 0, end = timers.length; i < end; i++){
		clearTimeout(timers[i]);
	}
	timers = [];
}

// Drawings

function Drawing(){
	this.components = [];
	this.hidden = false;

	this.addComponents = function (){
		for (var i = 0, end = arguments.length; i < end; i++){
			this.components.push(arguments[i]);
		}
	};

	this.draw = function (){
		if (!this.hidden){
			for (var i = 0, end = this.components.length; i < end; i++){
				this.components[i].draw();
			}
		}
	};

	this.move = function(moveX, moveY){
		for (var i = 0, end = this.components.length; i < end; i++){
			this.components[i].move(moveX, moveY);
		}
	};

	this.stretch = function(moveX, moveY){
		for (var i = 0, end = this.components.length; i < end; i++){
			this.components[i].stretch(moveX, moveY);
		}
	};

  this.addAlpha = function(alpha){
		for (var i = 0, end = this.components.length; i < end; i++){
			this.components[i].addAlpha(alpha);
		}
  };

	this.setAlpha = function(alpha){
		for (var i = 0, end = this.components.length; i < end; i++){
			this.components[i].setAlpha(alpha);
		}
	}

  this.changeColor = function(color){
		for (var i = 0, end = this.components.length; i < end; i++){
			this.components[i].changeColor(color);
		}
  };

}

function Line(x1, y1, x2, y2, thickness, color){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.thickness = thickness || 1;
	this.color = color || new Color(0, 0, 0, 1);
	this.hidden = false;

	this.draw = function (){
		if (!this.hidden){
			ctx.lineWidth = this.thickness;
			ctx.strokeStyle = this.color.getRGBAString();
			ctx.beginPath();
			ctx.moveTo(this.x1, this.y1);
			ctx.lineTo(this.x2, this.y2);
			ctx.stroke();
		}
	};

	this.moveTo = function(newX1, newX2, newY1, newY2){
		this.x1 = newX1;
		this.x2 = newX2 || newX1 || this.x2;
		this.y1 = newY1 || this.y1;
		this.y2 = newY2 || this.y2;
	}

	this.moveBy = function(moveX, moveY){
		this.x1 += moveX;
		this.x2 += moveX;
		this.y1 += moveY;
		this.y2 += moveY;
	};

	this.stretch = function(stretchX, stretchY){
		this.x2 += stretchX;
		this.y2 += stretchY;
	};

  this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

	this.setAlpha = function(alpha){
		this.color.a = alpha;
	}

  this.changeColor = function(color){
      this.color = color;
  };
}

function Rectangle(x, y, width, height, filled, thickness, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.filled = filled || false;
	this.thickness = thickness || 1;
	this.color = color || new Color(0, 0, 0, 1);
	this.hidden = false;

	this.draw = function (){
		if (!this.hidden){
			ctx.beginPath();
			ctx.lineWidth = this.thickness;
			ctx.strokeStyle = this.color.getRGBAString();
	    ctx.fillStyle = this.color.getRGBAString();
			if (filled){
				ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.stroke();
			} else {
				ctx.rect(this.x, this.y, this.width, this.height);
				ctx.stroke();
			}
		}
	};

	this.move = function(moveX, moveY){
		this.x += moveX;
		this.y += moveY;
	};

	this.stretch = function(stretchX, stretchY){
		this.width += stretchX;
		this.height += stretchY;
	};

  this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

  this.changeColor = function(color){
      this.color = color;
  };
}

function Circle(x, y, radius, filled, thickness, color){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.filled = filled || false;
	this.thickness = thickness || 1;
	this.color = color || new Color(0, 0, 0, 1);
	this.hidden = false;

	this.draw = function (){
		if (!this.hidden){
			ctx.beginPath();
			ctx.lineWidth = this.thickness;
			ctx.strokeStyle = this.color.getRGBAString();
	        ctx.fillStyle = this.color.getRGBAString();
			ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			if (filled){
				ctx.fill();
			}
			ctx.stroke();
		}
	};

	this.move = function(moveX, moveY){
		this.x += moveX;
		this.y += moveY;
	};

	this.stretch = function(stretchR){
		this.radius += stretchR;
	};

  this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

  this.changeColor = function(color){
      this.color = color;
  };
}

function TextString(str, x, y, font, color, alignment){
	this.str = str;
	this.x = x;
	this.y = y;
	this.font = font || "20px sans-serif";
	this.color = color || new Color(0, 0, 0, 1);
	this.alignment = alignment || "center";
	this.hidden = false;

	this.draw = function(){
		if (!this.hidden){
			ctx.beginPath();
			ctx.font = this.font;
	    ctx.fillStyle = this.color.getRGBAString();
			ctx.textAlign = this.alignment;
			ctx.fillText(this.str, this.x, this.y);
			ctx.stroke();
		}
	};

	this.moveTo = function(moveX, moveY){
		this.x = moveX;
		this.y = moveY || this.y;
	};

	this.changeString = function(newStr){
		this.str = newStr;
	}

	this.stretch = function(stretchX, stretchY){
		console.log("I don't know how to stretch!");
	}

  this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

	this.setAlpha = function(alpha){
		this.color.a = alpha;
	}

  this.changeColor = function(color){
      this.color = color;
  };
}

function Fraction(numerator, denominator, x, y, font, color, barThickness){
	this.numerator = numerator;
	this.denominator = denominator;
	this.x = x;
	this.y = y;
	this.font = font || "20px sans-serif";
	this.color = color || new Color(0, 0, 0, 1);
	this.barThickness = barThickness || 2;
	this.hidden = false;
	//Calulate width of fraction bar

	this.draw = function() {
		if (!this.hidden){
			// Initialize
			this.fontSize = this.font.substring(0, this.font.indexOf("px"));
			this.barOffset = this.fontSize / 9;
			ctx.beginPath();
			ctx.font = this.font;
			ctx.fillStyle = this.color.getRGBAString();
			ctx.textAlign = "center";
			ctx.lineWidth = this.barThickness;
			this.barWidth = Math.max(ctx.measureText(numerator).width, ctx.measureText(denominator).width) / 2;
			// Draw
			ctx.fillText(this.numerator, this.x, this.y);
			ctx.fillText(this.denominator, this.x, this.y + Number(this.fontSize));
			ctx.moveTo(this.x - this.barWidth, this.y + this.barOffset);
			ctx.lineTo(this.x + this.barWidth, this.y + this.barOffset);
			ctx.stroke();
		}
	}

	this.newValue = function(newNumerator, newDenominator) {
		this.numerator = newNumerator;
		this.denominator = newDenominator;
	}

	this.moveTo = function(newX, newY){
		this.x = newX || this.x;
		this.y = newY || this.y;
	}

	this.moveBy = function(moveX, moveY){
		this.x += moveX;
		this.y += moveY;
	}

	this.addFontSize = function(newFontSize){
		this.font = Number(this.fontSize) + Number(newFontSize) + "px sans-serif";
		this.fontSize += Number(newFontSize);
	}

	this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

	this.setAlpha = function(alpha){
		this.color.a = alpha;
	}

  this.changeColor = function(color){
      this.color = color;
  };

}

function ShortenedFraction(numeratorOffset, denominatorExponent, x, y, font, color, barThickness){
	this.numeratorOffset = numeratorOffset;
	this.denominatorExponent = denominatorExponent;
	this.x = x;
	this.y = y;
	this.font = font || "20px sans-serif";
	this.color = color || new Color(0, 0, 0, 1);
	this.barThickness = barThickness || 2;
	this.hidden = false;
	//Calulate width of fraction bar

	this.draw = function() {
		if (!this.hidden){
			// Initialize
			this.fontSize = this.font.substring(0, this.font.indexOf("px"));
			this.exponentFontSize = this.fontSize * 0.70;
			this.barWidth = 20;
			this.barOffset = (this.fontSize / 9) + 2;
			ctx.beginPath();
			ctx.font = this.font;
			ctx.fillStyle = this.color.getRGBAString();
			ctx.textAlign = "center";
			ctx.lineWidth = this.barThickness;
			// Draw
			if (this.numeratorOffset == 0){
				ctx.fillText("n", this.x, this.y);
				this.barWidth = ctx.measureText("108").width / 2;
			} else {
				ctx.fillText("n+" + this.numeratorOffset, this.x, this.y);
				this.barWidth = ctx.measureText("n+" + this.numeratorOffset).width / 2;
			}
			ctx.fillText("10", this.x, this.y + Number(this.fontSize) + 5);
			ctx.textAlign = "left";
			ctx.font = this.exponentFontSize + this.font.substring(this.font.indexOf("px"), this.font.length - 1);
			ctx.fillText(this.denominatorExponent, this.x + ctx.measureText("10").width, this.y + Number(this.exponentFontSize) + 5);

			ctx.moveTo(this.x - this.barWidth, this.y + this.barOffset);
			ctx.lineTo(this.x + this.barWidth, this.y + this.barOffset);
			ctx.stroke();
		}
	}

	this.newValue = function(newNumerator, newDenominator) {
		this.numerator = newNumerator;
		this.denominator = newDenominator;
	}

	this.moveTo = function(newX, newY){
		this.x = newX || this.x;
		this.y = newY || this.y;
	}

	this.moveBy = function(moveX, moveY){
		this.x += moveX;
		this.y += moveY;
	}

	this.addFontSize = function(newFontSize){
		this.font = Number(this.fontSize) + Number(newFontSize) + "px sans-serif";
		this.fontSize += Number(newFontSize);
	}

	this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

	this.setAlpha = function(alpha){
		this.color.a = alpha;
	}

  this.changeColor = function(color){
      this.color = color;
  };

}

function NumberWithExponent(base, exponent, x, y, font, color, exponentFontSizeMultiplier, exponentYOffset){
	this.base = base;
	this.exponent = exponent;
	this.x = x;
	this.y = y;
	this.font = font || "20px sans-serif";
	this.color = color || new Color(0, 0, 0, 1);
	this.exponentFontSizeMultiplier = exponentFontSizeMultiplier || 0.65;
	this.hidden = false;

	this.fontSize = Number(this.font.substring(0, this.font.indexOf("px")));
	this.exponentYOffset = Number(exponentYOffset) || this.fontSize * 0.45;
	this.exponentFontSize = this.fontSize * this.exponentFontSizeMultiplier;


	this.draw = function (){
		if (!this.hidden){
			ctx.beginPath();
			// Base
			ctx.font = this.font;
	    ctx.fillStyle = this.color.getRGBAString();
			ctx.textAlign = "center";
			ctx.fillText(this.base, this.x, this.y);
			// Exponent
			ctx.font = this.exponentFontSize + this.font.substring(this.font.indexOf("px"), this.font.length - 1);
			ctx.fillText(this.exponent, this.x + ctx.measureText(this.base).width + (Math.log(this.fontSize) / Math.log(5)), this.y - this.exponentYOffset);
			ctx.stroke();
		}
	}

	this.moveTo = function(newX, newY){
		this.x = newX;
		this.y = newY;
	}

	this.moveBy = function(xAmount, yAmount){
		this.x += xAmount;
		this.y += yAmount;
	}

	this.addFontSize = function(newFontSize){
		this.baseFontSize += Number(newFontSize);
		this.exponentFontSize += Number(newFontSize);
		this.baseFont = this.baseFontSize + "px sans-serif";
		this.exponentFont = this.exponentFontSize + "px sans-serif";
	}

	this.addAlpha = function(alpha){
      this.color.a += alpha;
  };

	this.setAlpha = function(alpha){
		this.color.a = alpha;
	}

  this.changeColor = function(color){
      this.color = color;
  };

}

// Animations

function Animation(msPerFrame, callWhenFinished){
	this.msPerFrame = msPerFrame;
	this.callWhenFinished = callWhenFinished;
	this.animationComponents = [];
	this.unfinishedAnimations = 0;
	this.animationRunning = false;
  this.nextAnimation = null;
	this.timer = null;

	this.addAnimationComponents = function(){
		for (var i = 0, end = arguments.length; i < end; i++){
			this.animationComponents.push(arguments[i]);
			this.unfinishedAnimations++;
		}
	};

	this.animate = function(){
		for (var i = 0, end = this.animationComponents.length; i < end; i++){
			if (this.animationComponents[i].animationFinished){
				this.unfinishedAnimations--;
			} else {
				this.animationComponents[i].animate();
			}
		}

		if (this.unfinishedAnimations <= 0){
			this.stop();
		}
	};

	this.start = function(){
		this.timer = setInterval(this.animate.bind(this), msPerFrame);
		timers.push(this.timer);
		this.animationRunning = true;
	};

	this.stop = function(){
		this.animationRunning = false;
		clearTimeout(this.timer);
		this.reset();
		if (callWhenFinished){
			callWhenFinished.call();
		}
    if (this.nextAnimation){
        this.nextAnimation.start();
    }
	};

	this.reset = function(){
		for (var i = 0, end = this.animationComponents.length; i < end; i++){
			this.animationComponents[i].reset();
		}
	}
}

function MoveAnimation(object, numberOfFrames, moveX, moveY){
	this.numberOfFrames = numberOfFrames;
	this.currentFrame = 0;
	this.animationFinished = false;

	if (this.numberOfFrames > 0) {
		this.xDelta = moveX / numberOfFrames;
		this.yDelta = moveY / numberOfFrames;
	}	else {
		this.xDelta = 0;
		this.yDelta = 0;
	}

	this.animate = function(){
		object.move(this.xDelta, this.yDelta);
		this.currentFrame++;
		if (this.currentFrame > this.numberOfFrames){
			this.animationFinished = true;
		}
	};

	this.reset = function(){
		this.currentFrame = 0;
		this.animationFinished = false;
	}
}

function FadeAnimation(object, numberOfFrames, startAlpha, endAlpha){
    this.numberOfFrames = numberOfFrames;
    this.startAlpha = startAlpha;
    this.endAlpha = endAlpha;
    this.currentFrame = 0;
    this.animationFinished = false;

	if (this.numberOfFrames > 0) {
		this.alphaDelta = (this.endAlpha - this.startAlpha) / this.numberOfFrames;
	}	else {
		this.alphaDelta = 0;
	}

	this.animate = function(){
		object.addAlpha(this.alphaDelta);
		this.currentFrame++;
		if (this.currentFrame > this.numberOfFrames){
			this.animationFinished = true;
		}
	};

	this.reset = function(){
		this.currentFrame = 0;
		this.animationFinished = false;
	}

}

function ScaleFontAnimation(object, numberOfFrames, startFontSize, endFontSize){
	this.numberOfFrames = numberOfFrames;
	this.startFontSize = startFontSize;
	this.endFontSize = endFontSize;
	this.currentFrame = 0;
	this.animationFinished = false;

	if (this.numberOfFrames > 0){
		this.fontSizeDelta = (this.endFontSize - this.startFontSize) / this.numberOfFrames;
	} else {
		this.fontSizeDelta = 0;
	}

	this.animate = function(){
		object.addFontSize(this.fontSizeDelta);
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

// Interaction

function ClickableArea(x, y, width, height, triggerFunction){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.triggerFunction = triggerFunction;

	this.trigger = function(){
		this.triggerFunction.call();
	}
}
