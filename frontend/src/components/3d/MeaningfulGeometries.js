import * as THREE from 'three'

class MeaningfulGeometries {
    // 创建精致垃圾桶几何体
    static createTrashCanGeometry() {
        const group = new THREE.Group()
        
        // 垃圾桶主体 (更精细的圆柱形)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 24)
        const body = new THREE.Mesh(bodyGeometry)
        body.position.y = 0
        group.add(body)
        
        // 垃圾桶装饰环
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(0.42 + i * 0.02, 0.01, 8, 16)
            const ring = new THREE.Mesh(ringGeometry)
            ring.position.y = -0.2 + i * 0.2
            group.add(ring)
        }
        
        // 垃圾桶盖子（更精致）
        const lidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24)
        const lid = new THREE.Mesh(lidGeometry)
        lid.position.y = 0.45
        group.add(lid)
        
        // 盖子边缘装饰
        const lidRimGeometry = new THREE.TorusGeometry(0.44, 0.02, 8, 24)
        const lidRim = new THREE.Mesh(lidRimGeometry)
        lidRim.position.y = 0.45
        group.add(lidRim)
        
        // 盖子手柄（更精细）
        const handleGeometry = new THREE.SphereGeometry(0.08, 16, 16)
        const handle = new THREE.Mesh(handleGeometry)
        handle.position.y = 0.55
        group.add(handle)
        
        // 手柄支撑
        const handleSupportGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8)
        const handleSupport = new THREE.Mesh(handleSupportGeometry)
        handleSupport.position.y = 0.52
        group.add(handleSupport)
        
        // 垃圾桶底座（加强型）
        const baseGeometry = new THREE.CylinderGeometry(0.52, 0.52, 0.05, 24)
        const base = new THREE.Mesh(baseGeometry)
        base.position.y = -0.425
        group.add(base)
        
        // 底座防滑垫
        const padGeometry = new THREE.CylinderGeometry(0.48, 0.48, 0.02, 24)
        const pad = new THREE.Mesh(padGeometry)
        pad.position.y = -0.46
        group.add(pad)
        
        // 垃圾分类标识
        const labelGeometry = new THREE.RingGeometry(0.15, 0.25, 16)
        const label = new THREE.Mesh(labelGeometry)
        label.position.set(0, 0.1, 0.41)
        group.add(label)
        
        return group
    }
    
    // 创建精致机器人头部几何体
    static createRobotHeadGeometry() {
        const group = new THREE.Group()
        
        // 机器人头部主体（圆角矩形）
        const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.5, 2, 2, 2)
        const head = new THREE.Mesh(headGeometry)
        head.position.y = 0.1
        group.add(head)
        
        // 头部装饰线条
        const decorLineGeometry = new THREE.BoxGeometry(0.65, 0.02, 0.02)
        const decorLine1 = new THREE.Mesh(decorLineGeometry)
        decorLine1.position.set(0, 0.25, 0.26)
        group.add(decorLine1)
        
        const decorLine2 = new THREE.Mesh(decorLineGeometry)
        decorLine2.position.set(0, -0.05, 0.26)
        group.add(decorLine2)
        
        // 机器人眼睛（更精致）
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16)
        const eyeSocketGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16)
        
        // 左眼
        const leftEyeSocket = new THREE.Mesh(eyeSocketGeometry)
        leftEyeSocket.position.set(-0.15, 0.15, 0.24)
        leftEyeSocket.rotation.x = Math.PI / 2
        group.add(leftEyeSocket)
        
        const leftEye = new THREE.Mesh(eyeGeometry)
        leftEye.position.set(-0.15, 0.15, 0.26)
        group.add(leftEye)
        
        // 右眼
        const rightEyeSocket = new THREE.Mesh(eyeSocketGeometry)
        rightEyeSocket.position.set(0.15, 0.15, 0.24)
        rightEyeSocket.rotation.x = Math.PI / 2
        group.add(rightEyeSocket)
        
        const rightEye = new THREE.Mesh(eyeGeometry)
        rightEye.position.set(0.15, 0.15, 0.26)
        group.add(rightEye)
        
        // 眼睛发光效果（内部小球）
        const eyeGlowGeometry = new THREE.SphereGeometry(0.03, 8, 8)
        const leftGlow = new THREE.Mesh(eyeGlowGeometry)
        leftGlow.position.set(-0.15, 0.15, 0.28)
        group.add(leftGlow)
        
        const rightGlow = new THREE.Mesh(eyeGlowGeometry)
        rightGlow.position.set(0.15, 0.15, 0.28)
        group.add(rightGlow)
        
        // 机器人天线（更精细）
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.3, 12)
        const leftAntenna = new THREE.Mesh(antennaGeometry)
        leftAntenna.position.set(-0.2, 0.55, 0)
        group.add(leftAntenna)
        
        const rightAntenna = new THREE.Mesh(antennaGeometry)
        rightAntenna.position.set(0.2, 0.55, 0)
        group.add(rightAntenna)
        
        // 天线球（更精细，带环）
        const ballGeometry = new THREE.SphereGeometry(0.05, 12, 12)
        const ballRingGeometry = new THREE.TorusGeometry(0.06, 0.01, 4, 16)
        
        const leftBall = new THREE.Mesh(ballGeometry)
        leftBall.position.set(-0.2, 0.7, 0)
        group.add(leftBall)
        
        const leftRing = new THREE.Mesh(ballRingGeometry)
        leftRing.position.set(-0.2, 0.7, 0)
        leftRing.rotation.x = Math.PI / 2
        group.add(leftRing)
        
        const rightBall = new THREE.Mesh(ballGeometry)
        rightBall.position.set(0.2, 0.7, 0)
        group.add(rightBall)
        
        const rightRing = new THREE.Mesh(ballRingGeometry)
        rightRing.position.set(0.2, 0.7, 0)
        rightRing.rotation.x = Math.PI / 2
        group.add(rightRing)
        
        // 机器人嘴巴（LED显示风格）
        const mouthGeometry = new THREE.BoxGeometry(0.25, 0.08, 0.02)
        const mouth = new THREE.Mesh(mouthGeometry)
        mouth.position.set(0, -0.08, 0.26)
        group.add(mouth)
        
        // 嘴巴装饰线
        for (let i = 0; i < 5; i++) {
            const lineGeometry = new THREE.BoxGeometry(0.02, 0.06, 0.025)
            const line = new THREE.Mesh(lineGeometry)
            line.position.set(-0.1 + i * 0.05, -0.08, 0.265)
            group.add(line)
        }
        
        // 机器人脖子（关节式）
        const neckGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.15, 16)
        const neck = new THREE.Mesh(neckGeometry)
        neck.position.y = -0.25
        group.add(neck)
        
        // 脖子关节
        const jointGeometry = new THREE.TorusGeometry(0.16, 0.02, 8, 16)
        const joint = new THREE.Mesh(jointGeometry)
        joint.position.y = -0.32
        joint.rotation.x = Math.PI / 2
        group.add(joint)
        
        // 肩膀连接部分
        const shoulderGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.08, 16)
        const shoulder = new THREE.Mesh(shoulderGeometry)
        shoulder.position.y = -0.38
        group.add(shoulder)
        
        return group
    }
    
    // 创建精致握手/合作几何体
    static createHandshakeGeometry() {
        const group = new THREE.Group()
        
        // 左手臂（带肌肉轮廓）
        const leftArmGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 16)
        const leftArm = new THREE.Mesh(leftArmGeometry)
        leftArm.position.set(-0.3, 0, 0)
        leftArm.rotation.z = Math.PI / 6
        group.add(leftArm)
        
        // 左手臂关节
        const leftJointGeometry = new THREE.SphereGeometry(0.09, 12, 12)
        const leftJoint = new THREE.Mesh(leftJointGeometry)
        leftJoint.position.set(-0.45, -0.15, 0)
        group.add(leftJoint)
        
        // 右手臂（带肌肉轮廓）
        const rightArmGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 16)
        const rightArm = new THREE.Mesh(rightArmGeometry)
        rightArm.position.set(0.3, 0, 0)
        rightArm.rotation.z = -Math.PI / 6
        group.add(rightArm)
        
        // 右手臂关节
        const rightJointGeometry = new THREE.SphereGeometry(0.09, 12, 12)
        const rightJoint = new THREE.Mesh(rightJointGeometry)
        rightJoint.position.set(0.45, -0.15, 0)
        group.add(rightJoint)
        
        // 左手（更精细的手部模型）
        const leftHandGeometry = new THREE.SphereGeometry(0.12, 16, 16)
        const leftHand = new THREE.Mesh(leftHandGeometry)
        leftHand.position.set(-0.1, 0.15, 0)
        group.add(leftHand)
        
        // 左手手指
        for (let i = 0; i < 4; i++) {
            const fingerGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.08, 8)
            const finger = new THREE.Mesh(fingerGeometry)
            finger.position.set(-0.08 + i * 0.03, 0.22, 0.05)
            finger.rotation.x = Math.PI / 8
            group.add(finger)
        }
        
        // 右手（更精细的手部模型）
        const rightHandGeometry = new THREE.SphereGeometry(0.12, 16, 16)
        const rightHand = new THREE.Mesh(rightHandGeometry)
        rightHand.position.set(0.1, 0.15, 0)
        group.add(rightHand)
        
        // 右手手指
        for (let i = 0; i < 4; i++) {
            const fingerGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.08, 8)
            const finger = new THREE.Mesh(fingerGeometry)
            finger.position.set(0.08 - i * 0.03, 0.22, 0.05)
            finger.rotation.x = Math.PI / 8
            group.add(finger)
        }
        
        // 握手连接（加强握力效果）
        const connectionGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.25, 16)
        const connection = new THREE.Mesh(connectionGeometry)
        connection.position.y = 0.15
        connection.rotation.z = Math.PI / 2
        group.add(connection)
        
        // 握手力量环
        const powerRingGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16)
        const powerRing = new THREE.Mesh(powerRingGeometry)
        powerRing.position.y = 0.15
        group.add(powerRing)
        
        // 合作象征 - 精致的星星
        const starPoints = []
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2
            const radius = i % 2 === 0 ? 0.04 : 0.02
            starPoints.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius))
        }
        
        const starShape = new THREE.Shape(starPoints)
        const starGeometry = new THREE.ExtrudeGeometry(starShape, {
            depth: 0.01,
            bevelEnabled: false
        })
        
        for (let i = 0; i < 5; i++) {
            const star = new THREE.Mesh(starGeometry)
            const angle = (i / 5) * Math.PI * 2
            star.position.set(
                Math.cos(angle) * 0.35,
                0.4,
                Math.sin(angle) * 0.35
            )
            star.rotation.x = Math.PI / 2
            star.userData = { starIndex: i }
            group.add(star)
        }
        
        // 合作能量场
        const energyFieldGeometry = new THREE.SphereGeometry(0.5, 32, 32)
        const energyField = new THREE.Mesh(energyFieldGeometry)
        energyField.position.y = 0.1
        energyField.userData = { isEnergyField: true }
        group.add(energyField)
        
        // 底座装饰
        const baseGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.1, 24)
        const base = new THREE.Mesh(baseGeometry)
        base.position.y = -0.4
        group.add(base)
        
        return group
    }
    
    // 为几何体应用材质
    static applyMaterialToGeometry(geometry, material) {
        geometry.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material.clone()
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        return geometry
    }
}

export default MeaningfulGeometries 