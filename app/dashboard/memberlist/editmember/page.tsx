"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Member {
  _id: string;
  name: string;
  branch: string;
  rollNumber: string;
  image: string;
  batch: number;
  position: string;
}

const branches = ['ENC', 'CE', 'ECE', 'CEDS', 'CEH','MECHANICAL','BCA','IT','AI & R',"EEIOT","CIVIL","SECRETARY"];
const batches = [2020, 2021, 2022, 2023, 2024, 2025, 2026,2027,2028,2029,2030];
const positions = ['JSEC', 'Member', 'Session Head', 'Coordinator'];

const EditMember: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [member, setMember] = useState<Member | null>(null);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(branches[0]);
  const [rollNumber, setRollNumber] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [batch, setBatch] = useState(batches[0]);
  const [position, setPosition] = useState(positions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let url = "";

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/dashlogin'); // Redirect to login if not authenticated
    }
  }, [router]);

  useEffect(() => {
    if (id) {
      fetch(`/api/list/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setMember(data);
          setName(data.name);
          setBranch(data.branch);
          setRollNumber(data.rollNumber);
          setImageUrl(data.image);
          setBatch(data.batch);
          setPosition(data.position);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching member:', error);
          setError('Error fetching member');
          setLoading(false);
        });
    } else {
      setError('No ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      setError('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with an error:', errorText);
        setError('Error uploading image');
        return;
      }

      const result = await response.json();
      if (!result.url) {
        console.error('Unexpected response structure:', result);
        setError('Unexpected response structure');
        return;
      }

      url = result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedMember = {
      name,
      branch,
      rollNumber,
      image: url === " " ? imageUrl : url,
      batch,
      position,
    };

    try {
      const response = await fetch(`/api/list/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMember),
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      router.push('/dashboard/memberlist'); // Redirect to members list
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Error updating member');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Edit Member</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {imageUrl && (
            <img src={imageUrl} alt="Selected" className="mt-4 w-32 h-32 object-cover" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Batch</label>
          <select
            value={batch}
            onChange={(e) => setBatch(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/memberlist')}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const EditMemberPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditMember />
  </Suspense>
);

export default EditMemberPage;
