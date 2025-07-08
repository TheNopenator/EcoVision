// Three.js utility functions
export const useThree = {
    // Dispose of Three.js resources
    disposeObject(obj) {
        if (obj.geometry) {
            obj.geometry.dispose()
        }
        
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose())
            } else {
                obj.material.dispose()
            }
        }
        
        if (obj.texture) {
            obj.texture.dispose()
        }
    },

    // Clean up scene
    disposeScene(scene) {
        scene.traverse((child) => {
            this.disposeObject(child)
        })
    },

    // Create basic material with common settings
    createBasicMaterial(color, options = {}) {
        return new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.9,
            shininess: 100,
            ...options
        })
    },

    // Animate object position
    animatePosition(object, targetPosition, duration = 0.5) {
        return new Promise((resolve) => {
            gsap.to(object.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration,
                ease: "power2.out",
                onComplete: resolve
            })
        })
    },

    // Animate object scale
    animateScale(object, targetScale, duration = 0.3) {
        return new Promise((resolve) => {
            gsap.to(object.scale, {
                x: targetScale,
                y: targetScale,
                z: targetScale,
                duration,
                ease: "power2.out",
                onComplete: resolve
            })
        })
    },

    // Create glow effect
    createGlow(color, radius = 0.8, opacity = 0.15) {
        const glowGeometry = new THREE.SphereGeometry(radius, 16, 16)
        const glowMaterial = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.BackSide
        })
        return new THREE.Mesh(glowGeometry, glowMaterial)
    }
} 