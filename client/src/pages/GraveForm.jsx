import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { PlusCircle, Edit3, ArrowLeft, Save, Upload, MapPin, AlertCircle } from 'lucide-react';
import { Toast } from '../components/Toast';

export const GraveForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    ic_number: '',
    date_of_death: '',
    plot_number: '',
    gps_lat: '2.909680',
    gps_lng: '101.464500',
    notes: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchGrave();
    }
  }, [id]);

  const fetchGrave = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/graves/${id}`);
      const data = res.data;
      setFormData({
        name: data.name || '',
        ic_number: data.ic_number || '',
        date_of_death: data.date_of_death || '',
        plot_number: data.plot_number || '',
        gps_lat: data.gps_lat || '',
        gps_lng: data.gps_lng || '',
        notes: data.notes || '',
      });
      if (data.photo) {
        setCurrentPhoto(data.photo);
      }
    } catch (err) {
      console.error('Fetch grave error', err);
      setToast({ message: 'Error loading grave record details', type: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'File size exceeds 5MB limit.', type: 'warning' });
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Deceased name is required';
    if (!formData.date_of_death) newErrors.date_of_death = 'Date of death is required';
    if (!formData.plot_number.trim()) newErrors.plot_number = 'Plot number is required';
    if (!formData.gps_lat.trim()) newErrors.gps_lat = 'GPS Latitude is required';
    if (!formData.gps_lng.trim()) newErrors.gps_lng = 'GPS Longitude is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ message: 'Please fill in all required fields.', type: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('ic_number', formData.ic_number);
      data.append('date_of_death', formData.date_of_death);
      data.append('plot_number', formData.plot_number);
      data.append('gps_lat', formData.gps_lat);
      data.append('gps_lng', formData.gps_lng);
      data.append('notes', formData.notes);

      if (photoFile) {
        data.append('photo', photoFile);
      }

      if (isEditMode) {
        await api.put(`/graves/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ message: 'Grave record updated successfully!', type: 'success' });
      } else {
        await api.post('/graves', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ message: 'Grave record added successfully!', type: 'success' });
      }

      setTimeout(() => {
        navigate('/admin/graves');
      }, 1000);
    } catch (err) {
      console.error('Save grave error', err);
      setToast({
        message: err.response?.data?.message || 'Failed to save grave record',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f3f4f6] py-10 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center">
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {isEditMode ? t('edit_record') : t('add_new_record')}
              </h2>
              <p className="text-xs text-gray-500">
                {isEditMode
                  ? 'Update existing grave marker information'
                  : 'Register a new grave plot record into the cemetery database'}
              </p>
            </div>
          </div>

          <Link
            to="/admin/graves"
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & IC Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('deceased_name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="E.g., John Doe"
                className={`block w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('icnumber')} (Optional)
              </label>
              <input
                type="text"
                name="ic_number"
                value={formData.ic_number}
                onChange={handleInputChange}
                placeholder="E.g., 901231-14-5678"
                className="block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Date of Death & Plot Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('dod')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_death"
                value={formData.date_of_death}
                onChange={handleInputChange}
                className={`block w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition ${
                  errors.date_of_death ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.date_of_death && (
                <p className="text-xs text-red-500 mt-1">{errors.date_of_death}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('plot')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plot_number"
                value={formData.plot_number}
                onChange={handleInputChange}
                placeholder="E.g., A-102"
                className={`block w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition ${
                  errors.plot_number ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.plot_number && (
                <p className="text-xs text-red-500 mt-1">{errors.plot_number}</p>
              )}
            </div>
          </div>

          {/* GPS Coordinates Fieldset */}
          <fieldset className="border border-lime-200 bg-lime-50/40 p-4 rounded-xl">
            <legend className="text-xs font-bold text-lime-900 px-2 flex items-center uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 mr-1 text-lime-600" />
              {t('gps_coordinates')}
            </legend>
            <p className="text-xs text-gray-500 mb-3">
              Enter decimal GPS coordinates for Google Maps pin location and navigation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('latitude')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gps_lat"
                  value={formData.gps_lat}
                  onChange={handleInputChange}
                  placeholder="E.g., 2.909680"
                  className={`block w-full border bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition ${
                    errors.gps_lat ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.gps_lat && (
                  <p className="text-xs text-red-500 mt-1">{errors.gps_lat}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('longitude')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gps_lng"
                  value={formData.gps_lng}
                  onChange={handleInputChange}
                  placeholder="E.g., 101.464500"
                  className={`block w-full border bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition ${
                    errors.gps_lng ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.gps_lng && (
                  <p className="text-xs text-red-500 mt-1">{errors.gps_lng}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Picture Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('upload_photo')}
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-lime-100 file:text-lime-800 hover:file:bg-lime-200 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{t('max_file_size')}</p>

            {/* Photo Previews */}
            <div className="mt-3 flex items-center space-x-4">
              {photoPreview && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">New Selected:</p>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-lime-500 shadow"
                  />
                </div>
              )}

              {currentPhoto && !photoPreview && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{t('current_photo')}</p>
                  <img
                    src={currentPhoto}
                    alt="Current"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-300 shadow"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('notes')}
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional plot or location instructions..."
              className="block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              to="/admin/graves"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              {t('cancel')}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {loading
                  ? 'Saving...'
                  : isEditMode
                  ? t('update')
                  : t('save')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
