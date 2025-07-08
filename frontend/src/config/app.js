// Application Configuration
export const APP_CONFIG = {
    // 3D Scene Settings
    scene: {
        backgroundColor: 0x0a0a0a,
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 0, z: 5 }
        },
        renderer: {
            antialias: true,
            alpha: true,
            shadowMapEnabled: true,
            shadowMapType: 'PCFSoftShadowMap'
        }
    },
    
    // Lighting Configuration
    lighting: {
        ambient: {
            color: 0x404040,
            intensity: 0.3
        },
        directional: {
            color: 0xffffff,
            intensity: 0.8,
            position: [5, 5, 5],
            shadowMapSize: 2048
        },
        pointLights: [
            { color: 0x4CAF50, position: [-3, 2, 2], intensity: 0.6, distance: 10 },
            { color: 0x2196F3, position: [0, 2, 2], intensity: 0.6, distance: 10 },
            { color: 0xFF9800, position: [3, 2, 2], intensity: 0.6, distance: 10 }
        ]
    },
    
    // Button Configuration
    buttons: [
        { 
            id: 'trash-detection', 
            position: [-2.3, 0.6, 0], 
            color: 0x4CAF50,
            hoverColor: 0x66BB6A,
            label: 'Trash Detection',
            icon: '🗑️',
            geometryType: 'trashcan'
        },
        { 
            id: 'robot-contact', 
            position: [0, 0.8, 0], 
            color: 0x2196F3,
            hoverColor: 0x42A5F5,
            label: 'Robot Contact',
            icon: '🤖',
            geometryType: 'robot'
        },
        { 
            id: 'cooperation', 
            position: [2.3, 0.6, 0], 
            color: 0xFF9800,
            hoverColor: 0xFFA726,
            label: 'Cooperation',
            icon: '🤝',
            geometryType: 'handshake'
        }
    ],
    
    // Particle System
    particles: {
        count: 2000,
        colors: [0x4CAF50, 0x2196F3, 0xFF9800, 0xFFFFFF],
        sizeRange: { min: 0.05, max: 0.15 },
        spread: { x: 30, y: 30, z: 30 }
    },
    
    // Animation Settings
    animation: {
        buttonHover: {
            scale: 1.1,
            duration: 0.3
        },
        pageTransition: {
            duration: 0.5,
            ease: "power2.out"
        }
    }
}

export default APP_CONFIG 