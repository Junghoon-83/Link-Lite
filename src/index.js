/**
 * Link-Lite - A lightweight link management application
 * Main entry point
 */

class LinkLite {
    constructor() {
        this.links = [];
        this.init();
    }

    init() {
        console.log('Link-Lite initialized');
        this.loadLinks();
    }

    addLink(url, title, description = '') {
        const link = {
            id: Date.now(),
            url,
            title,
            description,
            createdAt: new Date().toISOString()
        };
        this.links.push(link);
        this.saveLinks();
        return link;
    }

    removeLink(id) {
        this.links = this.links.filter(link => link.id !== id);
        this.saveLinks();
    }

    getLinks() {
        return this.links;
    }

    loadLinks() {
        // In a real app, this would load from storage
        console.log('Loading links...');
    }

    saveLinks() {
        // In a real app, this would save to storage
        console.log('Saving links...');
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinkLite;
} else if (typeof window !== 'undefined') {
    window.LinkLite = LinkLite;
}