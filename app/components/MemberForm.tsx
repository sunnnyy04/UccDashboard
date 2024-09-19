import React, { useState } from 'react';

const branches = ['ENC', 'CE', 'ECE', 'CEDS', 'CEH','MECHANICAL','BCA','IT','AI & R',"EEIOT","CIVIL"];
const batches = [2020, 2021, 2022, 2023, 2024, 2025, 2026,2027,2028,2029,2030];
const positions = ['JSEC', 'Member', 'Session Head', 'Coordinator','SECRETARY'];

interface Member {
  name: string;
  branch: string;
  rollNumber: string;
  image?: string;
  batch: number;
  position: string;
}

const MemberForm: React.FC = () => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(branches[0]);
  const [rollNumber, setRollNumber] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [batch, setBatch] = useState(batches[0]);
  const [position, setPosition] = useState(positions[0]);
  const [removeRollNumber, setRemoveRollNumber] = useState('');
  const [addStatus, setAddStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [removeStatus, setRemoveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = '';

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      try {
        const response = await fetch('/api/uploadImage', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (response.ok) {
          imageUrl = result.url;
          console.log(imageUrl,"rtieaiu");
          submitMemberForm(imageUrl);
          
        } else {
          setAddStatus({ type: 'error', message: 'Image upload failed' });
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setAddStatus({ type: 'error', message: 'Image upload failed' });
        return;
      }
    }

    
  };

  const submitMemberForm = async (imageUrl: string) => {
    const member: Member = {
      name,
      branch,
      rollNumber,
      image: imageUrl,
      batch,
      position,
    };

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      const result = await response.json();

      if (response.ok) {
        setAddStatus({ type: 'success', message: result.message });
        // Reset form
        setName('');
        setBranch(branches[0]);
        setRollNumber('');
        setImage(null);
        setBatch(batches[0]);
        setPosition(positions[0]);
      } else {
        setAddStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      setAddStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  const handleRemoveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: removeRollNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setRemoveStatus({ type: 'success', message: result.message });
        setRemoveRollNumber('');
      } else {
        setRemoveStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setRemoveStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <>
      <form onSubmit={handleAddMember} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Member</h2>
        {addStatus && (
          <p className={addStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}>
            {addStatus.message}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
            Branch
          </label>
          <select
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rollNumber">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter roll number"
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="batch">
            Batch
          </label>
          <select
            id="batch"
            value={batch}
            onChange={(e) => setBatch(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
            Position
          </label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Member
        </button>
      </form>

      <form onSubmit={handleRemoveMember} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Remove Member</h2>
        {removeStatus && (
          <p className={removeStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}>
            {removeStatus.message}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="removeRollNumber">
            Roll Number to Remove
          </label>
          <input
            type="text"
            id="removeRollNumber"
            value={removeRollNumber}
            onChange={(e) => setRemoveRollNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter roll number of the member to remove"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Remove Member
        </button>
      </form>
    </>
  );
};

export default MemberForm;
