import * as THREE from 'three'

class MeaningfulGeometries {
    // 创建垃圾桶几何体
    static createTrashCanGeometry() {
        const group = new THREE.Group()
        
        // 垃圾桶主体 (圆柱形)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 12)
        const body = new THREE.Mesh(bodyGeometry)
        body.position.y = 0
        group.add(body)
        
        // 垃圾桶盖子
        const lidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 12)
        const lid = new THREE.Mesh(lidGeometry)
        lid.position.y = 0.45
        group.add(lid)
        
        // 盖子手柄
        const handleGeometry = new THREE.SphereGeometry(0.08, 8, 8)
        const handle = new THREE.Mesh(handleGeometry)
        handle.position.y = 0.55
        group.add(handle)
        
        // 垃圾桶底座
        const baseGeometry = new THREE.CylinderGeometry(0.52, 0.52, 0.05, 12)
        const base = new THREE.Mesh(baseGeometry)
        base.position.y = -0.425
        group.add(base)
        
        return group
    }
    
    // 创建机器人头部几何体
    static createRobotHeadGeometry() {
        const group = new THREE.Group()
        
        // 机器人头部主体
        const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.5)
        const head = new THREE.Mesh(headGeometry)
        head.position.y = 0.1
        group.add(head)
        
        // 机器人眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8)
        
        const leftEye = new THREE.Mesh(eyeGeometry)
        leftEye.position.set(-0.15, 0.15, 0.26)
        group.add(leftEye)
        
        const rightEye = new THREE.Mesh(eyeGeometry)
        rightEye.position.set(0.15, 0.15, 0.26)
        group.add(rightEye)
        
        // 机器人天线
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6)
        const leftAntenna = new THREE.Mesh(antennaGeometry)
        leftAntenna.position.set(-0.2, 0.55, 0)
        group.add(leftAntenna)
        
        const rightAntenna = new THREE.Mesh(antennaGeometry)
        rightAntenna.position.set(0.2, 0.55, 0)
        group.add(rightAntenna)
        
        // 天线球
        const ballGeometry = new THREE.SphereGeometry(0.05, 6, 6)
        const leftBall = new THREE.Mesh(ballGeometry)
        leftBall.position.set(-0.2, 0.7, 0)
        group.add(leftBall)
        
        const rightBall = new THREE.Mesh(ballGeometry)
        rightBall.position.set(0.2, 0.7, 0)
        group.add(rightBall)
        
        // 机器人嘴巴
        const mouthGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.02)
        const mouth = new THREE.Mesh(mouthGeometry)
        mouth.position.set(0, -0.05, 0.26)
        group.add(mouth)
        
        // 机器人脖子
        const neckGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8)
        const neck = new THREE.Mesh(neckGeometry)
        neck.position.y = -0.3
        group.add(neck)
        
        return group
    }
    
    // 创建握手/合作几何体
    static createHandshakeGeometry() {
        const group = new THREE.Group()
        
        // 左手臂
        const leftArmGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8)
        const leftArm = new THREE.Mesh(leftArmGeometry)
        leftArm.position.set(-0.3, 0, 0)
        leftArm.rotation.z = Math.PI / 6
        group.add(leftArm)
        
        // 右手臂
        const rightArmGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8)
        const rightArm = new THREE.Mesh(rightArmGeometry)
        rightArm.position.set(0.3, 0, 0)
        rightArm.rotation.z = -Math.PI / 6
        group.add(rightArm)
        
        // 左手
        const leftHandGeometry = new THREE.SphereGeometry(0.12, 8, 8)
        const leftHand = new THREE.Mesh(leftHandGeometry)
        leftHand.position.set(-0.1, 0.15, 0)
        group.add(leftHand)
        
        // 右手
        const rightHandGeometry = new THREE.SphereGeometry(0.12, 8, 8)
        const rightHand = new THREE.Mesh(rightHandGeometry)
        rightHand.position.set(0.1, 0.15, 0)
        group.add(rightHand)
        
        // 握手连接
        const connectionGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 8)
        const connection = new THREE.Mesh(connectionGeometry)
        connection.position.y = 0.15
        connection.rotation.z = Math.PI / 2
        group.add(connection)
        
        // 合作象征 - 小星星
        const starGeometry = new THREE.SphereGeometry(0.05, 6, 6)
        for (let i = 0; i < 3; i++) {
            const star = new THREE.Mesh(starGeometry)
            const angle = (i / 3) * Math.PI * 2
            star.position.set(
                Math.cos(angle) * 0.3,
                0.4,
                Math.sin(angle) * 0.3
            )
            star.userData = { starIndex: i }
            group.add(star)
        }
        
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