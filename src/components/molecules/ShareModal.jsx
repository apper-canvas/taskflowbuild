import { useState } from 'react';
import { X, Share2, Mail, Copy, Check, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Heading from '@/components/atoms/Heading';

const ShareModal = ({ note, onShare, onClose }) => {
  const [emails, setEmails] = useState(note.sharedWith || []);
  const [emailInput, setEmailInput] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareMode, setShareMode] = useState('private'); // 'private' or 'public'
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/notes/shared/${note.id}`;

  const handleAddEmail = () => {
    const email = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) return;
    
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (emails.includes(email)) {
      toast.error('Email already added');
      return;
    }
    
    setEmails(prev => [...prev, email]);
    setEmailInput('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleEmailInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      await onShare(note.id, shareMode === 'public' ? [] : emails);
      toast.success(shareMode === 'public' ? 'Note is now public' : 'Note shared successfully');
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleStopSharing = async () => {
    try {
      setSharing(true);
      await onShare(note.id, []);
      setEmails([]);
      setShareMode('private');
    } catch (error) {
      console.error('Stop sharing error:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <Heading level={3} className="text-lg font-semibold text-surface-900">
            Share Note
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
          <div className="mb-6">
            <p className="text-sm text-surface-600 mb-4">
              Share "{note.title}" with others:
            </p>

            {/* Share Mode Toggle */}
            <div className="flex bg-surface-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setShareMode('private')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  shareMode === 'private'
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Private</span>
              </button>
              <button
                onClick={() => setShareMode('public')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  shareMode === 'public'
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </button>
            </div>

            {shareMode === 'private' ? (
              <>
                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Add people by email
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailInputKeyDown}
                      placeholder="Enter email address..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddEmail}
                      disabled={!emailInput.trim()}
                      className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Email List */}
                {emails.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Shared with ({emails.length})
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {emails.map(email => (
                        <div
                          key={email}
                          className="flex items-center justify-between bg-surface-50 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm text-surface-900">{email}</span>
                          </div>
                          <Button
                            onClick={() => handleRemoveEmail(email)}
                            variant="ghost"
                            className="p-1 rounded hover:bg-surface-200 text-surface-500 hover:text-error transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Public share link
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-surface-50"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="px-4 py-2 border border-surface-300 hover:bg-surface-50 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <p className="text-xs text-surface-500 mt-2">
                  Anyone with this link can view the note (read-only)
                </p>
              </div>
            )}

            {/* Current Sharing Status */}
            {note.isShared && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-info">
                    Currently shared
                  </span>
                </div>
                <p className="text-xs text-info/80 mt-1">
                  This note is shared with {note.sharedWith?.length || 0} people
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-surface-200">
          <div>
            {note.isShared && (
              <Button
                onClick={handleStopSharing}
                disabled={sharing}
                variant="outline"
                className="px-4 py-2 border border-error text-error hover:bg-error/5 rounded-lg transition-colors duration-200"
              >
                Stop Sharing
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={sharing || (shareMode === 'private' && emails.length === 0)}
              className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{sharing ? 'Sharing...' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;