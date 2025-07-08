import * as THREE from 'three'
import { gsap } from 'gsap'

// Import configuration
import { APP_CONFIG } from './config'

// Import pages
import { 
    TrashDetectionPage, 
    RobotContactPage, 
    CooperationPage 
} from './pages'

// Import components
import { 
    MeaningfulGeometries,
    ScrollManager,
    TrashElementsManager 
} from './components'

class EcoVisionApp {
    constructor() {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.particles = null
        this.buttons3D = []
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.currentPage = 'home'
        this.pages = {}
        this.backgroundMesh = null
        this.animationFrame = null
        this.scrollManager = new ScrollManager()
        this.trashElementsManager = null
        
        this.init()
        this.setupEventListeners()
        this.setupPages()
        this.animate()
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(APP_CONFIG.scene.backgroundColor)
        
        // Camera setup
        const { fov, near, far, position } = APP_CONFIG.scene.camera
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far)
        this.camera.position.set(position.x, position.y, position.z)
        
        // Renderer setup
        const { antialias, alpha, shadowMapEnabled, shadowMapType } = APP_CONFIG.scene.renderer
        this.renderer = new THREE.WebGLRenderer({ antialias, alpha })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = shadowMapEnabled
        this.renderer.shadowMap.type = THREE[shadowMapType]
        
        const container = document.getElementById('canvas-container')
        container.appendChild(this.renderer.domElement)
        
        // Add lights
        this.setupLights()
        
        // Create dynamic background
        this.createDynamicBackground()
        
        // Create particle system
        this.createParticles()
        
        // Create 3D buttons
        this.create3DButtons()
        
        // Create trash elements manager
        this.trashElementsManager = new TrashElementsManager(this.scene)
        
        // Create trash classification ring animations for buttons
        this.createTrashClassificationRings()
        
