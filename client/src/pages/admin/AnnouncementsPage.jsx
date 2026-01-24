import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncements, addAnnouncement, deleteAnnouncement } from 'store/slices/announcementSlice';
import Button from 'components/ui/Button';
import Image from 'components/AppImage';
import { API_ENDPOINTS } from 'config/api';

const AnnouncementsPage = () => {
    const dispatch = useDispatch();
    const announcementState = useSelector(state => state.announcements) || { items: [], status: 'idle' };
    const announcements = announcementState.items || [];
    const status = announcementState.status || 'idle';

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            alert("Title is required");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create NEW Announcement Object (TEXT ONLY)
            const newAnnouncement = {
                title,
                description,
            };

            // 1. Create NEW Announcement (Backend now auto-clears old ones)
            await dispatch(addAnnouncement(newAnnouncement)).unwrap();

            // 2. Refresh local state
            await dispatch(fetchAnnouncements()).unwrap();

            // Reset
            setTitle('');
            setDescription('');
            alert('Announcement Published Successfully!');

        } catch (error) {
            console.error('Announcements Error:', error);
            alert('Failed to publish: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this announcement?")) {
            dispatch(deleteAnnouncement(id)).then(() => {
                dispatch(fetchAnnouncements());
            });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Announcements (Text-Only Hero)</h1>
            <p className="text-gray-500">The current active announcement will be displayed prominently on the homepage.</p>

            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">Publish New Announcement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (Major Offer)</label>
                        <input
                            className="w-full border p-2 rounded focus:ring-1 focus:ring-black outline-none"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. GET FLAT 50% OFF ON ALL CROCS!"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (Secondary Details)</label>
                        <textarea
                            className="w-full border p-2 rounded focus:ring-1 focus:ring-black outline-none font-bold text-black"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="e.g. Valid until Sunday only. Visit us now!"
                            rows="3"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => window.open('/', '_blank')}>Preview Store</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Publishing...
                                </div>
                            ) : 'Publish Announcement'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Current Active Announcement</h2>
                {announcements.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow border flex justify-between items-start relative border-green-200 bg-green-50/30">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-xl">{announcements[0].title}</h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                            </div>
                            <p className="text-black text-xl font-bold">{announcements[0].description}</p>
                            <p className="text-xs text-gray-400 mt-4">Published: {new Date(announcements[0].createdAt).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(announcements[0]._id || announcements[0].id)}
                            className="text-red-500 text-sm font-medium hover:underline bg-red-50 px-3 py-1 rounded-lg"
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No active announcement. Publish one above.</p>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
