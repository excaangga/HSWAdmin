import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hero = () => {
    const backendUrl = 'http://202.157.185.132:3030';
    const [heroImages, setHeroImages] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [breakpointFlag, setBreakpointFlag] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch data when the component mounts
        const fetchData = async () => {
            try {
                const response = await axios.get(backendUrl + '/hero_image');
                setHeroImages(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleBreakpointChange = (e) => {
        setBreakpointFlag(e.target.value);
    };

    const handleAddImage = async () => {
        if (
            !newImage || breakpointFlag == ''
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to add this data?");
        if (isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('heroImage', newImage);
                formData.append('breakpoint_flag', breakpointFlag);

                await axios.post(backendUrl + '/hero_image', formData);

                // Refresh the data after adding a new item
                const response = await axios.get(backendUrl + '/hero_image');
                setHeroImages(response.data);

                // Clear the form fields
                setNewImage(null);
                setBreakpointFlag('');
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    const handleDeleteImage = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this data?");
        if (isConfirmed) {
            try {
                await axios.delete(backendUrl + `/hero_image/${id}`);
    
                // Refresh the data after deleting an item
                const response = await axios.get(backendUrl + '/hero_image');
                setHeroImages(response.data);
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead className='bg-gray-100 sticky top-14'>
                    <tr>
                        <th className='px-4 py-2'>No.</th>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Breakpoint Flag</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto">
                    {isLoading ? (
                        <tr>
                            <td colSpan="3" className="text-center py-4">Loading...</td>
                        </tr>
                    ) : (
                        heroImages.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">
                                    <img src={'http://202.157.185.132:3000' + item.image_path} alt={`Image ${item.image_path}`} className="block h-32" />
                                    <div>{item.image_path}</div>
                                </td>
                                <td className="text-center px-4 py-2">{item.breakpoint_flag}</td>
                                <td className="text-center px-4 py-2">
                                    <button onClick={() => handleDeleteImage(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mx-4 mt-4">
                <h2 className="text-lg font-bold mb-1">Add New Image</h2>
                <div className='mb-2'>Don't forget to delete the former image with the corresponding breakpoint, else the main website will have a bug.</div>
                <div className="flex">
                    <input type="file" onChange={handleFileChange} className="mr-2" />
                    <select value={breakpointFlag} onChange={handleBreakpointChange} className="mr-2">
                        <option value="">Select Breakpoint</option>
                        <option value="1280">1280</option>
                        <option value="1024">1024</option>
                        <option value="768">768</option>
                        <option value="640">640</option>
                    </select>
                    <button onClick={handleAddImage} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;