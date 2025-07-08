import * as THREE from 'three'

class RoundedBoxGeometry extends THREE.BufferGeometry {
    constructor(width = 1, height = 1, depth = 1, segments = 4, radius = 0.1) {
        super()
        
        this.width = width
        this.height = height
        this.depth = depth
        this.segments = segments
        this.radius = radius
        
        // 创建普通的box geometry作为基础
        const boxGeometry = new THREE.BoxGeometry(width, height, depth)
        
        // 复制属性
        this.attributes.position = boxGeometry.attributes.position.clone()
        this.attributes.normal = boxGeometry.attributes.normal.clone()
        this.attributes.uv = boxGeometry.attributes.uv.clone()
        this.setIndex(boxGeometry.index.clone())
        
        // 清理
        boxGeometry.dispose()
    }
}

export default RoundedBoxGeometry 