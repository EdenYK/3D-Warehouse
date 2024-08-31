import * as THREE from "three";
import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Cylinder,
  MeshWobbleMaterial,
} from "@react-three/drei";
import { Geometry, Base, Subtraction } from "@react-three/csg";
import { Environment } from "./Environment";
import { structuredData } from "./constant";

// 定义基本几何形状
const box = new THREE.BoxGeometry();
const shelfBox = new THREE.BoxGeometry(0.1, 2, 0.1); // 支架
const shelfBoard = new THREE.BoxGeometry(2.2, 0.1, 1.5); // 架板
const wallGeometry = new THREE.BoxGeometry(30, 3, 0.1); // 墙壁的几何体
const floorGeometry = new THREE.PlaneGeometry(14, 14); // 地板的几何体
const windowGeometry = new THREE.BoxGeometry(2, 1, 0.1); // 窗户的几何体
const doorGeometry = new THREE.BoxGeometry(3, 2, 0.1); // 门的几何体
const goodsGeometry = new THREE.BoxGeometry(1, 0.5, 1); // 货物的几何体

// 货物组件
const Goods = (props) => {
  const { color = "#D2B48C" } = props;
  return (
    <mesh {...props} geometry={goodsGeometry}>
      <meshStandardMaterial color={color} /> {/* 货物颜色 */}
    </mesh>
  );
};

const Shelves = (props) => {
  const { shelveInfo } = props;
  return (
    <group {...props}>
      {/* 左侧支架，使用不同颜色 */}
      <mesh geometry={shelfBox} position={[-1, 0, 0]}>
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 右侧支架 */}
      <mesh geometry={shelfBox} position={[1, 0, 0]}>
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 架子的板 */}
      {shelveInfo.map((item, index) => {
        const _yAxis = -0.9 + index * 0.9;
        const _goodsyAxis = index === 0 ? -0.6 : index === 1 ? 0.3 : 1.2;
        return (
          <>
            <mesh geometry={shelfBoard} position={[0, _yAxis, 0]}>
              <meshStandardMaterial
                color="silver"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {item.currentLoad ? (
              <Goods color={item.color} position={[0, _goodsyAxis, 0]} />
            ) : null}
          </>
        );
      })}
    </group>
  );
};

const ShelvesGroup = (props) => {
  const { xAxis, zAxis, space, region, regionLabel } = props;

  useEffect(() => {
    console.log("structuredData==>", structuredData);
  }, []);

  return (
    <group {...props}>
      {region.map((item, index) =>
        item.shelves.map((itemInfo, indexInfo) => {
          const _xAxis = xAxis + indexInfo * space;
          const _zAxis = zAxis + index * -3;
          return (
            <>
              <Shelves
                key={indexInfo}
                shelveInfo={itemInfo}
                position={[_xAxis, -0.5, _zAxis]}
              />
            </>
          );
        })
      )}
    </group>
  );
};

