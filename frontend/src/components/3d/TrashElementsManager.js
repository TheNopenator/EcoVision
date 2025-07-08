import * as THREE from 'three'
import { gsap } from 'gsap'

class TrashElementsManager {
    constructor(scene) {
        this.scene = scene
        this.floatingTrash = []
        this.trashParticles = null
        this.recyclingIndicators = []
        this.trashClassificationRings = []
        
        this.init()
    }
    
    init() {
        this.createFloatingTrash()
        this.createTrashParticles()
        this.createRecyclingIndicators()
    }
    
    // Create floating trash 3D models
    createFloatingTrash() {
        const trashTypes = [
            { 
                type: 'bottle', 
                color: 0x2E7D32, 
                icon: '🍶',
                scale: 0.3 
            },
            { 
                type: 'can', 
                color: 0xC62828, 
                icon: '🥤',
                scale: 0.25 
            },
            { 
                type: 'paper', 
                color: 0xF57C00, 
                icon: '📄',
                scale: 0.2 
            },
            { 
                type: 'bag', 
                color: 0x1565C0, 
                icon: '🛍️',
                scale: 0.35 
            },
            { 
                type: 'apple', 
                color: 0x388E3C, 
                icon: '🍎',
                scale: 0.2 
            },
            { 
                type: 'cup', 
                color: 0x5D4037, 
                icon: '☕',
                scale: 0.25 
            }
        ]
        
        for (let i = 0; i < 20; i++) {
            const trashType = trashTypes[Math.floor(Math.random() * trashTypes.length)]
            const trashItem = this.createTrashItem(trashType)
            
            // Random position distribution around the scene
            const angle = (i / 20) * Math.PI * 2
            const radius = 8 + Math.random() * 4
            trashItem.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 8,
                Math.sin(angle) * radius
            )
            
            // Random rotation
            trashItem.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            )
            
            this.floatingTrash.push(trashItem)
            this.scene.add(trashItem)
            
