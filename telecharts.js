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
		this.chartData.columns.forEach((column, columnKey) => {
			for (let [key, element] of column) {
				if (key == 'x') {
					this.drawBasis(column);
					break;
				} else {
					this.drawChart(column, this.chartData.colors[column[0]]);
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

	calculatePixelWeight (size, maxValue) {
		if (size > maxValue) {
			return size/maxValue;
		} else {
			return maxValue/size;
		}
	}

	drawChart(column, color) {

		column.shift();
		let step = this.calculatePixelWeight(this.canvasWidth, column.length);
		console.log(step);
		let position = 0;
		let prevX = 0;
		let prevY;
		this.weightInPixel = this.calculatePixelWeight(this.drawArea.destinationY - this.drawArea.sourceY, Math.max(...column));
		column.forEach((element) => {
			
			if (Number.isInteger(element)) {
				position+=step;
				this.drawLine(prevX, prevY, position, (this.drawArea.destinationY - element / this.weightInPixel), 2, color);
				prevX = position;
				prevY = this.drawArea.destinationY - element / this.weightInPixel;
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