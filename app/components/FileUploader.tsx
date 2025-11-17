import { useCallback, useState, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  file?: File | null;
  onError?: (error: string | null) => void;
}

const FileUploader = ({
  onFileSelect,
  file: controlledFile,
  onError,
}: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setError(null);
      onError?.(null);
      onFileSelect?.(file);
    },
    [onFileSelect, onError]
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const rejection = fileRejections[0];
      if (!rejection) return;

      let errorMessage = "File upload failed";

      if (rejection.errors.length > 0) {
        const error = rejection.errors[0];
        if (error.code === "file-too-large") {
          errorMessage = `File size exceeds the maximum limit of ${formatSize(
            maxFileSize
          )}`;
        } else if (error.code === "file-invalid-type") {
          errorMessage = "Only PDF files are allowed";
        } else {
          errorMessage = error.message || "Invalid file";
        }
      }

      setError(errorMessage);
      onError?.(errorMessage);
      onFileSelect?.(null);
    },
    [onFileSelect, onError, maxFileSize]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  // Use controlled file if provided, otherwise use dropzone's acceptedFiles
  const file =
    controlledFile !== undefined ? controlledFile : acceptedFiles[0] || null;

  // Clear error when file is cleared externally
  useEffect(() => {
    if (controlledFile === null) {
      setError(null);
      onError?.(null);
    }
  }, [controlledFile, onError]);

  return (
    <div className="w-full">
      <div className="gradient-border">
        <div {...getRootProps()}>
          <input {...getInputProps()} />

          <div className="space-y-4 cursor-pointer">
            {file ? (
              <div
                className="uploader-selected-file"
                onClick={(e) => e.stopPropagation()}
              >
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 cursor-pointer"
                  onClick={() => {
                    onFileSelect?.(null);
                  }}
                >
                  <img
                    src="/icons/cross.svg"
                    alt="remove"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            ) : (
              <div>
                <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                  <img src="/icons/info.svg" alt="upload" className="size-20" />
                </div>
                <p className="text-lg text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-lg text-gray-500">
                  PDF (max {formatSize(maxFileSize)})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
export default FileUploader;
