import React, { useState, useEffect } from "react";
import axios from "axios";

const Jobs = () => {
    const backendUrl = 'http://202.157.185.132:3030';
    const [jobs, setJobs] = useState([]);
    const initialNewJobState = {
        job_name: '',
        location: '',
        work_time: '',
        position: '',
        summary: '',
        requirements: [],
        job_desc: [],
        optional_info: '',
        shown: 0,
    };
    const [newJob, setNewJob] = useState(initialNewJobState);
    const [dirtyJobs, setDirtyJobs] = useState({});

    useEffect(() => {
        axios.get(backendUrl + "/jobs").then((response) => {
            setJobs(response.data);
        });
    }, []);

    const handleNewInputChange = (key, value) => {
        setNewJob((prevJob) => ({ ...prevJob, [key]: value }));
    };

    const handleNewArrayInputChange = (field, value) => {
        setNewJob((prevNewJob) => ({
            ...prevNewJob,
            [field]: value.split(';').map((item) => item.trim()),
        }));
    };

    const handleAddJob = async () => {
        if (
            !newJob.job_name ||
            !newJob.location ||
            !newJob.work_time ||
            !newJob.position
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post(backendUrl + "/jobs", newJob);
            const createdJob = response.data;
            setJobs((prevJobs) => [...prevJobs, createdJob]);
            setNewJob(initialNewJobState);
            axios.get(backendUrl + "/jobs").then((response) => {
                setJobs(response.data);
            });
        } catch (error) {
            console.error('Error creating job:', error);
            // Handle error
        }
    };

    const handleEditJob = (job) => {
        axios.put(backendUrl + "/jobs/" + job.id, job).then((response) => {
            setJobs([...jobs, response.data]);
            axios.get(backendUrl + "/jobs").then((response) => {
                setJobs(response.data);
            });
        });
    };

    const handleInputChange = (id, fieldName, value) => {
        setJobs((prevJobs) => {
            const updatedJobs = prevJobs.map((job) => {
                if (job.id === id) {
                    setDirtyJobs((prevDirtyJobs) => ({ ...prevDirtyJobs, [id]: true }));
                    return { ...job, [fieldName]: value };
                }
                return job;
            });
            return updatedJobs;
        });
    };

    const handleArrayInputChange = (id, fieldName, value) => {
        setJobs((prevJobs) => {
            const updatedJobs = prevJobs.map((job) => {
                if (job.id === id) {
                    const updatedArray = value.split(';').map((item) => item.trim());
                    setDirtyJobs((prevDirtyJobs) => ({ ...prevDirtyJobs, [id]: true }));
                    return { ...job, [fieldName]: updatedArray };
                }
                return job;
            });
            return updatedJobs;
        });
    };

    const handleCheckboxChange = (id, checked) => {
        setJobs((prevJobs) => {
            const updatedJobs = prevJobs.map((job) => {
                if (job.id === id) {
                    setDirtyJobs((prevDirtyJobs) => ({ ...prevDirtyJobs, [id]: true }));
                    return { ...job, shown: checked };
                }
                return job;
            });
            return updatedJobs;
        });
    };

    const handleDeleteJob = (id) => {
        axios.delete(backendUrl + "/jobs/" + id).then((response) => {
            setJobs(jobs.filter((job) => job.id !== id));
        });
    };

    const confirmEditJob = (job) => {
        if (
            !job.job_name ||
            !job.location ||
            !job.work_time ||
            !job.position
        ) {
            alert('Please fill in all required fields.');
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to edit this job?");
        if (isConfirmed) {
            handleEditJob(job);
            setDirtyJobs((prevDirtyJobs) => ({ ...prevDirtyJobs, [job.id]: false }));
        }
    };

    const confirmDeleteJob = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this job?");
        if (isConfirmed) {
            handleDeleteJob(id);
        }
    };

    return (
        <div className="">
            <table className="min-w-full">
                <thead className="bg-gray-100 sticky top-14">
                    <tr>
                        <th className="px-4 py-2">No.</th>
                        <th className="px-4 py-2">Job Name <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Location <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Work Time <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Industry <span className="text-red-500">*</span></th>
                        <th className="px-4 py-2">Summary</th>
                        <th className="px-4 py-2">Requirements (;)</th>
                        <th className="px-4 py-2">Job Description (;)</th>
                        <th className="px-4 py-2">Optional Info</th>
                        <th className="px-4 py-2">Shown</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto">
                    {jobs.map((job, index) => (
                        <tr key={job.id}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={job.job_name}
                                    onChange={(e) => handleInputChange(job.id, 'job_name', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-64"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={job.location}
                                    onChange={(e) => handleInputChange(job.id, 'location', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-64"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={job.work_time}
                                    onChange={(e) => handleInputChange(job.id, 'work_time', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-64"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="text"
                                    defaultValue={job.position}
                                    onChange={(e) => handleInputChange(job.id, 'position', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-64"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <textarea
                                    defaultValue={job.summary}
                                    onChange={(e) => handleInputChange(job.id, 'summary', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <textarea
                                    defaultValue={job.requirements && job.requirements.join('; ')}
                                    onChange={(e) => handleArrayInputChange(job.id, 'requirements', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <textarea
                                    defaultValue={job.job_desc && job.job_desc.join('; ')}
                                    onChange={(e) => handleArrayInputChange(job.id, 'job_desc', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                                />
                            </td>
                            <td className="px-4 py-2">
                                <textarea
                                    defaultValue={job.optional_info}
                                    onChange={(e) => handleInputChange(job.id, 'optional_info', e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                                />
                            </td>
                            <td className="px-2 py-2 text-center">
                                <input
                                    type="checkbox"
                                    defaultChecked={job.shown}
                                    onChange={(e) => handleCheckboxChange(job.id, e.target.checked)}
                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                />
                            </td>
                            <td className="py-2 pr-2 text-center">
                                <div className="h-full grid grid-cols-1">
                                    <button
                                        onClick={() => confirmEditJob(job)}
                                        disabled={!dirtyJobs[job.id]}
                                        className={`px-2 py-1 col-span-1 rounded-md ${dirtyJobs[job.id]
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            } w-32 mb-1`}
                                    >
                                        Save Changes
                                    </button>
                                    <button onClick={() => confirmDeleteJob(job.id)} className="px-2 py-1  col-span-1 rounded-md bg-red-500 text-white hover:bg-red-600 w-32 my-1">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))
                    }
                    <tr className="bg-green-200">
                        <td className="px-4 py-2">...</td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.job_name}
                                onChange={(e) => handleNewInputChange('job_name', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.location}
                                onChange={(e) => handleNewInputChange('location', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.work_time}
                                onChange={(e) => handleNewInputChange('work_time', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.position}
                                onChange={(e) => handleNewInputChange('position', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-64"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.summary}
                                onChange={(e) => handleNewInputChange('summary', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.requirements && newJob.requirements.join('; ')}
                                onChange={(e) => handleNewArrayInputChange('requirements', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.job_desc && newJob.job_desc.join('; ')}
                                onChange={(e) => handleNewArrayInputChange('job_desc', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                            />
                        </td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={newJob.optional_info}
                                onChange={(e) => handleNewInputChange('optional_info', e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-96 h-32 resize-none"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <input
                                type="checkbox"
                                checked={newJob.shown}
                                onChange={(e) => handleNewInputChange('shown', e.target.checked)}
                                className="border border-gray-300 px-2 py-1 rounded-md"
                            />
                        </td>
                        <td className="py-2 pr-2 text-center">
                            <button onClick={handleAddJob} className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 w-32 mb-1">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Jobs;