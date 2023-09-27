import React, { useState, useEffect } from "react";
import axios from "axios";

const Industries = () => {
    const backendUrl = 'http://202.157.185.132:3030';
    const [industries, setIndustries] = useState([]);
    const initialNewDataState = {
        industry_name: '',
        shown: 0,
    };
    const [newIndustry, setNewIndustry] = useState(initialNewDataState);
    const [dirtyData, setDirtyData] = useState({});

    useEffect(() => {
        axios.get(backendUrl + "/industries").then((response) => {
            setIndustries(response.data);
        });
    }, []);

    const handleNewInputChange = (key, value) => {
        setNewIndustry((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleNewArrayInputChange = (field, value) => {
        setNewIndustry((prevNewData) => ({
            ...prevNewData,
            [field]: value.split(';').map((item) => item.trim()),
        }));
    };

    const handleAddData = async () => {
        if (
            !newIndustry.industry_name
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post(backendUrl + "/industries", newIndustry);
            const createdIndustry = response.data;
            setIndustries((prevData) => [...prevData, createdIndustry]);
            setNewIndustry(initialNewDataState);
            axios.get(backendUrl + "/industries").then((response) => {
                setIndustries(response.data);
            });
        } catch (error) {
            console.error('Error creating data:', error);
            // Handle error
        }
    };

    const handleEditData = (data) => {
        axios.put(backendUrl + "/industries/" + data.id, data).then((response) => {
            setIndustries([...industries, response.data]);
            axios.get(backendUrl + "/industries").then((response) => {
                setIndustries(response.data);
            });
        });
    };

    const handleInputChange = (id, fieldName, value) => {
        setIndustries((prevData) => {
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
        setIndustries((prevData) => {
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
        setIndustries((prevData) => {
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
        axios.delete(backendUrl + "/industries/" + id).then((response) => {
            setIndustries(industries.filter((data) => data.id !== id));
        });
    };

    const confirmEditData = (data) => {
        if (
            !data.industry_name
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
                        <th className="px-4 py-2">Industry Name <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Shown</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto">
                    {industries.map((data, index) => (
                        <tr key={data.id}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={data.industry_name}
                                    onChange={(e) => handleInputChange(data.id, 'industry_name', e.target.value)}
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
                                value={newIndustry.industry_name}
                                onChange={(e) => handleNewInputChange('industry_name', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <input
                                type="checkbox"
                                checked={newIndustry.shown}
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

export default Industries;