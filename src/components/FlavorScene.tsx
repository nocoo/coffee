import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { families, flavorGroups, flavors } from '../data/flavors';
import type { FamilyId, Theme } from '../data/types';

export interface SceneProps {
  family: FamilyId;
  flavor: string;
  rotation: number;
  zoom: number;
  onSelect: (id: string) => void;
  onFamily: (id: FamilyId) => void;
  onGroup: (id: string) => void;
  reduced: boolean;
  low: boolean;
  theme: Theme;
  visible: boolean;
  onReady?: () => void;
  onLost?: () => void;
}

function wedgeGeometry(inner: number, outer: number, start: number, end: number, low: boolean) {
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(start) * inner, Math.sin(start) * inner);
  shape.lineTo(Math.cos(start) * outer, Math.sin(start) * outer);
  shape.absarc(0, 0, outer, start, end, false);
  shape.lineTo(Math.cos(end) * inner, Math.sin(end) * inner);
  shape.absarc(0, 0, inner, end, start, true);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: low ? 1 : 3,
    steps: 1,
    bevelSize: 0.038,
    bevelThickness: 0.06,
    curveSegments: low ? 8 : 18,
  });
}

function Wedge({
  inner,
  outer,
  start,
  end,
  color,
  dim,
  selected,
  onClick,
  low,
  z = 0,
}: {
  inner: number;
  outer: number;
  start: number;
  end: number;
  color: string;
  dim: boolean;
  selected: boolean;
  onClick: () => void;
  low: boolean;
  z?: number;
}) {
  const geometry = useMemo(
    () => wedgeGeometry(inner, outer, start, end, low),
    [inner, outer, start, end, low],
  );
  const [hover, setHover] = useState(false);
  const surface = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color('#fff9ef'), dim ? 0.18 : hover ? 0 : 0.03),
    [color, dim, hover],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta < 6) onClick();
  };
  return (
    <mesh
      geometry={geometry}
      position={[0, 0, z + (selected ? 0.23 : hover ? 0.12 : 0)]}
      onClick={click}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <meshPhysicalMaterial
        color={surface}
        roughness={0.32}
        metalness={0.02}
        clearcoat={low ? 0 : 0.8}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}

