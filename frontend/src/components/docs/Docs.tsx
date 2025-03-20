import {
  Upload,
  Loader2,
  FileText,
  FileSearch,
  Image,
  AlertCircle,
  X,
} from 'lucide-react';
import { useDocsStore } from '../../store/docStore';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Docs() {
  const {
    selectedOp,
    addRecentDoc,
    setSelectedOp,
    processDocument,
    isLoading,
    error,
    response,
    clearResponse,
  } = useDocsStore();

  const [files, setFiles] = useState<File[]>([]);
  const [compareFiles, setCompareFiles] = useState<[File | null, File | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    setSelectedOp('summarize');
    return () => clearResponse();
  }, [setSelectedOp, clearResponse]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    if (selectedOp === 'compare' && typeof index === 'number') {
      const updatedFiles: [File | null, File | null] = [...compareFiles];
      updatedFiles[index] = newFiles[0];
      setCompareFiles(updatedFiles);
      addRecentDoc(newFiles[0].name);
    } else {
      setFiles([...files, ...Array.from(newFiles)]);
      Array.from(newFiles).forEach((file) => addRecentDoc(file.name));
    }
  };

  const handleProcess = async () => {
    if (selectedOp === 'compare') {
      if (compareFiles[0] && compareFiles[1]) {
        //@ts-ignore
        await processDocument(compareFiles[0], compareFiles);
      }
    } else if (files.length > 0) {
      await processDocument(files[0]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleDeleteCompareFile = (index: number) => {
    const updatedFiles: [File | null, File | null] = [...compareFiles];
    updatedFiles[index] = null;
    setCompareFiles(updatedFiles);
  };

  const getUploadConfig = () => {
    const common = {
      summarize: {
        label: 'Summarize Document',
        description: 'Upload PDF or TXT documents for summary',
        icon: <FileText className="w-8 h-8" />,
        appFunction:
          'AI-powered document summarization with key points extraction.',
      },
      compare: {
        label: 'Compare Documents',
        description: 'Upload two documents to compare',
        icon: <FileSearch className="w-8 h-8" />,
        appFunction:
          'Advanced document comparison with detailed difference analysis.',
      },
      'image-to-text': {
        label: 'Image to Text',
        description: 'Upload images for text extraction',
        icon: <Image className="w-8 h-8" />,
        appFunction: 'Extract text from images using OCR technology.',
      },
    };

    return selectedOp ? common[selectedOp] : null;
  };

  const config = getUploadConfig();

  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select an operation from the sidebar
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] p-6 text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Upload Section */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#B4924C]/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {config.label}
              </h2>
              <p className="text-gray-400 mt-1">{config.appFunction}</p>
            </div>
            <div className="text-[#B4924C]">{config.icon}</div>
          </div>

          {selectedOp === 'compare' ? (
            <div className="grid grid-cols-2 gap-4" data-onboarding="compare">
              {[0, 1].map((index) => (
                <div key={index} className="relative group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, index)}
                    accept=".pdf,.txt"
                    id={`compare-upload-${index}`}
                  />
                  <label
                    htmlFor={`compare-upload-${index}`}
                    className="flex flex-col items-center justify-center h-48 p-8 border-2 border-dashed border-[#B4924C]/30 rounded-lg bg-black hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer"
                  >
                    {compareFiles[index] ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#B4924C]" />
                        <span className="truncate max-w-[200px]">
                          {compareFiles[index]?.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompareFile(index);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                          <Upload className="w-8 h-8 text-[#B4924C]" />
                        </div>
                        <p className="text-gray-400">Document {index + 1}</p>
                      </>
                    )}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group" data-onboarding="upload-area">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept={
                  selectedOp === 'image-to-text' ? 'image/*' : '.pdf,.txt'
                }
                multiple={false}
                id="doc-upload"
              />
              <label
                htmlFor="doc-upload"
                className="flex flex-col items-center justify-center h-48 p-8 border-2 border-dashed border-[#B4924C]/30 rounded-lg bg-black hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer"
              >
                {files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#B4924C]" />
                        <span className="truncate max-w-[300px]">
                          {file.name}
                        </span>
                        <button
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                      <Upload className="w-8 h-8 text-[#B4924C]" />
                    </div>
                    <p className="text-gray-400">{config.description}</p>
                  </>
                )}
              </label>
            </div>
          )}

          {(files.length > 0 ||
            (selectedOp === 'compare' && compareFiles.every((f) => f))) && (
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="mt-4 w-full bg-gradient-to-r from-[#B4924C] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B4924C] text-black py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                `Process ${selectedOp}`
              )}
            </button>
          )}
        </div>

        {/* Results */}
        {response && (
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#B4924C]/20" data-onboarding="results-area">
            <h3 className="text-lg font-medium text-white mb-4">Results</h3>
            <div className="bg-black rounded-lg p-4 overflow-auto max-h-[600px] prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#B4924C]/20">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#B4924C] animate-spin" />
              <p className="mt-4 text-gray-300">Processing your document...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-red-900">
            <div className="flex items-start">
              <div className="bg-red-900/20 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-red-400 font-medium">Processing Error</h3>
                <p className="text-red-300 mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}