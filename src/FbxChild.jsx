import { Component } from 'react';
import { Scene, MeshPhongMaterial, AnimationMixer } from 'three';
import PropTypes from 'prop-types';
import FbxLoader from 'three-fbx-loader';

class FbxChild extends Component {
    constructor(props) {
        super(props);

        this.state = { loaded: false };
        this.mixers = [];
    }
    componentDidMount() {
        // basic material
        this.material = new MeshPhongMaterial({ color: 0x606070 });
        this.FbxLoader = new FbxLoader();
        // this.FbxLoader.load('./animatedChest_7_4.fbx', (object) => {
        this.FbxLoader.load('./SambaDancing.fbx', (object) => {
            // this.object = object.clone();
            this.object = object;
            this.setState(
                { loaded: true },
                () => {
                    // Call the on file load callback
                    this.props.onFileLoad();

                    // Set the scale of the grouped fbx
                    this.object.scale.set(this.props.scale, this.props.scale, this.props.scale);

                    // Assign a material to each of the children
                    this.object.children.forEach((child) => {
                        child.material = this.material; // eslint-disable-line
                    });

                    // Create a mixer and add ge tthe clips
                    this.object.mixer = new AnimationMixer(this.object);
                    this.mixers.push(this.object.mixer);
                    const clipAction = this.object.mixer.clipAction(this.object.animations[0]);
                    clipAction.play();

                    // this.object.mixer.clipAction(object.animations[0]).play();
                    window.console.log(this.object);

                    // this.clipaction = this.object.mixer.clipAction(object.animations[0]);
                    // if (this.clipaction) {
                    //     this.clipaction.setDuration(1).play();
                    // }

                    // Add the object group to the scene
                    this.props.scene.add(this.object);
                    this.added = true;
                }
            );
        });
    }

    componentWillUnmount() {
        this.props.scene.remove(this.object);
    }

    render() {
        if (this.state.loaded && this.added) {
            this.mixers.forEach((mixer) => {
                mixer.update(this.props.deltaSeconds);
            });
        }

        return false;
    }
}

FbxChild.propTypes = {
    scale: PropTypes.number,
    scene: PropTypes.shape(Scene).isRequired,
    onFileLoad: PropTypes.func,
    deltaSeconds: PropTypes.number
};

FbxChild.defaultProps = {
    onFileLoad: () => {},
    scale: 1,
    deltaSeconds: 0
};

export default FbxChild;
