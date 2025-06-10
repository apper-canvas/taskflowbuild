import { useState } from 'react';
import { X, Download, FileText, Code, File } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const ExportModal = ({ note, onExport, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [exporting, setExporting] = useState(false);

  const exportFormats = [
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Plain text with markdown formatting',
      icon: FileText,
      extension: '.md'
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Web page format with styling',
      icon: Code,
      extension: '.html'
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Portable document format (coming soon)',
      icon: File,
      extension: '.pdf',
      disabled: true
    }
  ];

  const handleExport = async () => {
    if (!selectedFormat) return;
    
    try {
      setExporting(true);
      await onExport(note.id, selectedFormat);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <Heading level={3} className="text-lg font-semibold text-surface-900">
            Export Note
          </Heading>
          <Button
            onClick={onClose}
            variant="ghost"
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-surface-600 mb-4">
              Export "{note.title}" in your preferred format:
            </p>

            <div className="space-y-3">
              {exportFormats.map(format => {
                const Icon = format.icon;
                return (
                  <label
                    key={format.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      format.disabled
                        ? 'opacity-50 cursor-not-allowed bg-surface-50'
                        : selectedFormat === format.id
                        ? 'border-primary bg-primary/5'
                        : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={(e) => !format.disabled && setSelectedFormat(e.target.value)}
                      disabled={format.disabled}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      selectedFormat === format.id
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-surface-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-surface-900">
                          {format.name}
                        </h4>
                        <span className="text-xs text-surface-500 bg-surface-100 px-2 py-1 rounded">
                          {format.extension}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mt-1">
                        {format.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Note Preview */}
          <div className="bg-surface-50 rounded-lg p-3 mb-6">
            <div className="text-xs text-surface-500 mb-2">Preview:</div>
            <div className="text-sm">
              <div className="font-medium text-surface-900 mb-1">{note.title}</div>
              <div className="text-surface-600">
                {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </div>
              <div className="text-xs text-surface-500 mt-2">
                {note.tags.length > 0 && `Tags: ${note.tags.join(', ')}`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-surface-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!selectedFormat || exporting || exportFormats.find(f => f.id === selectedFormat)?.disabled}
            className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;