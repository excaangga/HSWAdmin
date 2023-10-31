import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clients = () => {
    const backendUrl = 'http://202.157.185.132:3030';
    const [clients, setClients] = useState([]);
    const [dirtyData, setDirtyData] = useState({});
    const [newImage, setNewImage] = useState(null);
    const [shown, setShown] = useState(0);

    useEffect(() => {
        axios.get(backendUrl + "/active_clients").then((response) => {
            setClients(response.data);
        });
    }, []);

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleShownChange = (e) => {
        setShown(e.target.value);
    };

    const handleAddImage = async () => {
        if (
            !newImage
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to add this data?");
        if (isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('activeClients', newImage);
                formData.append('shown', shown);

                await axios.post(backendUrl + '/active_clients', formData);

                // Refresh the data after adding a new item
                const response = await axios.get(backendUrl + '/active_clients');
                setClients(response.data);

                // Clear the form fields
                setNewImage(null);
                setShown(0);
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    const handleCheckboxChange = (id, checked) => {
        setClients((prevData) => {
            const updatedData = prevData.map((data) => {
                if (data.id === id) {
                    setDirtyData((prevDirtyData) => ({ ...prevDirtyData, [id]: true }));
                    return { ...data, shown: checked };
                }
                return data;
            });
            return updatedData;
        });
    };

    const handleEditClient = (data) => {
        axios.put(backendUrl + "/active_clients/" + data.id, data).then((response) => {
            setClients([...clients, response.data]);
            axios.get(backendUrl + "/active_clients").then((response) => {
                setClients(response.data);
            });
        });
    };

    const handleDeleteClient = (id) => {
        axios.delete(backendUrl + "/active_clients/" + id).then((response) => {
            setClients(clients.filter((data) => data.id !== id));
        });
    };

    const confirmEditClient = (data) => {
        const isConfirmed = window.confirm("Are you sure you want to edit this data?");
        if (isConfirmed) {
            handleEditClient(data);
            setDirtyData((prevDirtyData) => ({ ...prevDirtyData, [data.id]: false }));
        }
    };

    const confirmDeleteClient = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this data?");
        if (isConfirmed) {
            handleDeleteClient(id);
        }
    };

    return (
        <div className="">
            <table className="min-w-full">
                <thead className="bg-gray-100 sticky top-14">
                    <tr>
                        <th className="px-4 py-2">No.</th>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Shown</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto">
                    {clients.map((data, index) => (
                        <tr key={data.id}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                                <img src={'http://202.157.185.132:3000' + data.image_path} alt={`Image ${data.image_path}`} className="block h-16" />
                                <div>{data.image_path}</div>
                            </td>
                            <td className='hidden'><input type='hidden' value={data.image_path} /></td>
                            <td className="px-2 py-2 text-center">
                                <input
                                    type="checkbox"
                                    defaultChecked={data.shown}
                                    onChange={(e) => handleCheckboxChange(data.id, e.target.checked)}
                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                />
                            </td>
                            <td className="py-2 pr-2 text-center">
                                <div className="h-full grid grid-cols-1  place-items-center">
                                    <button
                                        onClick={() => confirmEditClient(data)}
                                        disabled={!dirtyData[data.id]}
                                        className={`px-2 py-1 col-span-1 rounded-md ${dirtyData[data.id]
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            } w-32 mb-1`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                                <button onClick={() => confirmDeleteClient(data.id)} className="px-2 py-1 col-span-1 rounded-md bg-red-500 text-white hover:bg-red-600 w-32 my-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-green-200">
                        <td className="px-4 py-2">...</td>
                        <td className="px-4 py-2">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <input
                                type="checkbox"
                                checked={shown}
                                onChange={handleShownChange}
                                className="border border-gray-300 px-2 py-1 rounded-md"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <button onClick={handleAddImage} className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 w-32 mb-1">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Clients;
