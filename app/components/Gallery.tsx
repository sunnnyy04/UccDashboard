import React, { useState } from 'react';

interface Member {
  image?: string;
}

const Gallery: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [addStatus, setAddStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const gallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = '';

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      try {
        const response = await fetch('/api/gallery/image', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (response.ok) {
          imageUrl = result.url; // Adjust if your API returns the URL directly
          submitGalleryForm(imageUrl);
        } else {
          setAddStatus({ type: 'error', message: 'Image upload failed' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setAddStatus({ type: 'error', message: 'Image upload failed' });
      }
    } else {
      setAddStatus({ type: 'error', message: 'No image selected' });
    }
  };

  const submitGalleryForm = async (imageUrl: string) => {
    const member: Member = {
      image: imageUrl,
    };

    try {
      const response = await fetch('/api/gallery', { // Adjust endpoint if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      const result = await response.json();

      if (response.ok) {
        setAddStatus({ type: 'success', message: result.message });
        setImage(null);
      } else {
        setAddStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Error adding images:', error);
      setAddStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <form onSubmit={gallerySubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Images</h2>
      {addStatus && (
        <p className={addStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}>
          {addStatus.message}
        </p>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Image
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => e.target.files && setImage(e.target.files[0])} // Handle file change
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Upload Image
      </button>
    </form>
  );
};

export default Gallery;
