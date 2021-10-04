function main() {
    /**
    * @type {HTMLCanvasElement} canvas
    */
    const canvas = document.getElementById('myCanvas');
 
   /**
    * @type {WebGLRenderingContext} gl
    */
    const context = canvas.getContext('webgl');
 
     var vertices = [
            ...ktm1_top,...ktm1_mid,...ktm1_bot, ...ktm1_photo,
            ...ktm2_top,...ktm2_mid,...ktm2_bot, ...ktm2_photo
         ];
    
     var posBuff = context.createBuffer();
     context.bindBuffer(context.ARRAY_BUFFER, posBuff);
     context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices),context.STATIC_DRAW);
     context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexShaderCode = `
	attribute vec2 a_position;
	attribute vec4 a_color;
	varying vec4 v_color;
	uniform mat4 u_transform;
	void main() {
		gl_Position = u_transform * vec4(a_position, 0, 1.00);
		v_color = a_color;
	}
`;
 
     var shader = context.createShader(context.VERTEX_SHADER);
     context.shaderSource(shader,vertexShaderCode);
     context.compileShader(shader);
 
     var fragment = `
     precision mediump float;
     varying vec4 v_color;
     void main() {
         gl_FragColor = v_color;
     }
 `;
 
     var fragshader = context.createShader(context.FRAGMENT_SHADER);
     context.shaderSource(fragshader,fragment);
     context.compileShader(fragshader);
 
     var prog = context.createProgram();
     context.attachShader(prog, shader);
     context.attachShader(prog, fragshader);
     context.linkProgram(prog);
     var colorLocation = context.getAttribLocation(prog, "a_color");
     console.log(colorLocation)

     let colorBuffer = context.createBuffer();
     context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
     context.bufferData(context.ARRAY_BUFFER, new Float32Array(color), context.STATIC_DRAW);
     context.vertexAttribPointer(colorLocation, 4, context.FLOAT, false, 0, 0);
     context.enableVertexAttribArray(colorLocation);

     context.bindBuffer(context.ARRAY_BUFFER, posBuff);
     var aPosition = context.getAttribLocation(prog,"a_position");
     context.vertexAttribPointer(aPosition,2,context.FLOAT,false,0,0);
     context.enableVertexAttribArray(aPosition)

    let dy = 0;
    let speed = 0.0172;
    function drawScene() {
        dy >= 0.5 ? speed = -speed : speed = speed;
        dy <= -1 ? speed = -speed : speed = speed;
        dy += speed;
        console.log(dy)
        
        context.useProgram(prog);
        const leftObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            -0.8, 0.0, 0.0, 1.0,
        ]
            
        const rightObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.2,  dy, 0.0, 1.0,
        ]
            
        context.clearColor(0.160, 0.156, 0.156, 1);
        context.clear(context.COLOR_BUFFER_BIT);

        const u_matrix = context.getUniformLocation(prog, 'u_transform');
        context.uniformMatrix4fv(u_matrix, false, rightObject);
        
        context.drawArrays(
            context.TRIANGLES, 
            0, 
            (ktm1_top.length + ktm1_bot.length + ktm1_mid.length + ktm1_photo.length)/2, 
        );
            
        context.uniformMatrix4fv(u_matrix, false, leftObject);
        context.drawArrays(
            context.TRIANGLES, 
            (ktm1_top.length + ktm1_bot.length + ktm1_mid.length + ktm1_photo.length)/2, 
            (ktm2_top.length + ktm2_bot.length + ktm2_mid.length + ktm2_photo.length)/2
        );
        requestAnimationFrame(drawScene);
    }

    drawScene();
 }