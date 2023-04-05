import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import { ForwardedRef, Suspense, forwardRef, useRef, useState } from "react";
import * as THREE from "three";

const Maishond = () => {
  return (
    <Suspense fallback={null}>
      <Canvas>
        <MainShiba position={[0, 0, 0]} />
        <Env />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t to-pink-300 from-orange-600 pointer-events-none animate-fadein"></div>
    </Suspense>
  );
};

function Env() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -Math.sin(state.pointer.x / 4) * 9,
        1.25 + state.pointer.y,
        Math.cos(state.pointer.x / 4) * 9,
      ],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  const count = 120;
  const speed = 1;
  const depth = 10;
  const easing2 = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2));

  return (
    <>
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
      {Array.from({ length: count }, (_, i) => (
        <Hondje
          key={i}
          index={i}
          z={Math.round(easing2(i / count) * depth + 2)}
          speed={speed}
        />
      ))}
    </>
  );
}

function MainShiba(props: ThreeElements["mesh"]) {
  const ref = useRef<any>();
  useFrame((state) => {
    let degrees = getMouseDegrees(state.pointer.x, state.pointer.y, 10000);
    ref.current.rotation.y = THREE.MathUtils.degToRad(degrees.x - 90);
    ref.current.rotation.x = -THREE.MathUtils.degToRad(degrees.y) + 20;
  });

  return <ShibaNormal {...props} ref={ref} />;
}

function Hondje({
  index,
  z,
  speed,
}: {
  index: number;
  z: number;
  speed: number;
}) {
  const ref = useRef<any>();
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);

  const [data] = useState({
    y: THREE.MathUtils.randFloatSpread(height * 2),
    x: THREE.MathUtils.randFloatSpread(2),
    spin: THREE.MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state, dt) => {
    if (dt < 0.1)
      ref.current.position.set(
        index === 0 ? 0 : data.x * width,
        (data.y += dt * speed),
        -z
      );

    ref.current.rotation.set(
      (data.rX += dt / data.spin),
      Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
      (data.rZ += dt / data.spin)
    );

    if (data.y > height * (index === 0 ? 4 : 1))
      data.y = -(height * (index === 0 ? 4 : 1));
  });

  return <ShibaNormal ref={ref} />;
}

const ShibaNormal = forwardRef(
  (props: ThreeElements["mesh"], ref: ForwardedRef<any>) => {
    const { nodes: shibaNodes, materials: shibaMaterials } = useGLTF(
      "/models/shiba.glb"
    ) as any;
    const { nodes: cornNodes, materials: cornMaterials } = useGLTF(
      "/models/corn.glb"
    ) as any;

    return (
      <>
        <group ref={ref}>
          <mesh
            {...props}
            material={shibaMaterials.blinn1}
            geometry={shibaNodes.SK_Shiba001.geometry}
            rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
            scale={0.05}
          >
            <mesh
              geometry={cornNodes["11548_Ear_Of_Corn_Yellow_V2_l3_1"].geometry}
              material={cornMaterials["Ear_Of_Corn_Ear_C1"]}
              position={[0, 24, -68]}
              scale={[1.2, 2, 2]}
              rotation={[0, THREE.MathUtils.degToRad(-90), 0]}
            />
          </mesh>
        </group>
      </>
    );
  }
);

// genakt van een of andere tutorial
function getMouseDegrees(x: number, y: number, degreeLimit: number) {
  let dx = 0,
    dy = 0,
    xdiff,
    xPercentage,
    ydiff,
    yPercentage;

  let w = { x: window.innerWidth, y: window.innerHeight };

  // Left (Rotates neck left between 0 and -degreeLimit)

  // 1. If cursor is in the left half of screen
  if (x <= w.x / 2) {
    // 2. Get the difference between middle of screen and cursor position
    xdiff = w.x / 2 - x;
    // 3. Find the percentage of that difference (percentage toward edge of screen)
    xPercentage = (xdiff / (w.x / 2)) * 100;
    // 4. Convert that to a percentage of the maximum rotation we allow for the neck
    dx = ((degreeLimit * xPercentage) / 100) * -1;
  }
  // Right (Rotates neck right between 0 and degreeLimit)
  if (x >= w.x / 2) {
    xdiff = x - w.x / 2;
    xPercentage = (xdiff / (w.x / 2)) * 100;
    dx = (degreeLimit * xPercentage) / 100;
  }
  // Up (Rotates neck up between 0 and -degreeLimit)
  if (y <= w.y / 2) {
    ydiff = w.y / 2 - y;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    // Note that I cut degreeLimit in half when she looks up
    dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
  }

  // Down (Rotates neck down between 0 and degreeLimit)
  if (y >= w.y / 2) {
    ydiff = y - w.y / 2;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    dy = (degreeLimit * yPercentage) / 100;
  }
  return { x: dx, y: dy };
}

export default Maishond;