function CeramicCup({ color, low }: { color: string; low: boolean }) {
  const points = useMemo(
    () => [
      new THREE.Vector2(0, -0.57),
      new THREE.Vector2(0.6, -0.57),
      new THREE.Vector2(0.73, -0.53),
      new THREE.Vector2(0.85, -0.4),
      new THREE.Vector2(1.09, 0.44),
      new THREE.Vector2(1.1, 0.57),
      new THREE.Vector2(1.05, 0.62),
      new THREE.Vector2(0.98, 0.57),
      new THREE.Vector2(0.83, -0.31),
      new THREE.Vector2(0.7, -0.41),
      new THREE.Vector2(0, -0.41),
    ],
    [],
  );
  return (
    <group rotation={[1.0, 0.1, -0.36]} position={[0, 0, 0.72]}>
      <mesh>
        <latheGeometry args={[points, low ? 32 : 64]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.24}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <mesh position={[1.1, 0.13, 0]} scale={[0.82, 1.05, 1]}>
        <torusGeometry args={[0.41, 0.135, 12, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[1.01, 1.01, 0.028, low ? 32 : 64]} />
        <meshPhysicalMaterial color="#613b2d" roughness={0.2} clearcoat={0.85} />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.97, 0.028, 8, 48]} />
        <meshStandardMaterial color="#b17b4d" roughness={0.5} />
      </mesh>
      <mesh position={[-0.32, 0.46, -0.35]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.45, 0.13, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#ead3ae" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function FlavorObjects({ family, low }: { family: FamilyId; low: boolean }) {
  const segments = low ? 16 : 28;
  if (family === 'floral')
    return (
      <group position={[2.7, 3.2, 0.8]} rotation={[0.1, 0.25, 0.2]} scale={0.55}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={`petal-${i}`}
            position={[Math.cos((i * Math.PI) / 3) * 0.55, Math.sin((i * Math.PI) / 3) * 0.55, 0]}
            scale={[0.55, 0.55, 0.22]}
          >
            <sphereGeometry args={[1, segments, segments]} />
            <meshPhysicalMaterial color="#e9cdeb" roughness={0.23} clearcoat={1} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.18]}>
          <sphereGeometry args={[0.27, segments, segments]} />
          <meshStandardMaterial color="#f4d88c" />
        </mesh>
      </group>
    );
  if (family === 'fruit')
    return (
      <group>
        <group position={[2.9, 3.1, 0.6]} rotation={[0.3, -0.2, -0.4]}>
          <mesh scale={[0.51, 0.62, 0.48]}>
            <sphereGeometry args={[1, segments, segments]} />
            <meshPhysicalMaterial color="#ef999f" roughness={0.35} clearcoat={0.5} />
          </mesh>
          <mesh position={[0, 0.63, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.035, 0.045, 0.23, 8]} />
            <meshStandardMaterial color="#65563c" />
          </mesh>
          <mesh position={[0.18, 0.6, 0.02]} rotation={[0.5, 0.1, -0.8]} scale={[0.28, 0.1, 0.12]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#809b68" />
          </mesh>
        </group>
        <group position={[-3.2, -2.55, 0.8]}>
          {(
            [
              [0, 0],
              [0.35, 0.24],
              [0.52, -0.16],
            ] as const
          ).map(([x, y], i) => (
            <mesh key={`berry-${x}-${y}`} position={[x, y, i * 0.04]}>
              <sphereGeometry args={[0.27, segments, segments]} />
              <meshPhysicalMaterial
                color={i % 2 ? '#8e88b4' : '#afa6d0'}
                roughness={0.43}
                clearcoat={0.4}
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  if (family === 'sweet')
    return (
      <group position={[2.8, 3.1, 0.7]} rotation={[0.35, 0.5, 0.5]}>
        <mesh>
          <torusGeometry args={[0.35, 0.2, 16, 32]} />
          <meshPhysicalMaterial color="#edc56c" roughness={0.17} clearcoat={1} />
        </mesh>
      </group>
    );
  if (family === 'green')
    return (
      <group position={[2.7, 3.1, 0.7]} rotation={[0.15, 0.3, -0.4]}>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.2, 0, 0]}
            scale={[0.23, 0.7, 0.12]}
            rotation={[0, 0, side * -0.4]}
          >
            <sphereGeometry args={[1, segments, segments]} />
            <meshStandardMaterial color={side === 1 ? '#99b47b' : '#bdcfa1'} roughness={0.5} />
          </mesh>
        ))}
      </group>
    );
  return (
    <group position={[2.8, 3.1, 0.7]} rotation={[0.2, 0.5, -0.5]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.16, 0, 0]} scale={[0.2, 0.48, 0.22]}>
          <sphereGeometry args={[1, segments, segments]} />
          <meshPhysicalMaterial
            color={family === 'spice' ? '#c78b62' : family === 'earth' ? '#9c9384' : '#ad8263'}
            roughness={0.38}
            clearcoat={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Wheel(props: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const { invalidate, camera, gl } = useThree();
  const animate = !props.reduced && !props.low && props.visible;
  useEffect(() => {
    if (!animate) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [animate, invalidate]);
  useEffect(() => {
    camera.zoom = props.zoom;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, props.zoom, invalidate]);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      props.onLost?.();
    };
    gl.domElement.addEventListener('webglcontextlost', lost);
    props.onReady?.();
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, props.onReady, props.onLost]);
  useFrame(({ clock }) => {
    if (root.current) {
      root.current.rotation.x = 0.27 + (animate ? Math.sin(clock.elapsedTime * 0.25) * 0.018 : 0);
      root.current.rotation.y = -0.19 + (animate ? Math.cos(clock.elapsedTime * 0.2) * 0.018 : 0);
      root.current.rotation.z = props.rotation;
    }
  });
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#fffefa', '#b69b88', 0.8]} />
      <directionalLight position={[-3, 6, 10]} intensity={2.5} color="#fff9f0" />
      <directionalLight position={[4, -3, 7]} intensity={1.2} color="#e4dbff" />
      <group ref={root} rotation={[0.27, -0.19, props.rotation]}>
        <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.74, 1.74, 0.1, 64]} />
          <meshStandardMaterial color="#ecdfd2" />
        </mesh>
        {families.map((family, index) => {
          const start = (index / 8) * Math.PI * 2 + Math.PI / 8;
          const span = Math.PI / 4;
          const groups = flavorGroups.filter((g) => g.family === family.id);
          const dim = props.family !== family.id;
          return (
            <group key={family.id}>
              <Wedge
                inner={1.88}
                outer={2.71}
                start={start + 0.024}
                end={start + span - 0.024}
                color={family.color}
                dim={dim}
                selected={!dim}
                onClick={() => props.onFamily(family.id)}
                low={props.low}
                z={0.05}
              />
              {groups.map((group, gi) => {
                const gs = start + (gi / groups.length) * span;
                const gspan = span / groups.length;
                const leaves = flavors.filter((flavor) => flavor.group === group.id);
                return (
                  <group key={group.id}>
                    <Wedge
                      inner={2.88}
                      outer={3.56}
                      start={gs + 0.018}
                      end={gs + gspan - 0.018}
                      color={family.color}
                      dim={dim}
                      selected={leaves.some((f) => f.id === props.flavor)}
                      onClick={() => props.onGroup(group.id)}
                      low={props.low}
                    />
                    {leaves.map((flavor, fi) => {
                      const fs = gs + (fi / leaves.length) * gspan;
                      return (
                        <Wedge
                          key={flavor.id}
                          inner={3.73}
                          outer={4.18}
                          start={fs + 0.009}
                          end={fs + gspan / leaves.length - 0.009}
                          color={family.color}
                          dim={dim}
                          selected={flavor.id === props.flavor}
                          onClick={() => props.onSelect(flavor.id)}
                          low={props.low}
                        />
                      );
                    })}
                  </group>
                );
              })}
            </group>
          );
        })}
        <CeramicCup
          color={
            props.theme === 'espresso'
              ? '#e9c8b1'
              : props.theme === 'terroir'
                ? '#d3ddbd'
                : '#f6ddd0'
          }
          low={props.low}
        />
        <FlavorObjects family={props.family} low={props.low} />
      </group>
    </>
  );
}

export default function FlavorScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 35, near: 0.1, far: 50 }}
      dpr={props.low ? 1 : [1, 1.5]}
      frameloop="demand"
      gl={{
        antialias: !props.low,
        alpha: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <Wheel {...props} />
    </Canvas>
  );
}
