import { Environment, useGLTF } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { ForwardedRef, Suspense, forwardRef, useRef, useState } from "react";
import * as THREE from "three";

const Maishond = () => {
  return (
    <>
      <div
        role="status"
        className="absolute inset-0 grid justify-center items-center"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-white/50 animate-spin  fill-pink-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
      <Suspense fallback={null}>
        <div className="z-10 absolute inset-0 bg-gradient-to-t to-pink-300 from-orange-600 pointer-events-none"></div>
        <div className="absolute inset-0 z-20">
          <Canvas>
            <MainShiba position={[0, 0, 0]} />
            <Env />
          </Canvas>
        </div>
        <div className="z-30 absolute inset-0 bg-gradient-to-t to-pink-300 from-orange-600 pointer-events-none animate-fadein"></div>
      </Suspense>
    </>
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
