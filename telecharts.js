'use strict'
class Telecharts {
	constructor(element, data) {
		/* Colors */
		this.basisColor = '#6f6f6f';
		/* Sizes */
		this.zoomAreaHeight = 50;
		this.controlAreaHeight = 50;
		this.calculateCanvas(element.width, element.height);
		/* Prepare element to draw */
		this.context = element.getContext('2d');
		this.chartData = data;
		console.log(this);
		/* Draw charts and elements */
		this.draw();
	}

	/* Calculating positions and Areas */
	calculateCanvas(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.canvasCenterX = this.canvasWidth / 2;
		this.canvasCenterY = this.canvasHeight / 2;
		/* Chart draw area */
		this.drawArea = {
			sourceX: 0,
			sourceY: 0,
			destinationX: this.canvasWidth,
			destinationY: this.canvasHeight - (this.controlAreaHeight + this.zoomAreaHeight)
		};
		/* Zoom draw area */
		this.zoomArea = {
			sourceX: 0,
			sourceY: this.drawArea.destinationY,
			destinationX: this.canvasWidth,
			destinationY: this.drawArea.destinationY + this.zoomAreaHeight
		};
		/* Control draw area*/
		this.conrolArea = {
			sourceX: 0,
			sourceY: this.zoomArea.destinationY,
			destinationX: this.canvasWidth,
			destinationY: this.zoomArea.destinationY + this.controlAreaHeight
		};
	}

	draw() {
		let context = this;
		this.chartData.columns.forEach(function(column, columnKey){
			var color = ['red', 'green'];
			for (let [key, element] of column) {
				if (key == 'x') {
					context.drawBasis(column);
					break;
				} else {
					context.drawChart(column);
					break;
				}
			}
		});
	}

	drawBasis(column) {
		/* Draw down line */
		this.drawLine(
			this.drawArea.sourceX,
			this.drawArea.destinationY,
			this.drawArea.destinationX,
			this.drawArea.destinationY,
			0,5,
			this.basisColor
		);
		/* Draw center line */
		this.drawLine(
			this.canvasCenterX,
			this.drawArea.sourceY,
			this.canvasCenterX,
			this.drawArea.destinationY,
			0.5,
			this.basisColor
		);
		
	}

	drawChart(column, color) {
		let position = 0;
		let context = this;
		let prevX = 0;
		let prevY = this.drawArea.destinationY;
		column.forEach(function(element){
			if (Number.isInteger(element)) {
				position+=3;
				context.drawLine(prevX, prevY, position, context.drawArea.destinationY - element, 1, color);
				prevX = position;
				prevY = context.drawArea.destinationY - element;

			}
		});
	}

	drawText(text, positionX, positionY) {
		this.context.fillText(text, positionX, positionY);
	}


    drawLine(sourceX,sourceY,destnationX,destnationY, lineWidth = 1, color = false){
	  this.context.beginPath();
	  this.context.moveTo(sourceX, sourceY);
	  this.context.lineTo(destnationX, destnationY);
	  this.context.lineWidth = lineWidth;
	  if (color) {
	  	this.context.strokeStyle = color;
	  	this.context.fillStyle = color;
	  }
	  this.context.stroke();
	}

	
}