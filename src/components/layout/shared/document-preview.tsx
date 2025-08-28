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
	`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;

const toGoogleDrivePreviewUrl = (fileId: string) =>
	`https://drive.google.com/file/d/${fileId}/preview`;

const isPdf = (url: string) => /\.(pdf)(?:$|\?)/i.test(url);

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
	src,
	driveFileId,
	title,
	className,
}) => {
	const previewUrl = React.useMemo(() => {
		if (driveFileId) return toGoogleDrivePreviewUrl(driveFileId);
		if (!src) return "";
		return isPdf(src) ? src : toGoogleDocsViewerUrl(src);
	}, [src, driveFileId]);

	if (!previewUrl)
		return (
			<div className={className ?? "w-full h-full"}>
				No document selected
			</div>
		);

	return (
		<iframe
			src={previewUrl}
			title={title ?? "Document preview"}
			className={className ?? "w-full h-full"}
			style={{ border: 0 }}
			referrerPolicy="no-referrer"
			sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
			allow="autoplay; clipboard-read; clipboard-write"
		/>
	);
};

export default DocumentPreview;


