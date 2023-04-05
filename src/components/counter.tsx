import type * as THREE from "three";
import { useState } from "react";
import { CameraControls, useGLTF } from "@react-three/drei";
import { Canvas, ThreeElements } from "@react-three/fiber";

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="w-full bg-red-300 h-screen">
      <button onClick={() => setCount(count + 1)}>Counter {count}</button>
      <Canvas>
        <CameraControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Corn position={[0, -0.5, -4.2]} scale={300} />
        <Shiba position={[0, -4, -6]} />
      </Canvas>
    </div>
  );
};

function Corn(props: ThreeElements["mesh"]) {
  const gltf = useGLTF("/models/corn.glb");

  return (
    <>
      <primitive object={gltf.scene} {...props} scale={0.1} />
    </>
  );
}

function Shiba(props: ThreeElements["mesh"]) {
  const gltf = useGLTF("/models/shiba.glb");

  return (
    <>
      <primitive object={gltf.scene} {...props} />
    </>
  );

  // return (
  //   <mesh
  //     {...props}
  //     ref={mesh}
  //     scale={active ? 1.5 : 1}
  //     onClick={(event) => setActive(!active)}
  //     onPointerOver={(event) => setHover(true)}
  //     onPointerOut={(event) => setHover(false)}
  //   >
  //     <boxGeometry args={[1, 1, 1]} />
  //     <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
  //   </mesh>
  // );
}

export default Counter;
