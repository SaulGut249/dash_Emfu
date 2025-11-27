"use client";

type Detection = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	cls_name: string;
	conf: number;
};

type Props = {
	width: number;
	height: number;
	detections: Detection[];
};

export function DetectionViewer({ width, height, detections }: Props) {
	// Default to 640x480 if dimensions are missing or 0
	const w = width || 640;
	const h = height || 480;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm h-full flex flex-col">
			<h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
				Vista en Vivo (Esquemática)
			</h3>
			<div
				className="flex-1 w-full h-full relative bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
				style={{
					backgroundImage: "url('/Imagen2.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<svg
					viewBox={`0 0 ${w} ${h}`}
					className="w-full h-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Background placeholder - removed since we have a real background now, or keep it transparent */}
					<rect x="0" y="0" width={w} height={h} fill="none" />

					{detections.map((d, i) => (
						<g key={i}>
							<rect
								x={d.x1}
								y={d.y1}
								width={d.x2 - d.x1}
								height={d.y2 - d.y1}
								fill="none"
								stroke="#ef4444"
								strokeWidth="2"
							/>
							<text
								x={d.x1}
								y={d.y1 - 5}
								fill="#ef4444"
								fontSize="12"
								fontWeight="bold"
							>
								{d.cls_name} ({Math.round(d.conf * 100)}%)
							</text>
						</g>
					))}
				</svg>
				{detections.length === 0 && (
					<div className="absolute inset-0 flex items-center justify-center text-gray-400">
						Sin detecciones
					</div>
				)}
			</div>
		</div>
	);
}
