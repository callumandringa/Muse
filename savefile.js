
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        camera.position.set(0, 20, 0); // Set the initial camera position
        camera.lookAt(0, 0, 0); // Look at the center of the scene

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 600); // Set canvas size
        document.querySelector('.canvas-container').appendChild(renderer.domElement);

        // Load background texture  
        const textureLoader = new THREE.TextureLoader();
        const backgroundTexture = textureLoader.load('img/Screenshot 2024-05-27 140228.png');

        // Create background plane
        const bgGeometry = new THREE.PlaneGeometry(800, 600);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
        const backgroundPlane = new THREE.Mesh(bgGeometry, bgMaterial);
        backgroundPlane.position.z = -462; // Set the background plane behind other objects
        scene.add(backgroundPlane);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 200);
        pointLight.position.set(10, 40, 10);
        scene.add(pointLight);

        // Load GLTF model and set up custom animation
        const loader = new THREE.GLTFLoader();
        let mixer;
        let model;  
        loader.load('img/Diorama_blockout.gltf', (gltf) => {
            model = gltf.scene;
            model.position.set(1, 1, 1); // Set the starting position of the model
            scene.add(model);
            model.position.y = 10;
            model.position.x = -0.01;
            model.scale.set(0.5, 0.5, 0.5); // Adjust the scale if necessary

            // Set up the mixer
            mixer = new THREE.AnimationMixer(model);

            // Create custom animation
            const times = [0, 1, 2, 3]; // Keyframe times in seconds
            const values = [
                3, 1, 1,    // At time 0: position (8, 3, 3)
                -3, 1, 1,    // At time 1: position (-4, 3, 3)
                -4, -2, -2,    // At time 2: position (-4, -2, -2)
                0, -5, 0    // At time 3: position (0, 0, 0)
            ];

            const track = new THREE.VectorKeyframeTrack('.position', times, values);
            const clip = new THREE.AnimationClip('custom_animation', -1, [track]);

            // Create the action and play it
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce); // Only play the animation once
            action.clampWhenFinished = true; // Keep the last frame when finished
            action.play();

            // Listen for the animation to end
            action.finished.then(() => {
                // Set camera to top-down view after the animation finishes
                camera.position.set(0, 50, 0);
                camera.rotation.set(-Math.PI / 2, 0, 0);
            });
        });

        // Function to redirect to a different HTML page
        function redirectToDifferentPage() {
            // Redirect to the desired HTML page
            window.location.replace('engels.html');
        }

        // WebSocket setup
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = function(event) {
            const sensorValue = parseFloat(event.data);
            // Map sensor value to a suitable range for Three.js
            const mappedValue = THREE.MathUtils.mapLinear(sensorValue, 0, 1023, -5, 5);
            if (model) {
                model.position.x = mappedValue; // Update model position based on sensor value
            }

            // Check if the ball has stopped moving
            if (Math.abs(mappedValue) < 0.01) {
                // Ball has stopped moving, redirect to a different page
                redirectToDifferentPage();
            }
        };

        // Example: Assign onclick events to the dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.onclick = () => {
                // Redirect to different pages based on the dot clicked
                if (index === 0) {
                    redirectToDifferentPage('page1.html');
                } else if (index === 1) {
                    redirectToDifferentPage('page2.html');
                } else if (index === 2) {
                    redirectToDifferentPage('page3.html');
                } else if (index === 3) {
                    redirectToDifferentPage('engels.html');
                }
            };
        });

        // Render loop
        function animate() {
            requestAnimationFrame(animate);

            // Update controls
            controls.update();

            // Render the scene from the perspective of the camera
            renderer.render(scene, camera);
        }

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = 800 / 600;
            camera.updateProjectionMatrix();
            renderer.setSize(800, 600);
        });
   