"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
// In-memory store for rooms
var rooms = new Map();
// Create HTTP server
var server = http_1.default.createServer();
// Create Socket.IO server
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Data directory for saving sketches
var DATA_DIR = (0, path_1.join)(process.cwd(), 'data');
// Ensure data directory exists
if (!fs_1.default.existsSync(DATA_DIR)) {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
// Socket.IO connection handler
io.on('connection', function (socket) {
    console.log('User connected:', socket.id);
    // Join a room
    socket.on('join-room', function (roomId) {
        socket.join(roomId);
        // Create room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                lines: [],
                users: []
            });
        }
        // Add user to room
        var room = rooms.get(roomId);
        room.users.push(socket.id);
        // Send current state to new user
        socket.emit('init-canvas', room.lines);
        // Notify all users in the room
        io.to(roomId).emit('user-count', room.users.length);
        console.log("User ".concat(socket.id, " joined room ").concat(roomId));
    });
    // Draw line
    socket.on('draw-line', function (roomId, line) {
        if (!rooms.has(roomId))
            return;
        var room = rooms.get(roomId);
        room.lines.push(line);
        // Broadcast to all users in the room except sender
        socket.to(roomId).emit('line-drawn', line);
    });
    // Clear canvas
    socket.on('clear-canvas', function (roomId) {
        if (!rooms.has(roomId))
            return;
        var room = rooms.get(roomId);
        room.lines = [];
        // Broadcast to all users in the room except sender
        socket.to(roomId).emit('canvas-cleared');
    });
    // Save sketch
    socket.on('save-sketch', function (roomId) {
        if (!rooms.has(roomId))
            return;
        var room = rooms.get(roomId);
        var filePath = (0, path_1.join)(DATA_DIR, "".concat(roomId, ".json"));
        fs_1.default.writeFileSync(filePath, JSON.stringify(room.lines), 'utf-8');
        // Notify the user that the sketch was saved
        socket.emit('sketch-saved', { success: true });
    });
    // Disconnect
    socket.on('disconnect', function () {
        console.log('User disconnected:', socket.id);
        // Remove user from all rooms
        for (var _i = 0, _a = rooms.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], roomId = _b[0], room = _b[1];
            var userIndex = room.users.indexOf(socket.id);
            if (userIndex !== -1) {
                room.users.splice(userIndex, 1);
                // Notify remaining users
                io.to(roomId).emit('user-count', room.users.length);
                // Remove room if empty
                if (room.users.length === 0) {
                    rooms.delete(roomId);
                }
            }
        }
    });
});
// Start server
var PORT = process.env.PORT || 3001;
server.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
