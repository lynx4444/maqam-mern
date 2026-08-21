import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    graves: 'Graves',
    maps: 'Maps',
    donation: 'Donation',
    search_placeholder: 'Search graves by name, IC number, or plot number...',
    title: 'Grave Records Management',
    description: 'Find, manage, and view grave plot information efficiently.',
    search: 'Search',
    add_new_record: 'Add New Record',
    edit_record: 'Edit Grave Record',
    finder: 'Grave Location Finder',
    Name: 'Name',
    icnumber: 'IC Number',
    dod: 'Date of Death',
    plot: 'Plot Number',
    photo: 'Photo',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save Grave',
    update: 'Update Grave',
    no_graves_found: 'No graves found matching your search.',
    no_photo: 'No Photo Available',
    view_photo: 'View Photo',
    gps_coordinates: 'GPS Coordinates',
    latitude: 'Latitude',
    longitude: 'Longitude',
    deceased_name: 'Deceased Name',
    notes: 'Notes / Remarks',
    upload_photo: 'Upload Picture (Optional)',
    max_file_size: 'Maximum file size: 5MB.',
    current_photo: 'Current Photo:',
    directions: 'Get Directions',
    walking_directions_shown: 'Walking directions displayed on map.',
    geo_error: 'Unable to retrieve your current location for routing.',
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    profile: 'Profile',
    guest: 'Guest',
    infaq_title: 'Infaq n Go',
    mosque_name: 'Masjid Al-Hidayah',
    fund_name: 'Tabung Pembangunan',
    bank_name: 'Agro Bank Berhad',
    account_number: '1005 5410 0001 0976',
    copied_account: 'Account number copied to clipboard!',
    copy_account: 'Copy Account Number',
    scan_qr: 'Scan QR Code to Infaq',
    confirm_delete: 'Are you sure you want to delete this grave record?',
  },
  bm: {
    welcome: 'Selamat Datang',
    dashboard: 'Papan Pemuka',
    graves: 'Kubur',
    maps: 'Peta',
    donation: 'Infaq',
    search_placeholder: 'Cari kubur berdasarkan nama, nombor IC, atau nombor plot...',
    title: 'Pengurusan Rekod Kubur',
    description: 'Cari, urus, dan lihat maklumat plot kubur dengan cekap.',
    search: 'Cari',
    add_new_record: 'Tambah Rekod Baru',
    edit_record: 'Kemaskini Rekod Kubur',
    finder: 'Pencari Lokasi Kubur',
    Name: 'Nama',
    icnumber: 'Nombor IC',
    dod: 'Tarikh Kematian',
    plot: 'Nombor Plot',
    photo: 'Gambar',
    actions: 'Tindakan',
    edit: 'Kemaskini',
    delete: 'Padam',
    cancel: 'Batal',
    save: 'Simpan Rekod',
    update: 'Kemaskini Rekod',
    no_graves_found: 'Tiada rekod kubur yang sepadan dengan carian anda.',
    no_photo: 'Tiada Gambar',
    view_photo: 'Lihat Gambar',
    gps_coordinates: 'Koordinat GPS',
    latitude: 'Latitud',
    longitude: 'Longitud',
    deceased_name: 'Nama Si Mati',
    notes: 'Nota / Catatan',
    upload_photo: 'Muat Naik Gambar (Pilihan)',
    max_file_size: 'Saiz fail maksimum: 5MB.',
    current_photo: 'Gambar Semasa:',
    directions: 'Dapatkan Arah Laluan',
    walking_directions_shown: 'Laluan berjalan kaki dipaparkan pada peta.',
    geo_error: 'Tidak dapat mengesan lokasi semasa anda untuk navigasi.',
    login: 'Log Masuk',
    register: 'Daftar',
    logout: 'Log Keluar',
    profile: 'Profil',
    guest: 'Tetamu',
    infaq_title: 'Infaq n Go',
    mosque_name: 'Masjid Al-Hidayah',
    fund_name: 'Tabung Pembangunan',
    bank_name: 'Agro Bank Berhad',
    account_number: '1005 5410 0001 0976',
    copied_account: 'Nombor akaun berjaya disalin ke papan keratan!',
    copy_account: 'Salin Nombor Akaun',
    scan_qr: 'Imbas Kod QR untuk Infaq',
    confirm_delete: 'Adakah anda pasti ingin memadamkan rekod kubur ini?',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('maqam_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('maqam_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'bm' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
