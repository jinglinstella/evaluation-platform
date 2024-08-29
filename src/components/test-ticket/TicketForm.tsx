"use client"

import React, {useState} from 'react'
import { useRouter } from 'next/navigation';
import { Stack } from '@mui/system';

const TicketForm = ({ticket, EDITMODE}: any) => {
    const router = useRouter();
    // const EDITMODE = ticket._id === "new" ? false : true;
    const startingTicketData = {
        title: "test",
        description: "test",
        priority: 1,
        progress: 50,
        status: "not started",
        category: "Project",
      };    
    const [formData, setFormData] = useState(startingTicketData);
    const formStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '50%',
      };
    console.log("ticket: ", ticket);
    const handleChange = (e:any) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setFormData((preState: any) => ({
          ...preState,
          [name]: value, //this is dynamic, "name" can be any of the properties
        }));
      };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (EDITMODE) {
            const res = await fetch(`/api/Tickets/${ticket._id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ formData }),
                });
                if (!res.ok) {
                    throw new Error("Failed to update ticket");
                }
        } else {
            const res = await fetch("/api/Tickets", {
                method: "POST",
                body: JSON.stringify({ formData }),
                //@ts-ignore
                "Content-Type": "application/json",
            });
            if (!res.ok) {
                throw new Error("Failed to create ticket");
            }
        }
        router.refresh();
        router.push("/");
    };
        
    return (
        <Stack>
        <form style={formStyles} onSubmit={handleSubmit} method="post">
            <h3>{EDITMODE? "Edit your ticket" : "Create your ticket"}</h3>
            <label>Title</label>
            <input 
                type="text"
                name="title"
                id="title"
                onChange={handleChange}
                required={true}
                value={formData.title}
            />

            <label>Description</label>
            <input 
                type="text"
                name="description"
                id="description"
                onChange={handleChange}
                required={true}
                value={formData.description}
            />

            
            <label>Category</label>
            <select
                name="description"
                value={formData.category}
                onChange={handleChange}
            >
                <option value="hardware problem">Hardware Problem</option>
                <option value="software problem">Software Problem</option>
                <option value="project">Project</option>
            </select>

            <label>Priority</label>
            <div>
            <input
                id="priority-1"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={1}
                checked={formData.priority == 1}
            />
            <label>1</label>
            <input
                id="priority-2"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={2}
                checked={formData.priority == 2}
            />
            <label>2</label>
            <input
                id="priority-3"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={3}
                checked={formData.priority == 3}
            />
            <label>3</label>
            <input
                id="priority-4"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={4}
                checked={formData.priority == 4}
            />
            <label>4</label>
            <input
                id="priority-5"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={5}
                checked={formData.priority == 5}
            />
            <label>5</label>
            </div>

            <label>Progress</label>
            <input
                type="range"
                id="progress"
                name="progress"
                value={formData.progress}
                min="0"
                max="100"
                onChange={handleChange}
            />

            <label>Status</label>
            <select name="status" value={formData?.status} onChange={handleChange}>
                <option value="not started">Not Started</option>
                <option value="started">Started</option>
                <option value="done">Done</option>
            </select>

            <input
                type="submit"
                value={EDITMODE ? "Edit Ticket" : "Create Ticket"}
            />

        </form>
        </Stack>
    )
}

export default TicketForm