        // Show fixed notification
        this.showFixedNotification()
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize())
    }
    
    setupLights() {
        // Ambient light
        const { ambient, directional, pointLights } = APP_CONFIG.lighting
        const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity)
        this.scene.add(ambientLight)
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(directional.color, directional.intensity)
        directionalLight.position.set(...directional.position)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = directional.shadowMapSize
        directionalLight.shadow.mapSize.height = directional.shadowMapSize
        this.scene.add(directionalLight)
        
        // Dynamic colored lights
        pointLights.forEach(lightData => {
            const light = new THREE.PointLight(lightData.color, lightData.intensity, lightData.distance)
            light.position.set(...lightData.position)
            this.scene.add(light)
        })
    }
    
    createDynamicBackground() {
        // Create flowing background grid
        const geometry = new THREE.PlaneGeometry(20, 20, 50, 50)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorA: { value: new THREE.Color(0x4CAF50) },
                colorB: { value: new THREE.Color(0x2196F3) },
                colorC: { value: new THREE.Color(0xFF9800) }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    vec3 pos = position;
                    pos.z += sin(pos.x * 0.5 + time) * 0.3;
                    pos.z += sin(pos.y * 0.3 + time * 0.8) * 0.2;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorA;
                uniform vec3 colorB;
                uniform vec3 colorC;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time * 0.7);
                    
                    vec3 color = mix(colorA, colorB, sin(time + vUv.x * 5.0) * 0.5 + 0.5);
                    color = mix(color, colorC, sin(time * 0.5 + vUv.y * 3.0) * 0.5 + 0.5);
                    
                    float alpha = 0.1 + noise * 0.05;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        })
        
        this.backgroundMesh = new THREE.Mesh(geometry, material)
        this.backgroundMesh.position.z = -8
        this.scene.add(this.backgroundMesh)
    }
    
    createParticles() {
        const { count, colors: colorValues, sizeRange, spread } = APP_CONFIG.particles
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        
        const colors_array = colorValues.map(color => new THREE.Color(color))
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * spread.x
            positions[i3 + 1] = (Math.random() - 0.5) * spread.y
            positions[i3 + 2] = (Math.random() - 0.5) * spread.z
            
            const color = colors_array[Math.floor(Math.random() * colors_array.length)]
            colors[i3] = color.r
            colors[i3 + 1] = color.g
            colors[i3 + 2] = color.b
            
            sizes[i] = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                attribute float size;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x * 0.01) * 0.5);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = 0.0;
                    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                    r = dot(cxy, cxy);
                    if (r > 1.0) discard;
                    
                    gl_FragColor = vec4(vColor, 1.0 - r);
                }
            `,
            transparent: true,
            vertexColors: true
        })
        
        this.particles = new THREE.Points(geometry, material)
        this.scene.add(this.particles)
    }
    
    create3DButtons() {
        const buttonData = APP_CONFIG.buttons
        
        buttonData.forEach(data => {
            const group = new THREE.Group()
            
            // 根据类型创建有意义的几何体
            let geometryGroup
            switch (data.geometryType) {
                case 'trashcan':
                    geometryGroup = MeaningfulGeometries.createTrashCanGeometry()
                    break
                case 'robot':
                    geometryGroup = MeaningfulGeometries.createRobotHeadGeometry()
                    break
                case 'handshake':
                    geometryGroup = MeaningfulGeometries.createHandshakeGeometry()
                    break
                default:
                    geometryGroup = new THREE.Group()
                    const defaultGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.3)
                    const defaultMesh = new THREE.Mesh(defaultGeometry)
                    geometryGroup.add(defaultMesh)
            }
            
            // 应用材质到几何体
            const material = new THREE.MeshPhongMaterial({ 
                color: data.color,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            })
            
            MeaningfulGeometries.applyMaterialToGeometry(geometryGroup, material)
            group.add(geometryGroup)
            
            // 发光外环（保持圆形，适用于所有几何体）
            const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16)
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide
            })
            const glow = new THREE.Mesh(glowGeometry, glowMaterial)
            group.add(glow)
            
            // 脉冲环
            const ringGeometry = new THREE.RingGeometry(0.9, 1.0, 32)
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            })
            const ring = new THREE.Mesh(ringGeometry, ringMaterial)
            ring.rotation.x = -Math.PI / 2
            ring.position.y = -0.6
            group.add(ring)
            
            // 调整连接线以确保完美对齐UI按钮
            const connectionGeometry = new THREE.CylinderGeometry(0.04, 0.04, 4.5, 8)
            const connectionMaterial = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.7
            })
            const connection = new THREE.Mesh(connectionGeometry, connectionMaterial)
            connection.position.y = -2.6
            group.add(connection)
            
            // 添加文字标签（根据几何体类型调整位置）
            const labelOffset = this.getLabelOffsetForGeometry(data.geometryType)
            this.createTextLabel(group, data.label, data.icon, data.color, labelOffset)
            
            group.position.set(...data.position)
            group.userData = { 
                id: data.id, 
                originalPosition: [...data.position],
                color: data.color,
                hoverColor: data.hoverColor,
                button: geometryGroup,
                glow: glow,
                ring: ring,
                connection: connection,
                label: data.label,
                icon: data.icon
            }
            
            this.buttons3D.push(group)
            this.scene.add(group)
        })
    }
    
    getLabelOffsetForGeometry(geometryType) {
        switch (geometryType) {
            case 'trashcan':
                return { y: 2.0, z: 0.8 }  // Increased distance to avoid overlap
            case 'robot':
                return { y: 2.2, z: 0.8 }  // Increased distance for robot head
            case 'handshake':
                return { y: 1.8, z: 0.8 }  // Increased distance for handshake model
            default:
                return { y: 1.5, z: 0.8 }
        }
    }
    
    createTrashClassificationRings() {
        this.buttons3D.forEach(button => {
            const buttonType = button.userData.id
            const buttonPosition = new THREE.Vector3().copy(button.position)
            this.trashElementsManager.createTrashClassificationRing(buttonPosition, buttonType)
        })
    }

    createTextLabel(group, labelText, iconText, color, offset = { y: 0, z: 0.2 }) {
        // 创建画布用于文字纹理
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 512
        canvas.height = 256
        
        // 设置高质量渲染
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
        
        // 清空画布
        context.fillStyle = 'rgba(0, 0, 0, 0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // 绘制半透明背景
        context.fillStyle = 'rgba(0, 0, 0, 0.9)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // 绘制图标
        context.font = '48px Arial'
        context.fillStyle = '#ffffff'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.shadowColor = 'rgba(0, 0, 0, 0.8)'
        context.shadowBlur = 10
        context.fillText(iconText, canvas.width / 2, canvas.height / 2 - 30)
        
        // 绘制文字
        context.font = 'bold 32px Arial'
        context.fillStyle = '#ffffff'
        context.shadowColor = 'rgba(0, 0, 0, 0.8)'
        context.shadowBlur = 8
        context.fillText(labelText, canvas.width / 2, canvas.height / 2 + 30)
        
        // 绘制发光边框
        context.shadowColor = `#${color.toString(16).padStart(6, '0')}`
        context.shadowBlur = 20
        context.strokeStyle = `#${color.toString(16).padStart(6, '0')}`
        context.lineWidth = 6
        context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12)
        
        // 绘制内层边框
        context.shadowBlur = 0
        context.strokeStyle = '#ffffff'
        context.lineWidth = 2
        context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16)
        
        // 创建纹理
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        
        // 创建文字平面 - 使用更好的材质设置确保可见性
        const labelGeometry = new THREE.PlaneGeometry(2.8, 1.4)  // Larger for better visibility
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1.0,
            depthTest: false,  // Always render on top
            depthWrite: false,  // Don't write to depth buffer
            side: THREE.DoubleSide  // Ensure visibility from all angles
        })
        
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
        labelMesh.position.y = offset.y
        labelMesh.position.z = offset.z
        labelMesh.renderOrder = 1000  // Highest render order for visibility
        
        // Make label always face camera
        labelMesh.userData.isLabel = true
        labelMesh.userData.originalZ = offset.z
        
        group.add(labelMesh)
        
        // 保存到userData以便后续访问
        group.userData.labelMesh = labelMesh
    }
    
    setupPages() {
        this.pages = {
            'trash-detection': new TrashDetectionPage(this),
            'robot-contact': new RobotContactPage(this),
            'cooperation': new CooperationPage(this)
        }
    }
    
    setupEventListeners() {
        // 鼠标移动事件
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        })
        
        // 鼠标点击事件
        window.addEventListener('click', (event) => {
            this.onMouseClick(event)
        })
        
        // 2D UI buttons removed, only 3D interaction
    }
    
    onMouseClick(event) {
        if (this.currentPage !== 'home') return
        
        this.raycaster.setFromCamera(this.mouse, this.camera)
        
        // 收集所有按钮几何体的mesh对象用于检测
        const buttonMeshes = []
        this.buttons3D.forEach(buttonGroup => {
            buttonGroup.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    buttonMeshes.push(child)
                }
            })
        })
        
        const intersects = this.raycaster.intersectObjects(buttonMeshes)
        
        if (intersects.length > 0) {
            // 找到被点击的按钮组
            const clickedMesh = intersects[0].object
            const clickedButton = this.buttons3D.find(btn => {
                let found = false
                btn.traverse((child) => {
                    if (child === clickedMesh) found = true
                })
                return found
            })
            
            if (clickedButton) {
                this.animateButtonClick(clickedButton)
                this.navigateToPage(clickedButton.userData.id)
            }
        }
    }
    
    animateButtonClick(buttonGroup) {
        const { button, glow, ring } = buttonGroup.userData
        
        // 按钮点击动画（应用到整个几何体组）
        gsap.to(button.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        })
        
        // 发光效果
        gsap.to(glow.material, {
            opacity: 0.4,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        })
        
        // 脉冲环扩散
        gsap.fromTo(ring.scale, 
            { x: 0.5, y: 0.5, z: 0.5 },
            { x: 2.5, y: 2.5, z: 2.5, duration: 0.6, ease: "power2.out" }
        )
        
        gsap.to(ring.material, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                ring.material.opacity = 0.4
                ring.scale.set(1, 1, 1)
            }
        })
        
        // 触发垃圾收集动画
        if (this.trashElementsManager) {
            this.trashElementsManager.triggerTrashCollection(buttonGroup.position)
        }
    }
    
    navigateToPage(pageId) {
        if (this.currentPage === pageId) return
        
        const oldPage = this.currentPage
        this.currentPage = pageId
        
        // 隐藏主界面
        if (oldPage === 'home') {
            this.hideHomeScreen()
        }
        
        // 清除之前的滚动进度条
        this.scrollManager.removeScrollProgress()
        
        // 显示新页面
        if (pageId !== 'home') {
            if (this.pages[pageId]) {
                this.pages[pageId].show()
                
                // 设置页面滚动容器
                setTimeout(() => {
                    const pageContainer = this.pages[pageId].container
                    if (pageContainer) {
                        this.scrollManager.setCurrentPageContainer(pageContainer)
                        
                        // 根据页面类型设置滚动进度条颜色
                        let progressColor = '#2196F3'
                        if (pageId === 'trash-detection') {
                            progressColor = '#4CAF50'
                        } else if (pageId === 'robot-contact') {
                            progressColor = '#2196F3'
                        } else if (pageId === 'cooperation') {
                            progressColor = '#FF9800'
                        }
                        
                        this.scrollManager.addScrollProgress(progressColor)
                    }
                }, 100)
            }
        } else {
            this.showHomeScreen()
            this.scrollManager.hideScrollButton()
        }
    }
    
    hideHomeScreen() {
        const homeUI = document.getElementById('ui-overlay')
        gsap.to(homeUI, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                homeUI.style.display = 'none'
            }
        })
        
        // 移动3D按钮
        this.buttons3D.forEach((button, index) => {
            gsap.to(button.position, {
                y: button.position.y + 10,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.in"
            })
        })
    }
    
    showHomeScreen() {
        const homeUI = document.getElementById('ui-overlay')
        homeUI.style.display = 'block'
        gsap.to(homeUI, {
            opacity: 1,
            duration: 0.5
        })
        
        // 恢复3D按钮位置
        this.buttons3D.forEach((button, index) => {
            gsap.to(button.position, {
                y: button.userData.originalPosition[1],
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out"
            })
        })
    }
    
    goHome() {
        // 隐藏当前页面
        if (this.currentPage !== 'home' && this.pages[this.currentPage]) {
            this.pages[this.currentPage].hide()
        }
        
        this.navigateToPage('home')
    }
    
    animate() {
        this.animationFrame = requestAnimationFrame(() => this.animate())
        
        const time = Date.now() * 0.001
        
        // 更新背景动画
        if (this.backgroundMesh) {
            this.backgroundMesh.material.uniforms.time.value = time
        }
        
        // 更新粒子动画
        if (this.particles) {
            this.particles.material.uniforms.time.value = time
            this.particles.rotation.y += 0.001
            this.particles.rotation.x += 0.0005
        }
        
        // 更新垃圾元素管理器
        if (this.trashElementsManager) {
            this.trashElementsManager.update(time)
        }
        
        // 更新握手几何体中的星星动画
        this.updateHandshakeStars(time)
        
        // 按钮悬停效果
        if (this.currentPage === 'home') {
            this.updateButtonHover()
        }
        
        // 更新当前页面
        if (this.currentPage !== 'home' && this.pages[this.currentPage]) {
            this.pages[this.currentPage].update(time)
        }
        
        // Make labels always face camera (billboard effect) and ensure proper positioning
        this.buttons3D.forEach(button => {
            const labelMesh = button.userData.labelMesh
            if (labelMesh?.userData.isLabel) {
                labelMesh.lookAt(this.camera.position)
                
                // Ensure label stays at proper distance from camera
                const distanceToCamera = this.camera.position.distanceTo(button.position)
                if (distanceToCamera > 15) {
                    labelMesh.scale.setScalar(distanceToCamera / 15)
                } else {
                    labelMesh.scale.setScalar(1)
                }
                
                // Ensure label is always visible
                labelMesh.material.opacity = Math.min(1.0, Math.max(0.8, 15 / distanceToCamera))
            }
        })
        
        this.renderer.render(this.scene, this.camera)
    }
    
    updateHandshakeStars(time) {
        // 找到握手几何体按钮
        const handshakeButton = this.buttons3D.find(btn => btn.userData.id === 'cooperation')
        if (!handshakeButton) return
        
        // 遍历几何体中的星星并更新位置
        const geometryGroup = handshakeButton.userData.button
        geometryGroup.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && 
                child.geometry.parameters && child.geometry.parameters.radius === 0.05) {
                // 这是一个星星，更新其位置
                const baseY = 0.4
                const index = child.userData?.starIndex || Math.random() * 3
                child.position.y = baseY + Math.sin(time * 2 + index) * 0.15
                
                // 添加轻微的旋转
                child.rotation.y = time * 0.5 + index
                child.rotation.z = Math.sin(time * 1.5 + index) * 0.3
            }
        })
    }

    updateButtonHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        
        // 收集所有按钮几何体的mesh对象用于检测
        const buttonMeshes = []
        this.buttons3D.forEach(buttonGroup => {
            buttonGroup.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    buttonMeshes.push(child)
                }
            })
        })
        
        const intersects = this.raycaster.intersectObjects(buttonMeshes)
        
        // Find hovered button group
        let hoveredButton = null
        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object
            hoveredButton = this.buttons3D.find(btn => {
                let found = false
                btn.traverse((child) => {
                    if (child === hoveredMesh) found = true
                })
                return found
            })
        }
        
        this.buttons3D.forEach(buttonGroup => {
            const { button, glow, ring, connection, labelMesh, originalPosition, color, hoverColor } = buttonGroup.userData
            const isHovered = hoveredButton === buttonGroup
            
            if (isHovered) {
                // Hover effect
                gsap.to(buttonGroup.position, {
                    y: originalPosition[1] + 0.2,
                    duration: 0.3
                })
                
                // Update all material colors in geometry group
                button.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.material) {
                        gsap.to(child.material.color, {
                            r: (hoverColor >> 16 & 255) / 255,
                            g: (hoverColor >> 8 & 255) / 255,
                            b: (hoverColor & 255) / 255,
                            duration: 0.3
                        })
                    }
                })
                
                gsap.to(glow.material, {
                    opacity: 0.4,
                    duration: 0.3
                })
                
                // Connection line glow effect
                if (connection) {
                    gsap.to(connection.material, {
                        opacity: 1.0,
                        duration: 0.3
                    })
                    gsap.to(connection.scale, {
                        x: 1.5,
                        z: 1.5,
                        duration: 0.3
                    })
                }
                
                // Label glow effect
                if (labelMesh) {
                    const originalZ = labelMesh.userData?.originalZ || labelMesh.position.z
                    if (!labelMesh.userData) labelMesh.userData = {}
                    labelMesh.userData.originalZ = originalZ
                    
                    gsap.to(labelMesh.material, {
                        opacity: 1.0,
                        duration: 0.3
                    })
                    gsap.to(labelMesh.scale, {
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                        duration: 0.3
                    })
                    gsap.to(labelMesh.position, {
                        z: originalZ + 0.15,
                        duration: 0.3
                    })
                }
                
                // Pulse animation
                const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1
                ring.scale.set(scale, scale, scale)
            } else {
                // Restore to original state
                gsap.to(buttonGroup.position, {
                    y: originalPosition[1],
                    duration: 0.3
                })
                
                // Restore all material colors in geometry group
                button.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.material) {
                        gsap.to(child.material.color, {
                            r: (color >> 16 & 255) / 255,
                            g: (color >> 8 & 255) / 255,
                            b: (color & 255) / 255,
                            duration: 0.3
                        })
                    }
                })
                
                gsap.to(glow.material, {
                    opacity: 0.2,
                    duration: 0.3
                })
                
                // Restore connection line
                if (connection) {
                    gsap.to(connection.material, {
                        opacity: 0.6,
                        duration: 0.3
                    })
                    gsap.to(connection.scale, {
                        x: 1,
                        z: 1,
                        duration: 0.3
                    })
                }
                
                // Restore label
                if (labelMesh) {
                    const originalZ = labelMesh.userData?.originalZ || labelMesh.position.z
                    
                    gsap.to(labelMesh.material, {
                        opacity: 1.0,
                        duration: 0.3
                    })
                    gsap.to(labelMesh.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.3
                    })
                    gsap.to(labelMesh.position, {
                        z: originalZ,
                        duration: 0.3
                    })
                }
                
                gsap.to(ring.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.3
                })
            }
        })
    }
    
    showFixedNotification() {
        const notification = document.createElement('div')
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 20px 25px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border-radius: 12px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
            backdrop-filter: blur(10px);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s ease;
        `
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">✅</span>
                <div>
                    <div>System Ready!</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
                        3D buttons and scrollbars are optimized
                    </div>
                </div>
            </div>
        `
        
        document.body.appendChild(notification)
        
        // Show animation
        setTimeout(() => {
            notification.style.opacity = '1'
            notification.style.transform = 'translateX(0)'
        }, 100)
        
        // Auto hide
        setTimeout(() => {
            notification.style.opacity = '0'
            notification.style.transform = 'translateX(100%)'
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification)
                }
            }, 400)
        }, 4000)
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame)
        }
        
        // Clean up all pages
        Object.values(this.pages).forEach(page => {
            if (page.destroy) page.destroy()
        })
        
        // Clean up trash elements manager
        if (this.trashElementsManager) {
            this.trashElementsManager.destroy()
        }
        
        // Clean up Three.js resources
        this.scene.traverse((child) => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose())
                } else {
                    child.material.dispose()
                }
            }
        })
        
        this.renderer.dispose()
    }
}

// Initialize application
window.ecoVisionApp = new EcoVisionApp()