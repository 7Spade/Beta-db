import React from "react";

type DocumentPreviewProps = {
	/** Absolute file URL (e.g., from your storage/CDN). */
	src?: string;
	/** Google Drive file id (uses drive preview if provided). */
	driveFileId?: string;
	/** Optional iframe title */
	title?: string;
	/** Optional className to control sizing (defaults to full size). */
	className?: string;
};

const toGoogleDocsViewerUrl = (url: string) =>
	`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(url)}`;

const toGoogleDrivePreviewUrl = (fileId: string) =>
	`https://drive.google.com/file/d/${fileId}/preview`;

const isPdf = (url: string) => /\.(pdf)(?:$|\?)/i.test(url);
const isOfficeDocument = (url: string) => /\.(doc|docx|xls|xlsx|ppt|pptx)(?:$|\?)/i.test(url);

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
	src,
	driveFileId,
	title,
	className,
}) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasError, setHasError] = React.useState(false);

	const previewUrl = React.useMemo(() => {
		if (driveFileId) return toGoogleDrivePreviewUrl(driveFileId);
		if (!src) return "";
		
		// 一律透過 Google Docs viewer 預覽，避免瀏覽器直接下載
		if (isPdf(src)) return toGoogleDocsViewerUrl(src);
		if (isOfficeDocument(src)) return toGoogleDocsViewerUrl(src);
		return toGoogleDocsViewerUrl(src);
	}, [src, driveFileId]);

	React.useEffect(() => {
		setIsLoading(true);
		setHasError(false);
	}, [previewUrl]);

	const handleLoad = () => {
		setIsLoading(false);
		setHasError(false);
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	if (!previewUrl)
		return (
			<div className={`${className ?? "w-full h-full"} flex items-center justify-center bg-muted rounded-lg`}>
				<div className="text-center text-muted-foreground">
					<p>No document selected</p>
				</div>
			</div>
		);

	return (
		<div className={`${className ?? "w-full h-full"} relative`}>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
						<p className="text-sm text-muted-foreground">載入中...</p>
					</div>
				</div>
			)}
			
			{hasError && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
					<div className="text-center text-muted-foreground">
						<p className="mb-2">無法載入文件預覽</p>
						<a 
							href={previewUrl} 
							target="_blank" 
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							在新分頁開啟
						</a>
					</div>
				</div>
			)}

			<iframe
				src={previewUrl}
				title={title ?? "Document preview"}
				className={`w-full h-full ${hasError ? 'opacity-0' : ''}`}
				style={{ border: 0 }}
				referrerPolicy="no-referrer"
				sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
				allow="autoplay; clipboard-read; clipboard-write; fullscreen"
				loading="lazy"
				onLoad={handleLoad}
				onError={handleError}
			/>
		</div>
	);
};

export default DocumentPreview;


