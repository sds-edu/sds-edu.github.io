/**
 * Generative Architecture Schematic Animation
 * Conceptual 2D tree diagrams for SDS-EDU
 */

class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.systems = [];
        this.maxSystems = 12; // Increased for more activity
        this.colors = ['rgba(255, 255, 255, ', 'rgba(13, 110, 253, ', 'rgba(173, 181, 189, '];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    createNode(x, y, depth = 0) {
        const width = 30 + Math.random() * 50;
        const height = 20 + Math.random() * 15;
        
        return {
            x: x,
            y: y,
            w: width,
            h: height,
            opacity: 0,
            targetOpacity: 0.3 + Math.random() * 0.4,
            life: 1.0,
            decay: 0.001 + Math.random() * 0.002, // Slightly faster decay for quicker cycling
            children: [],
            depth: depth,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            driftX: (Math.random() - 0.5) * 0.3,
            driftY: (Math.random() - 0.5) * 0.3
        };
    }

    generateSystem() {
        const startX = Math.random() * this.canvas.offsetWidth;
        const startY = Math.random() * this.canvas.offsetHeight;
        const root = this.createNode(startX, startY);
        
        this.growBranch(root, 1 + Math.floor(Math.random() * 3));
        return root;
    }

    growBranch(parent, depth) {
        if (depth <= 0) return;
        
        const numChildren = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numChildren; i++) {
            const angle = (Math.random() * Math.PI * 2); 
            const dist = 60 + Math.random() * 100;
            const childX = parent.x + Math.cos(angle) * dist;
            const childY = parent.y + Math.sin(angle) * dist;
            
            const child = this.createNode(childX, childY, parent.depth + 1);
            parent.children.push(child);
            this.growBranch(child, depth - 1);
        }
    }

    updateNode(node) {
        node.x += node.driftX;
        node.y += node.driftY;

        // Faster fade in
        if (node.opacity < node.targetOpacity) {
            node.opacity += 0.015; // Increased speed
        }

        node.life -= node.decay;
        
        if (node.life < 0.1) {
            node.opacity -= 0.005; // Faster fade out
        }

        node.children.forEach(child => this.updateNode(child));
    }

    drawNode(node) {
        if (node.opacity <= 0) return;

        this.ctx.strokeStyle = node.color + node.opacity + ')';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(node.x, node.y, node.w, node.h);

        this.ctx.fillStyle = node.color + (node.opacity * 1.5) + ')';
        this.ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
        this.ctx.fillRect(node.x + node.w - 1, node.y - 1, 2, 2);
        this.ctx.fillRect(node.x - 1, node.y + node.h - 1, 2, 2);
        this.ctx.fillRect(node.x + node.w - 1, node.y + node.h - 1, 2, 2);

        node.children.forEach(child => {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x + node.w / 2, node.y + node.h / 2);
            this.ctx.lineTo(child.x + child.w / 2, child.y + child.h / 2);
            this.ctx.strokeStyle = node.color + (node.opacity * 0.3) + ')';
            this.ctx.stroke();
            this.drawNode(child);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

        // Faster spawn rate
        if (this.systems.length < this.maxSystems && Math.random() < 0.05) {
            this.systems.push(this.generateSystem());
        }

        this.systems = this.systems.filter(sys => {
            this.updateNode(sys);
            this.drawNode(sys);
            return sys.opacity > 0 || sys.life > 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});
