"use client";
import React, { useState } from 'react';

interface NoticeForm {
  title: string;
  description: string;
  file: string;
}

const NoticeForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addStatus, setAddStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let fileUrl = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/file/uploadfile', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (response.ok) {
          fileUrl = result.url; 
          submitNoticeForm(fileUrl);
        } else {
          setAddStatus({ type: 'error', message: 'File upload failed' });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setAddStatus({ type: 'error', message: 'File upload failed' });
      }
    } else {
      setAddStatus({ type: 'error', message: 'No file selected' });
    }
  };

  const submitNoticeForm = async (fileUrl: string) => {
    const notice: NoticeForm = {
      title,
      description,
      file: fileUrl
    };

    setLoading(true);

    try {
      const response = await fetch('/api/file', { // Adjust endpoint if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notice),
      });

      const result = await response.json();

      if (response.ok) {
        setAddStatus({ type: 'success', message: result.message });
        setTitle('');
        setDescription('');
        setFile(null);
      } else {
        setAddStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Error adding notice:', error);
      setAddStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Notice</h2>
      {addStatus && (
        <p className={`mb-4 text-center ${addStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {addStatus.message}
        </p>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
          File
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Notice'}
      </button>
    </form>
  );
};

export default NoticeForm;
