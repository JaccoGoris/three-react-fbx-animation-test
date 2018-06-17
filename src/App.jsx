import React, { Component } from 'react';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Group,
    AmbientLight,
    DirectionalLight,
    Vector3,
    Clock
} from 'three';

import FbxChild from './FbxChild';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { deltaSeconds: 0 };
        this.clock = new Clock();

        // Make scene
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.lights = new Group();
        this.lights.add(new AmbientLight(0x555555));
        const directional = new DirectionalLight(0xf0f0f0);
        directional.position.set(0, 1, 1).normalize();
        this.lights.add(directional);
        this.scene.add(this.lights);
        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(0xf5f5f5);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    componentDidMount() {
        // Move camera back
        this.camera.position.set(-1.5, 2, 3);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.mount.appendChild(this.renderer.domElement);
        this.start();
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    animate = () => {
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene = () => {
        this.setState({ deltaSeconds: this.clock.getDelta() }, () => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    render() {
        let childTest;
        if (this.scene) {
            childTest = <FbxChild scene={this.scene} onFileLoad={() => { console.log('file loaded'); }} scale={0.02} deltaSeconds={this.state.deltaSeconds} />;
        }

        return (
            <div className="App">
                <div
                    style={{ width: '400px', height: '400px' }}
                    ref={(mount) => { this.mount = mount; }}
                >
                    {childTest}
                </div>
            </div>
        );
    }
}

export default App;
