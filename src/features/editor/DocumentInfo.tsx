import { usePDFStore } from '../../store/usePDFStore';
import { formatFileSize } from '../../lib/conversion-utils';

export function DocumentInfo() {
    const { file, numPages, annotations } = usePDFStore();

    if (!file) {
        return (
            <div className="p-4 text-center text-slate-400 dark:text-slate-500">
                <p className="text-sm">No document loaded</p>
            </div>
        );
    }

    const fileSize = file.size;
    const createdDate = new Date(file.lastModified);

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Document Info
            </h3>

            <div className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Title</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{file.name}</p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Author</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">PDF Editor User</p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Created</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                        {createdDate.toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Modified</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                        {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">File Size</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                        {formatFileSize(fileSize)}
                    </p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Pages</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{numPages}</p>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Annotations</label>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{annotations.length}</p>
                </div>
            </div>
        </div>
    );
}
