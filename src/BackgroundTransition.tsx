import React, { RefObject, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Group, TextureLoader, Vector2 } from "three";
import gsap from "gsap";
import { ChromaticAberration, EffectComposer, Glitch, Bloom } from "@react-three/postprocessing";

function Config() {
  const state = useThree();
  state.camera.position.setZ(600);
  state.camera.far = 5000;
  state.camera.near = 1;

  return <></>;
}

function World(props: { setEffectParameters: (effectParameters: { glitchActive: boolean, chromaticAberration: boolean }) => void }) {

  const colorMap = useLoader(TextureLoader, "rocket1.jpg");
  const colorMap2 = useLoader(TextureLoader, "rocket2.jpg");
  const alphaMap = useLoader(TextureLoader, "mask-modified.jpg");
  const group1: RefObject<Group> = useRef() as RefObject<Group>;
  const group2: RefObject<Group> = useRef() as RefObject<Group>;
  useFrame((state) => {
    const mouseTarget = state.pointer.clone();
    mouseTarget.lerp(state.mouse, 0.1);
    if (group1.current) {
      group1.current.rotation.x = -mouseTarget.y * 0.1
      group1.current.rotation.y = mouseTarget.x * 0.1
    }
    if (group2.current) {
      group2.current.rotation.x = -mouseTarget.y * 0.1
      group2.current.rotation.y = mouseTarget.x * 0.1
    }
  })
  const state = useThree();

  function onClickLucy() {

    const timeline = gsap.timeline();

    timeline
      .to({}, {
        duration: 0.2,
        onStart: () => {
          props.setEffectParameters({ glitchActive: false, chromaticAberration: true });
        },
      })
      .to(state.camera.position, {
        duration: 0.4,
        x: 1920,
        ease: "power4.inOut",
        onStart: () => {
          props.setEffectParameters({ glitchActive: true, chromaticAberration: false });
        },
        onComplete: () => {
          props.setEffectParameters({ glitchActive: false, chromaticAberration: false });
        }
      })
  }

  function onClickDavid() {

    const timeline = gsap.timeline();


    timeline.to({}, {
      duration: 0.2,
      onStart: () => {
        props.setEffectParameters({ glitchActive: false, chromaticAberration: true });
      },
    }).to(state.camera.position, {
      duration: 0.4,
      x: 0,
      ease: "power4.inOut",
      onStart: () => {
        props.setEffectParameters({ glitchActive: true, chromaticAberration: false });
      },
      onComplete: () => {
        props.setEffectParameters({ glitchActive: false, chromaticAberration: false });
      }
    })
  }


  useFrame((state) => {
    if (group1.current) {
      group1.current.children.forEach((child, index) => {
        const newZ = (75 + Math.abs((Math.sin(state.clock.elapsedTime / 10)) * 25)) * index;
        child.position.setZ(newZ)
      })
    }

    if (group2.current) {
      group2.current.children.forEach((child, index) => {
        const newZ = (75 + Math.abs((Math.sin(state.clock.elapsedTime / 10)) * 25)) * index;
        child.position.setZ(newZ)
      })
    }
  })

  return <>
    <group ref={group1} position={[0, 0, 0]} onClick={onClickLucy}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap} />
      </mesh>
      <mesh position={[0, 0, 75]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 75 * 2]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 75 * 3]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>

    </group>
    <group ref={group2} position={[1920, 0, 0]} onClick={onClickDavid}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap2} />
      </mesh>
      <mesh position={[0, 0, 75]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap2} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 75 * 2]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap2} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 75 * 3]}>
        <planeGeometry args={[1920, 1080, 1, 1]} />
        <meshBasicMaterial map={colorMap2} alphaMap={alphaMap} transparent={true} opacity={0.8} />
      </mesh>
    </group>
  </>;
}

const BackgroundTransition = () => {
  const [effectParameters, setEffectParameters] = useState({
    glitchActive: false,
    chromaticAberration: false,
  })

  let effects;
  if (effectParameters.glitchActive) {
    effects = <Glitch active={effectParameters.glitchActive} delay={new Vector2(0, 0)} mode={3}></Glitch>
  } else if (effectParameters.chromaticAberration) {
    effects = <ChromaticAberration
      offset={new Vector2(0.3, 0.002)} // color offset
    />
  } else {
    effects = <></>
  }


  return (
    <Canvas>
      <Config />
      <World setEffectParameters={setEffectParameters} />
        <EffectComposer>
        {effects}
      </EffectComposer>
    </Canvas>

  );
}

export default BackgroundTransition;