const RegionLabel = ({ position, text, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 板子 */}
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial color="#808080" />
      </mesh>

      {/* 文字 */}
      <Text
        position={[0, 0.5, -0.24]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
      <Text
        position={[0, 0.5, -0.36]}
        rotation={[0, -Math.PI / 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>

      {/* 棍子 */}
      <mesh position={[0, -1, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 2.3, 32]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  );
};

const OfficeScene = ({ position }) => {
  return (
    <group position={position}>
      {/* 办公桌 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* 电脑 */}
      <mesh position={[0, 0.8, 0.7]}>
        <boxGeometry args={[0.8, 0.5, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* 电脑屏幕 */}
      <mesh position={[0, 1, 0.76]}>
        <boxGeometry args={[0.7, 0.4, 0.01]} />
        <meshStandardMaterial color="#0A84FF" />
      </mesh>
      {/* 键盘 */}
      <mesh position={[0, 0.6, -0.6]}>
        <boxGeometry args={[0.6, 0.05, 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* 鼠标 */}
      <mesh position={[-0.6, 0.6, -0.6]}>
        <boxGeometry args={[0.1, 0.05, 0.15]} />
        <meshStandardMaterial color="#777" />
      </mesh>

      {/* 文件 */}
      <mesh position={[-0.8, 0.6, 0.4]}>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>
      <mesh position={[-1.2, 0.6, 0.4]}>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>

      {/* 人的身体 */}
      <mesh position={[0, 0.4, -1.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.7, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* 人的头 */}
      <mesh position={[0, 0.9, -1.5]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* 人的腿 */}
      <mesh position={[-0.15, 0.1, -1.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.15, 0.1, -1.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* 椅子 */}
      <mesh position={[0, 0.2, -1.5]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* 椅子靠背 */}
      <mesh position={[0, 0.7, -2]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
    </group>
  );
};

// 简单的仓库管理员模型
const WarehouseWorker = ({ leftLegRef, rightLegRef }) => {
  return (
    <group>
      {/* 身体 */}
      <Box args={[0.5, 1, 0.3]} position={[0, 1.25, 0]}>
        <MeshWobbleMaterial color="blue" speed={1} factor={0.6} />
      </Box>

      {/* 头 */}
      <Cylinder args={[0.2, 0.2, 0.3]} position={[0, 1.8, 0]}>
        <MeshWobbleMaterial color="pink" speed={1} factor={0.6} />
      </Cylinder>

      {/* 手臂 */}
      <Box args={[0.2, 0.8, 0.2]} position={[-0.4, 1.25, 0]}>
        <MeshWobbleMaterial color="red" speed={1} factor={0.6} />
      </Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.4, 1.25, 0]}>
        <MeshWobbleMaterial color="red" speed={1} factor={0.6} />
      </Box>

      {/* 腿 */}
      <group>
        <Box args={[0.3, 1, 0.3]} position={[-0.2, 0.5, 0]} ref={leftLegRef}>
          <MeshWobbleMaterial color="green" speed={1} factor={0.6} />
        </Box>
        <Box args={[0.3, 1, 0.3]} position={[0.2, 0.5, 0]} ref={rightLegRef}>
          <MeshWobbleMaterial color="green" speed={1} factor={0.6} />
        </Box>
      </group>
    </group>
  );
};

// 动画组件
const MovingWorker = (props) => {
  const workerRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const [direction, setDirection] = useState(1);
  const [position, setPosition] = useState(0);
  const [legSwing, setLegSwing] = useState(0);

  useFrame(() => {
    if (workerRef.current) {
      const newPosition = position + direction * 0.02;
      if (newPosition > 5 || newPosition < -5) {
        setDirection(-direction);
      }
      setPosition(newPosition);
      workerRef.current.position.x = newPosition;

      // 更新腿部摆动
      setLegSwing((prevSwing) => prevSwing + direction * 0.1);
      if (leftLegRef.current && rightLegRef.current) {
        // 前后摆动
        const swing = Math.sin(legSwing) * 0.1;
        leftLegRef.current.position.z = swing; // 左腿
        rightLegRef.current.position.z = -swing; // 右腿
      }
    }
  });

  return (
    <group {...props} ref={workerRef}>
      <WarehouseWorker leftLegRef={leftLegRef} rightLegRef={rightLegRef} />
    </group>
  );
};

// 快递箱组件
const Parcel = ({ position }) => (
  <Box args={[0.5, 0.5, 0.5]} position={position}>
    <MeshWobbleMaterial color="orange" speed={1} factor={0.6} />
  </Box>
);

// 随机摆放并叠高快递箱组件
const StackedParcels = (props) => {
  const parcelPositions = [];
  const numParcels = 50; // 总快递箱数量
  const areaSize = 6; // 随机分布范围
  const maxHeight = 2; // 最大堆叠高度
  const spacing = 0.6; // 快递箱之间的间距

  for (let i = 0; i < numParcels; i++) {
    const x = Math.random() * areaSize - areaSize / 2;
    const z = Math.random() * areaSize - areaSize / 2;
    const y = Math.floor(Math.random() * maxHeight); // 随机高度
    parcelPositions.push([x, y * spacing + 0.25, z]); // 堆叠高度
  }

  return (
    <group {...props}>
      {parcelPositions.map((pos, index) => (
        <Parcel key={index} position={pos} />
      ))}
    </group>
  );
};

function WallWithWindowAndDoor(props) {
  const { position, rotation } = props;
  return (
    <mesh position={position} rotation={rotation}>
      <Geometry computeVertexNormals>
        {/* 墙壁的基本形状 */}
        <Base geometry={wallGeometry} />
        {/* 窗户开口 */}
        {/* <Subtraction geometry={windowGeometry} position={[0, 1, 0]} /> */}
        {/* 门开口 */}
        <Subtraction geometry={doorGeometry} position={[-11, -0.5, 0]} />
      </Geometry>
      <meshStandardMaterial color="#D3D3D3" /> {/* 墙壁颜色 */}
    </mesh>
  );
}

const Wall = (props) => {
  return (
    <group {...props}>
      {/* 地板 */}
      {/* <mesh
        geometry={floorGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
      >
        <meshStandardMaterial color="#gray" />
      </mesh> */}
      <mesh geometry={wallGeometry} position={[0, 0, -15]}>
        <meshStandardMaterial color="#D3D3D3" />
      </mesh>
      {/* 右侧墙壁 */}
      <mesh geometry={wallGeometry} position={[0, 0, 15]}>
        <meshStandardMaterial color="#D3D3D3" />
      </mesh>
      {/* 后侧墙壁 */}
      <WallWithWindowAndDoor
        rotation={[0, Math.PI / 2, 0]}
        position={[-15, 0, 0]}
      />
      {/* 前侧墙壁 */}
      <mesh
        geometry={wallGeometry}
        rotation={[0, Math.PI / 2, 0]}
        position={[15, 0, 0]}
      >
        <meshStandardMaterial color="#D3D3D3" />
      </mesh>
    </group>
  );
};

const RoadLines = (props) => {
  const {
    leftLength,
    rightLength,
    leftPosition,
    rightPosition,
    leftRotation,
    rightRotation,
  } = props;
  const roadLineMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#FFA500" }),
    []
  );

  return (
    <>
      {/* 左边线 */}
      <mesh position={leftPosition} rotation={leftRotation}>
        <planeGeometry args={[0.1, leftLength]} />
        <primitive object={roadLineMaterial} />
      </mesh>
      {/* 右边线 */}
      <mesh position={rightPosition} rotation={rightRotation}>
        <planeGeometry args={[0.1, rightLength]} />
        <primitive object={roadLineMaterial} />
      </mesh>
    </>
  );
};
const RoadArrows = (props) => {
  const { position, rotation } = props;
  const arrowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#FFA500" }),
    []
  );
  const arrowShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.5, 1);
    shape.lineTo(1, 0);
    shape.lineTo(0.75, 0);
    shape.lineTo(0.75, -1);
    shape.lineTo(0.25, -1);
    shape.lineTo(0.25, 0);
    shape.lineTo(0, 0);
    return shape;
  }, []);

  return (
    <>
      <mesh position={position} rotation={rotation}>
        <shapeGeometry args={[arrowShape]} />
        <primitive object={arrowMaterial} />
      </mesh>
    </>
  );
};

function Warehouse(props) {
  return (
    <group {...props}>
      <ShelvesGroup
        region={structuredData[0].cols}
        regionLabel={structuredData[0].region}
        xAxis={-13.8}
        zAxis={3}
        space={2}
        length={6}
      />
      <RegionLabel
        position={[-2.8, 0.9, 3.3]}
        rotation={[0, 0, 0]}
        text={structuredData[0].region}
      />
      <ShelvesGroup
        region={structuredData[1].cols}
        regionLabel={structuredData[1].region}
        xAxis={3.8}
        zAxis={3}
        space={2}
        length={6}
      />

      <RegionLabel
        position={[2.8, 0.9, 3.3]}
        rotation={[0, 0, 0]}
        text={structuredData[1].region}
      />
      <RoadLines
        leftLength={25}
        rightLength={25}
        leftPosition={[-1, -1.49, -2.5]}
        rightPosition={[1, -1.49, -2.5]}
        leftRotation={[-Math.PI / 2, 0, 0]}
        rightRotation={[-Math.PI / 2, 0, 0]}
      />
      <RoadLines
        leftLength={14}
        rightLength={16}
        leftPosition={[-8, -1.49, 10]}
        rightPosition={[-7, -1.49, 12]}
        leftRotation={[-Math.PI / 2, 0, Math.PI / 2]}
        rightRotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <RoadLines
        leftLength={14}
        rightLength={14}
        leftPosition={[8, -1.49, 10]}
        rightPosition={[8, -1.49, 12]}
        leftRotation={[-Math.PI / 2, 0, Math.PI / 2]}
        rightRotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      {/* 添加路线组件 */}
      <RoadArrows
        position={[-0.45, -1.49, -3]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <RoadArrows
        position={[-7, -1.49, 10.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OfficeScene
        position={[-13.5, -1.3, 7]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* <StackedParcels
        position={[-7, -1.5, 7]}
        rotation={[0, -Math.PI / 2, 0]}
      /> */}
      <MovingWorker
        position={[13.5, -1.5, 11]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      <Wall />
    </group>
  );
}

const ThreeBox = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="px-10 py-4 grid grid-cols-6 bg-#86ceeb">
        <div>未入库总数: 50</div>
        <div>今日已入库: 100</div>
        <div>今日已出库: 80</div>
        <div>问题单: 10</div>
        <div>库存总量: 1200</div>
        <div>库存周转率: 2.5</div>
        <div>待入库商品数量: 30</div>
        <div>待出库订单数量: 40</div>
        <div>退货商品数量: 15</div>
        <div>在途商品数量: 60</div>
        <div>拣货完成率: 95%</div>
        <div>订单处理时间: 2小时</div>
        <div>库存准确率: 99%</div>
        <div>发货延误率: 5%</div>
        <div>仓库利用率: 80%</div>
        <div>安全库存: 200</div>
        <div>商品损耗率: 1%</div>
        <div>采购计划量: 500</div>
      </div>
      <Canvas
        className="flex-1 w-full"
        shadows
        camera={{ position: [-10, 10, 10], fov: 35 }}
      >
        <color attach="background" args={["skyblue"]} />
        <Warehouse />

        <Environment />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ThreeBox;
