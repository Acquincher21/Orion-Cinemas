/* Displacement transitions for the landing page movie posters. */
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const vertexSource = `
        attribute vec2 position;
        varying vec2 uv;
        void main() {
            uv = position * 0.5 + 0.5;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    const fragmentSource = `
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D poster;
        uniform sampler2D image;
        uniform float progress;

        float randomValue(vec2 point) {
            return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 point) {
            vec2 cell = floor(point);
            vec2 fraction = fract(point);
            fraction = fraction * fraction * (3.0 - 2.0 * fraction);
            return mix(
                mix(randomValue(cell), randomValue(cell + vec2(1.0, 0.0)), fraction.x),
                mix(randomValue(cell + vec2(0.0, 1.0)), randomValue(cell + vec2(1.0, 1.0)), fraction.x),
                fraction.y
            );
        }

        void main() {
            vec2 field = vec2(
                noise(uv * 5.0) * 0.65 + noise(uv * 13.0) * 0.35,
                noise(uv * 5.0 + vec2(8.7, 3.2)) * 0.65 + noise(uv * 13.0 + vec2(2.4, 9.1)) * 0.35
            ) - 0.5;
            vec2 displacement = field * 0.3;
            vec4 fromColor = texture2D(poster, uv + displacement * progress);
            vec4 toColor = texture2D(image, uv - displacement * (1.0 - progress));
            gl_FragColor = mix(fromColor, toColor, progress);
        }
    `;

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Unable to load movie image: ${src}`));
            image.src = src;
        });
    }

    function createProgram(gl) {
        function compile(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const message = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(`Movie transition shader failed: ${message}`);
            }
            return shader;
        }

        const vertex = compile(gl.VERTEX_SHADER, vertexSource);
        const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
        const program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const message = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Movie transition program failed: ${message}`);
        }
        return program;
    }

    document.querySelectorAll('.movie-card[data-poster][data-hover-image]').forEach(card => {
        const back = card.querySelector('.card-back');
        const canvas = document.createElement('canvas');
        canvas.className = 'movie-transition-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.hidden = true;
        back.prepend(canvas);

        let images;
        let gl;
        let program;
        let textures;
        let progress = 0;
        let target = 0;
        let start = 0;
        let startTime = null;
        let frame = null;
        let failed = false;

        function initialize() {
            gl = canvas.getContext('webgl', { alpha: false });
            if (!gl) throw new Error('WebGL is unavailable');
            program = createProgram(gl);
            gl.useProgram(program);

            const vertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            const position = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            textures = [gl.createTexture(), gl.createTexture()];
            gl.uniform1i(gl.getUniformLocation(program, 'poster'), 0);
            gl.uniform1i(gl.getUniformLocation(program, 'image'), 1);
        }

        function prepareTextures() {
            const bounds = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(bounds.width * ratio));
            canvas.height = Math.max(1, Math.round(bounds.height * ratio));
            gl.viewport(0, 0, canvas.width, canvas.height);

            images.forEach((source, index) => {
                const surface = document.createElement('canvas');
                surface.width = canvas.width;
                surface.height = canvas.height;
                const ctx = surface.getContext('2d');
                if (!ctx) throw new Error('Unable to prepare movie transition images');
                const width = surface.width;
                const height = surface.height;
                ctx.fillStyle = '#060612';
                ctx.fillRect(0, 0, width, height);
                const scale = index === 0
                    ? height * 0.9 / source.height
                    : Math.max(width / source.width, height / source.height);
                const imageWidth = source.width * scale;
                const imageHeight = source.height * scale;
                ctx.drawImage(source, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                if (index === 0) {
                    gradient.addColorStop(0.62, 'rgba(0, 0, 0, 0)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.58)');
                } else {
                    gradient.addColorStop(0, 'rgba(6, 8, 15, 0.25)');
                    gradient.addColorStop(1, 'rgba(6, 8, 15, 0.82)');
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, textures[index]);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
            });
        }

        function animate(time) {
            if (startTime === null) startTime = time;
            const duration = (target === 1 ? 1600 : 1200) * Math.abs(target - start);
            const elapsed = Math.min(1, (time - startTime) / duration);
            const eased = elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed);
            progress = start + (target - start) * eased;
            gl.uniform1f(gl.getUniformLocation(program, 'progress'), progress);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            if (elapsed === 1) {
                frame = null;
                canvas.hidden = true;
            } else {
                frame = requestAnimationFrame(animate);
            }
        }

        function update() {
            const nextTarget = card.matches(':hover, :focus-within') ? 1 : 0;
            if (nextTarget === target && (frame !== null || progress === target)) return;
            target = nextTarget;
            if (!images || reducedMotion.matches || failed) return;
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
            start = progress;
            startTime = null;
            if (start === target) {
                canvas.hidden = true;
                return;
            }
            try {
                canvas.hidden = false;
                if (!gl) initialize();
                prepareTextures();
                frame = requestAnimationFrame(animate);
            } catch (error) {
                failed = true;
                canvas.hidden = true;
                console.error('Movie displacement transition unavailable; using the CSS fade.', error);
            }
        }

        card.addEventListener('mouseenter', update);
        card.addEventListener('mouseleave', update);
        card.addEventListener('focusin', update);
        card.addEventListener('focusout', () => requestAnimationFrame(update));
        reducedMotion.addEventListener('change', () => {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
            canvas.hidden = true;
            progress = card.matches(':hover, :focus-within') ? 1 : 0;
            target = progress;
        });
        canvas.addEventListener('webglcontextlost', event => {
            event.preventDefault();
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
            canvas.hidden = true;
            failed = true;
            console.error('Movie transition WebGL context was lost; using the CSS fade.');
        });

        Promise.all([loadImage(card.dataset.poster), loadImage(card.dataset.hoverImage)])
            .then(loaded => {
                images = loaded;
                update();
            })
            .catch(error => console.error('Movie transition images could not be loaded; using the CSS fade.', error));
    });
});
