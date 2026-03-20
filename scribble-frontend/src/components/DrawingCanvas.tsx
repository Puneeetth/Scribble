import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, Undo2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { wsService } from '../services/websocket';

interface Point { x: number; y: number; }

const COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'
];

interface DrawingCanvasProps {
    isDrawer: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isDrawer }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { drawingDataQueue, clearDrawingDataQueue } = useGame();

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const [lastPos, setLastPos] = useState<Point | null>(null);

    // Set up canvas context
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Fix DPI scaling
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    // Handle incoming drawing data from WebSocket loop
    useEffect(() => {
        if (isDrawer || drawingDataQueue.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Process all queued drawing actions
        drawingDataQueue.forEach(data => {
            if (data.clear) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.size;
            ctx.beginPath();
            ctx.moveTo(data.x0 * canvas.width, data.y0 * canvas.height);
            ctx.lineTo(data.x1 * canvas.width, data.y1 * canvas.height);
            ctx.stroke();
        });

        clearDrawingDataQueue();
    }, [drawingDataQueue, isDrawer, clearDrawingDataQueue]);

    // Drawing Event Handlers
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawer) return;
        setIsDrawing(true);
        const pos = getPos(e);
        setLastPos(pos);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawer || !isDrawing || !lastPos) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const currentPos = getPos(e);

        // Draw locally
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        // Send over WebSocket
        wsService.sendDraw({
            x0: lastPos.x / canvas.width,
            y0: lastPos.y / canvas.height,
            x1: currentPos.x / canvas.width,
            y1: currentPos.y / canvas.height,
            color,
            size: lineWidth
        });

        setLastPos(currentPos);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    const clearCanvas = () => {
        if (!isDrawer) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        wsService.sendDraw({ x0: 0, y0: 0, x1: 0, y1: 0, color, size: lineWidth, clear: true });
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    return (
        <div className="flex flex-col h-full bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
            <div className="flex-1 relative cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full bg-white touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ pointerEvents: isDrawer ? 'auto' : 'none' }}
                />
                {!isDrawer && (
                    <div className="absolute inset-0 pointer-events-none border-4 border-cyan-500/20" />
                )}
            </div>

            {isDrawer && (
                <div className="h-16 bg-slate-900 border-t border-slate-700 p-2 flex items-center justify-between gap-4 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white z-10' : 'hover:scale-110'}`}
                                style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #e2e8f0' : 'none' }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="2"
                            max="40"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                            className="w-24 accent-purple-500"
                        />
                        <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                            <button
                                onClick={() => setColor('#ffffff')}
                                className={`p-2 rounded-lg transition-colors ${color === '#ffffff' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                title="Eraser"
                            >
                                <Eraser className="w-5 h-5" />
                            </button>
                            <button
                                onClick={clearCanvas}
                                className="p-2 rounded-lg bg-red-900/40 hover:bg-red-900 text-red-400 transition-colors border border-red-500/20"
                                title="Clear Canvas"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrawingCanvas;
