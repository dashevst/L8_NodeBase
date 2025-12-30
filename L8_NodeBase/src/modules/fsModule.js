const fs = require('fs');
const path = require('path');

module.exports = {
    write: (file, data) => fs.writeFileSync(file, data),
    
    read: (file) => fs.readFileSync(file, 'utf-8'),
    
    readJSON: (file) => {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf-8'));
        } catch {
            return null;
        }
    },
    
    writeJSON: (file, data, pretty = true) => {
        fs.writeFileSync(file, pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data));
    },

    update: (file, data) => fs.writeFileSync(file, data),

    clearFile: (file) => fs.writeFileSync(file, ''),

    cleanNoise: (file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const cleaned = content.replace(/\d+/g, '').toLowerCase();
        fs.writeFileSync(file, cleaned);
    },

    copy: (src, dest) => fs.copyFileSync(src, dest),
    
    rename: (oldPath, newPath) => fs.renameSync(oldPath, newPath),

    makeDir: (dir) => fs.mkdirSync(dir, { recursive: true }),

    removeDir: (dir) => fs.rmSync(dir, { recursive: true, force: true }),
    
    backupFile: (file) => {
        const backupPath = `${file}.backup_${Date.now()}`;
        fs.copyFileSync(file, backupPath);
        return backupPath;
    },

    listAll: (dir, files = [], exclude = ['node_modules', '.git', '.env']) => {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            if (exclude.some(pattern => p.includes(pattern))) return;
            
            if (fs.statSync(p).isDirectory()) {
                module.exports.listAll(p, files, exclude);
            } else {
                const stats = fs.statSync(p);
                files.push({
                    path: p,
                    size: stats.size,
                    modified: stats.mtime,
                    isDir: false
                });
            }
        });
        return files;
    },

    clearProject: (dir, keep = ['node_modules', '.git', 'package.json', '.env', 'package-lock.json']) => {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            if (keep.includes(f)) return;
            fs.rmSync(p, { recursive: true, force: true });
        });
    },
    
    getFileInfo: (file) => {
        try {
            const stats = fs.statSync(file);
            return {
                exists: true,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isDirectory: stats.isDirectory()
            };
        } catch {
            return { exists: false };
        }
    }
};