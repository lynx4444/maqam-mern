import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, MapPin, Eye } from 'lucide-react';
import { Toast } from '../components/Toast';

export const AdminGraveList = () => {
  const { t } = useLanguage();
  const [graves, setGraves] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModalGrave, setDeleteModalGrave] = useState(null);

  useEffect(() => {
    fetchGraves();
  }, []);

  const fetchGraves = async (searchQuery = '') => {
    try {
      setLoading(true);
      const url = searchQuery ? `/graves?search=${encodeURIComponent(searchQuery)}` : '/graves';
      const res = await api.get(url);
      setGraves(res.data);
    } catch (err) {
      console.error('Failed to fetch graves', err);
      setToast({ message: 'Error loading graves list', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGraves(search);
  };

  const handleDelete = async () => {
    if (!deleteModalGrave) return;

    try {
      await api.delete(`/graves/${deleteModalGrave._id}`);
      setGraves(graves.filter((g) => g._id !== deleteModalGrave._id));
      setToast({ message: 'Grave record deleted successfully', type: 'success' });
      setDeleteModalGrave(null);
    } catch (err) {
      console.error('Delete error', err);
      setToast({ message: 'Failed to delete record', type: 'error' });
    }
  };

  const isHighlighted = (grave) => {
    if (!search.trim()) return false;
    const term = search.toLowerCase();
    return (
      grave.name?.toLowerCase().includes(term) ||
      grave.ic_number?.toLowerCase().includes(term) ||
      grave.plot_number?.toLowerCase().includes(term)
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f7f7] py-10 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
          <span className="text-lime-600">{t('title')}</span>
        </h1>
        <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
          {t('description')}
        </p>
      </header>

      {/* Search and Action Bar */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white shadow-xl rounded-2xl border border-gray-100">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-2/3">
          <div className="flex items-center space-x-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition text-sm flex items-center shrink-0"
            >
              {t('search')}
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchGraves('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 border rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Add Record Button */}
        <Link
          to="/admin/graves/create"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition duration-300 ease-in-out flex items-center justify-center space-x-2 shrink-0 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>{t('add_new_record')}</span>
        </Link>
      </div>

      {/* Grave Records Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('Name')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('icnumber')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('dod')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('plot')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('photo')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="inline-block w-6 h-6 border-2 border-lime-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Loading records...
                  </td>
                </tr>
              ) : graves.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500 italic"
                  >
                    {t('no_graves_found')}
                  </td>
                </tr>
              ) : (
                graves.map((grave) => {
                  const highlighted = isHighlighted(grave);
                  return (
                    <tr
                      key={grave._id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        highlighted ? 'bg-amber-50/70' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {grave.name}
                        <div className="text-xs text-gray-400 font-normal mt-0.5 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-lime-600" />
                          GPS: {grave.gps_lat}, {grave.gps_lng}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {grave.ic_number || <span className="text-gray-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {grave.date_of_death}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                          {grave.plot_number}
                        </span>
                      </td>
                      {/* Photo Thumbnail */}
                      <td className="px-6 py-4">
                        {grave.photo ? (
                          <div
                            onClick={() => setPreviewImage(grave.photo)}
                            className="relative group cursor-pointer w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                          >
                            <img
                              src={grave.photo}
                              alt="Grave"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            {t('no_photo')}
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-3">
                          <Link
                            to={`/admin/graves/${grave._id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition font-medium"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            {t('edit')}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteModalGrave(grave)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalGrave && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Grave Record?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to permanently delete the record for{' '}
              <strong className="text-gray-800">{deleteModalGrave.name}</strong> (Plot{' '}
              {deleteModalGrave.plot_number})? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setDeleteModalGrave(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition shadow-md"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
