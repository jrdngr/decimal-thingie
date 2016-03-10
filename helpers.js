function Color(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.getRGBAString = function (){
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }
}

function Rect(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.isPointInRect = function(checkX, checkY) {
    if (checkX >= this.x && checkX <= this.x + this.width && checkY >= this.y && checkY <= this.y + this.height){
      return true;
    } else {
      return false;
    }
  }

  this.drawRect = function(thickness, color) {
    ctx.beginPath();
    ctx.lineWidth = thickness || 2;
    ctx.strokeStyle = color || "rgba(0, 0, 0, 1)";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }

}

function clamp(input, min, max){
	if (input < min)
		return min;
	else if (input > max)
		return max;
	else
		return input;
}

function log(value, base){
  if (value <= 0 || base <= 1){
    return NaN;
  } else {
    return Math.log(value) / Math.log(base);
  }
}

Array.prototype.swap = function(a, b){
	var temp = this[a];
	this[a] = this[b];
	this[b] = temp;
	return this;
}
