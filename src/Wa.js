import React, { useState, useEffect } from "react";
import axios from "axios";

const Wa = () => {
    const backendUrl = 'http://202.157.185.132:3030';
    const [wa, setWa] = useState([]);
    const initialNewDataState = {
        url: '',
        shown: 0,
    };
    const [newWa, setNewWa] = useState(initialNewDataState);
    const [dirtyData, setDirtyData] = useState({});

    useEffect(() => {
        axios.get(backendUrl + "/social_media_wa").then((response) => {
            setWa(response.data);
        });
    }, []);

    const handleNewInputChange = (key, value) => {
        setNewWa((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleNewArrayInputChange = (field, value) => {
        setNewWa((prevNewData) => ({
            ...prevNewData,
            [field]: value.split(';').map((item) => item.trim()),
        }));
    };

    const handleAddData = async () => {
        if (
            !newWa.url
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post(backendUrl + "/social_media_wa", newWa);
            const createdData = response.data;
            setWa((prevData) => [...prevData, createdData]);
            setNewWa(initialNewDataState);
            axios.get(backendUrl + "/social_media_wa").then((response) => {
                setWa(response.data);
            });
        } catch (error) {
            console.error('Error creating data:', error);
            // Handle error
        }
    };

    const handleEditData = (data) => {
        axios.put(backendUrl + "/social_media_wa/" + data.id, data).then((response) => {
            setWa([...wa, response.data]);
            axios.get(backendUrl + "/social_media_wa").then((response) => {
                setWa(response.data);
            });
        });
    };

    const handleInputChange = (id, fieldName, value) => {
        setWa((prevData) => {
            const updatedData = prevData.map((data) => {
                if (data.id === id) {
                    setDirtyData((prevDirtyData) => ({ ...prevDirtyData, [id]: true }));
                    return { ...data, [fieldName]: value };
                }
                return data;
            });
            return updatedData;
        });
    };

    const handleArrayInputChange = (id, fieldName, value) => {
        setWa((prevData) => {
            const updatedData = prevData.map((data) => {
                if (data.id === id) {
                    const updatedArray = value.split(';').map((item) => item.trim());
                    setDirtyData((prevDirtyData) => ({ ...prevDirtyData, [id]: true }));
                    return { ...data, [fieldName]: updatedArray };
                }
                return data;
            });
            return updatedData;
        });
    };

    const handleCheckboxChange = (id, checked) => {
        setWa((prevData) => {
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

    const handleDeleteData = (id) => {
        axios.delete(backendUrl + "/social_media_wa/" + id).then((response) => {
            setWa(wa.filter((data) => data.id !== id));
        });
    };

    const confirmEditData = (data) => {
        if (
            !data.url
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to edit this data?");
        if (isConfirmed) {
            handleEditData(data);
            setDirtyData((prevDirtyData) => ({ ...prevDirtyData, [data.id]: false }));
        }
    };

    const confirmDeleteData = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this data?");
        if (isConfirmed) {
            handleDeleteData(id);
        }
    };

    return (
        <div className="">
            <table className="min-w-full">
                <thead className="bg-gray-100 sticky top-14">
                    <tr>
                        <th className="px-4 py-2">No.</th>
                        <th className="px-4 py-2">URL (Only 1 'shown' data, else it'll throw error) <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Shown</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto">
                    {wa.map((data, index) => (
                        <tr key={data.id}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={data.url}
                                    onChange={(e) => handleInputChange(data.id, 'url', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-64"
                                />
                            </td>
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
                                        onClick={() => confirmEditData(data)}
                                        disabled={!dirtyData[data.id]}
                                        className={`px-2 py-1 col-span-1 rounded-md ${dirtyData[data.id]
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            } w-32 mb-1`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                                <button onClick={() => confirmDeleteData(data.id)} className="px-2 py-1 col-span-1 rounded-md bg-red-500 text-white hover:bg-red-600 w-32 my-1">Delete</button>
                            </td>
                        </tr>
                    ))
                    }
                    <tr className="bg-green-200">
                        <td className="px-4 py-2">...</td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newWa.url}
                                onChange={(e) => handleNewInputChange('url', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <input
                                type="checkbox"
                                checked={newWa.shown}
                                onChange={(e) => handleNewInputChange('shown', e.target.checked)}
                                className="border border-gray-300 px-2 py-1 rounded-md"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <button onClick={handleAddData} className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 w-32 mb-1">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Wa;