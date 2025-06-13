import type { MetaFunction } from "@remix-run/node";

import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';

const ROAD_WIDTH = 100;
const points = [
	0, 0, 0,
	0, 1, 0,
	2, 1, 0,
	3, 2, 0
];

export const meta: MetaFunction = () => {
  return [
    { title: "Traffic Simulator" },
    { name: "description", content: "Welcome to Traffic Simulator Web App" },
  ];
};

function LineComponent() {
  const lineRef = React.useRef();
	const circleRef = React.useRef();

  useEffect(() => {
    const material = new LineMaterial({
      color: 0x000000,
      linewidth: 10, // width in world units, not pixels
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });

    const geometry = new LineGeometry();
    geometry.setPositions(points);

    const line = new Line2(geometry, material);
    line.computeLineDistances();

    lineRef.current.add(line);

		const circleGeometry = new THREE.CircleGeometry(0.2, 50);
		const circleMeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xf3fa32 });
		const circle = new THREE.Mesh(circleGeometry, circleMeshBasicMaterial);
		circleRef.current.add(circle);

  }, []);

	useFrame((state, delta) => {
		let cur = circleRef.current.position.y;
		circleRef.current.position.y = cur < 1 ? cur + delta : cur;
		return cur;
	});
  return <>
		<group ref={lineRef} />
		<group ref={circleRef} />
	</>;
}


export default function Index() {
  return (
    <div className="canvas-wrapper">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<LineComponent />
      </Canvas>
    </div>
  );
}