            // Add floating animation
            this.animateFloatingTrash(trashItem, i)
        }
    }
    
    createTrashItem(trashType) {
        const group = new THREE.Group()
        
        // Main geometry
        let geometry
        switch (trashType.type) {
            case 'bottle':
                geometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 12)
                break
            case 'can':
                geometry = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16)
                break
            case 'paper':
                geometry = new THREE.BoxGeometry(0.6, 0.02, 0.8)
                break
            case 'bag':
                geometry = new THREE.SphereGeometry(0.3, 8, 8)
                break
            case 'apple':
                geometry = new THREE.SphereGeometry(0.15, 12, 12)
                break
            case 'cup':
                geometry = new THREE.ConeGeometry(0.15, 0.4, 12)
                break
            default:
                geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: trashType.color,
            transparent: true,
            opacity: 0.8,
            shininess: 30
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        group.add(mesh)
        
        // Add glow outer layer
        const glowGeometry = new THREE.SphereGeometry(0.4, 8, 8)
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: trashType.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        })
        const glow = new THREE.Mesh(glowGeometry, glowMaterial)
        group.add(glow)
        
        // Create icon texture
        const iconTexture = this.createIconTexture(trashType.icon, trashType.color)
        const iconGeometry = new THREE.PlaneGeometry(0.3, 0.3)
        const iconMaterial = new THREE.MeshBasicMaterial({
            map: iconTexture,
            transparent: true,
            opacity: 0.9
        })
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial)
        iconMesh.position.z = 0.5
        group.add(iconMesh)
        
        group.scale.setScalar(trashType.scale)
        group.userData = { type: trashType.type, originalScale: trashType.scale }
        
        return group
    }
    
    createIconTexture(icon, color) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 128
        canvas.height = 128
        
        // Clear canvas
        context.fillStyle = 'rgba(0, 0, 0, 0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw circular background
        context.fillStyle = `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 0.8)`
        context.beginPath()
        context.arc(64, 64, 50, 0, Math.PI * 2)
        context.fill()
        
        // Draw icon
        context.font = '48px Arial'
        context.fillStyle = '#ffffff'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(icon, 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        return texture
    }
    
    animateFloatingTrash(trashItem, index) {
        const originalY = trashItem.position.y
        const floatHeight = 0.5 + Math.random() * 0.5
        const floatSpeed = 1 + Math.random() * 2
        
        // Up and down floating animation
        gsap.to(trashItem.position, {
            y: originalY + floatHeight,
            duration: floatSpeed,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
        })
        
        // Slow rotation
        gsap.to(trashItem.rotation, {
            y: Math.PI * 2,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            ease: "none"
        })
        
        // Subtle scaling pulse
        gsap.to(trashItem.scale, {
            x: trashItem.userData.originalScale * 1.1,
            y: trashItem.userData.originalScale * 1.1,
            z: trashItem.userData.originalScale * 1.1,
            duration: 2 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 5
        })
    }
    
    // Create trash classification particle system
    createTrashParticles() {
        const particleCount = 1000
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        const sizes = new Float32Array(particleCount)
        
        const trashColors = [
            new THREE.Color(0x4CAF50), // Green - Recyclable
            new THREE.Color(0x2196F3), // Blue - Recyclable
            new THREE.Color(0xFF9800), // Orange - Hazardous waste
            new THREE.Color(0xF44336), // Red - Hazardous waste
            new THREE.Color(0x9C27B0), // Purple - Kitchen waste
            new THREE.Color(0x607D8B)  // Gray - Other waste
        ]
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            // Random position
            positions[i3] = (Math.random() - 0.5) * 30
            positions[i3 + 1] = (Math.random() - 0.5) * 20
            positions[i3 + 2] = (Math.random() - 0.5) * 30
            
            // Random color
            const color = trashColors[Math.floor(Math.random() * trashColors.length)]
            colors[i3] = color.r
            colors[i3 + 1] = color.g
            colors[i3 + 2] = color.b
            
            // Random size
            sizes[i] = Math.random() * 4 + 1
        }
        
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vSize = size;
                    
                    vec3 pos = position;
                    pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
                    pos.x += cos(time * 0.3 + position.z * 0.1) * 1.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - (dist * 2.0);
                    alpha *= alpha;
                    
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true
        })
        
        this.trashParticles = new THREE.Points(geometry, material)
        this.scene.add(this.trashParticles)
    }
    
    // Create recycling indicators
    createRecyclingIndicators() {
        const indicatorPositions = [
            { x: -6, y: 2, z: 3 },
            { x: 6, y: -1, z: 4 },
            { x: -4, y: -2, z: -5 },
            { x: 5, y: 3, z: -2 }
        ]
        
        indicatorPositions.forEach((pos, index) => {
            const indicator = this.createRecyclingIndicator()
            indicator.position.set(pos.x, pos.y, pos.z)
            this.recyclingIndicators.push(indicator)
            this.scene.add(indicator)
            
            // Add rotation animation
            gsap.to(indicator.rotation, {
                y: Math.PI * 2,
                duration: 5 + index * 2,
                repeat: -1,
                ease: "none"
            })
        })
    }
    
    createRecyclingIndicator() {
        const group = new THREE.Group()
        
        // Three arrows of recycling symbol
        const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 6)
        const arrowMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.8
        })
        
        for (let i = 0; i < 3; i++) {
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
            const angle = (i / 3) * Math.PI * 2
            const radius = 0.4
            
            arrow.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            )
            arrow.rotation.y = angle + Math.PI / 2
            arrow.rotation.z = Math.PI / 4
            
            group.add(arrow)
        }
        
        // Center ring
        const ringGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16)
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0x2E7D32,
            transparent: true,
            opacity: 0.6
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        group.add(ring)
        
        return group
    }
    
    // Add trash classification surrounding animation for buttons
    createTrashClassificationRing(buttonPosition, buttonType) {
        const trashIcons = {
            'trash-detection': ['🗑️', '♻️', '🌱', '🔄'],
            'robot-contact': ['🤖', '🚮', '📦', '🔧'],
            'cooperation': ['🤝', '💚', '🌍', '⭐']
        }
        
        const icons = trashIcons[buttonType] || ['🗑️', '♻️', '🌱', '🔄']
        const ring = new THREE.Group()
        
        icons.forEach((icon, index) => {
            const iconMesh = this.createFloatingIcon(icon, index)
            ring.add(iconMesh)
        })
        
        ring.position.copy(buttonPosition)
        this.trashClassificationRings.push(ring)
        this.scene.add(ring)
        
        return ring
    }
    
    createFloatingIcon(icon, index) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 64
        canvas.height = 64
        
        // Draw icon
        context.font = '32px Arial'
        context.fillStyle = '#ffffff'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.shadowColor = '#000000'
        context.shadowBlur = 4
        context.fillText(icon, 32, 32)
        
        const texture = new THREE.CanvasTexture(canvas)
        const geometry = new THREE.PlaneGeometry(0.3, 0.3)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8
        })
        
        const iconMesh = new THREE.Mesh(geometry, material)
        
        // Set surrounding position
        const angle = (index / 4) * Math.PI * 2
        const radius = 1.5
        iconMesh.position.set(
            Math.cos(angle) * radius,
            0.2,
            Math.sin(angle) * radius
        )
        
        // Add surrounding animation
        iconMesh.userData = { 
            originalAngle: angle, 
            radius: radius, 
            speed: 0.5 + index * 0.2 
        }
        
        return iconMesh
    }
    
    // Update animations
    update(time) {
        // Update trash particles
        if (this.trashParticles) {
            this.trashParticles.material.uniforms.time.value = time
            this.trashParticles.rotation.y += 0.001
        }
        
        // Update glow effects of floating trash
        this.floatingTrash.forEach((trashItem, index) => {
            const glow = trashItem.children[1] // Glow layer
            if (glow) {
                const pulseIntensity = 0.05 + Math.sin(time * 2 + index * 0.5) * 0.05
                glow.material.opacity = pulseIntensity
            }
        })
        
        // Update recycling indicator pulses
        this.recyclingIndicators.forEach((indicator, index) => {
            const scale = 1 + Math.sin(time * 1.5 + index * 0.8) * 0.1
            indicator.scale.setScalar(scale)
        })
        
        // Update classification ring animations
        this.trashClassificationRings.forEach((ring, index) => {
            ring.rotation.y = time * 0.5 + index * 0.3
            
            // Up and down floating
            ring.position.y = Math.sin(time * 0.8 + index * 1.2) * 0.1
            
            // Update surrounding icon positions
            ring.children.forEach(iconMesh => {
                if (iconMesh.userData && iconMesh.userData.originalAngle !== undefined) {
                    const { originalAngle, radius, speed } = iconMesh.userData
                    const currentAngle = originalAngle + time * speed
                    iconMesh.position.x = Math.cos(currentAngle) * radius
                    iconMesh.position.z = Math.sin(currentAngle) * radius
                    iconMesh.lookAt(0, iconMesh.position.y, 0)
                }
            })
        })
    }
    
    // Trigger trash collection animation
    triggerTrashCollection(buttonPosition) {
        // Find nearby trash and animate to button
        this.floatingTrash.forEach((trashItem) => {
            const distance = trashItem.position.distanceTo(buttonPosition)
            if (distance < 8) {
                // Attract trash to button
                gsap.to(trashItem.position, {
                    x: buttonPosition.x,
                    y: buttonPosition.y + 0.5,
                    z: buttonPosition.z,
                    duration: 1 + Math.random() * 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        // Respawn trash after collection complete
                        this.respawnTrashItem(trashItem)
                    }
                })
                
                // Shrinking animation
                gsap.to(trashItem.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1,
                    delay: 0.5,
                    ease: "power2.in"
                })
            }
        })
    }
    
    respawnTrashItem(trashItem) {
        // Randomize position again
        const angle = Math.random() * Math.PI * 2
        const radius = 8 + Math.random() * 4
        
        trashItem.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 8,
            Math.sin(angle) * radius
        )
        
        // Restore scale
        gsap.to(trashItem.scale, {
            x: trashItem.userData.originalScale,
            y: trashItem.userData.originalScale,
            z: trashItem.userData.originalScale,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
    }
    
    // Clean up resources
    destroy() {
        this.floatingTrash.forEach(trash => {
            this.scene.remove(trash)
            trash.traverse((child) => {
                if (child.geometry) child.geometry.dispose()
                if (child.material) child.material.dispose()
            })
        })
        
        if (this.trashParticles) {
            this.scene.remove(this.trashParticles)
            this.trashParticles.geometry.dispose()
            this.trashParticles.material.dispose()
        }
        
        this.recyclingIndicators.forEach(indicator => {
            this.scene.remove(indicator)
            indicator.traverse((child) => {
                if (child.geometry) child.geometry.dispose()
                if (child.material) child.material.dispose()
            })
        })
        
        this.trashClassificationRings.forEach(ring => {
            this.scene.remove(ring)
            ring.traverse((child) => {
                if (child.geometry) child.geometry.dispose()
                if (child.material) child.material.dispose()
            })
        })
    }
}

export default TrashElementsManager 