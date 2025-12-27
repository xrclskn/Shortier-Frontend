import React from 'react';
import { Save, Eye, Undo, Redo, ArrowLeft } from 'lucide-react';
import { NavLink } from "react-router-dom";

const NavDesigner = ({
    onSave,
    onPreview,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    isSaving = false,
    lastSaved = null,
    profile
}) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 rounded-t-xl z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo ve Başlık */}
                    <div className="flex items-center space-x-3 ">
                        <div>
                            <h1 className="text-3xl font-bold font-handwritten text-[#010101]">Shortier</h1>
                        </div>
                    </div>

                    {/* Orta Kontroller */}
                    <div className="hidden md:flex items-center space-x-2">

                        {/* Burada profilin son güncellenme tarihi yazsın lastsaved tetiklenmeden önce tetiklenince kaybolsun */}


                        {lastSaved && (
                            <span className="text-sm text-gray-500">
                                Son kaydedilme: {lastSaved}
                            </span>
                        )}


                        {!lastSaved && profile?.updatedAt && (
                            <span className="text-sm text-gray-500">
                                <span className="font-semibold">Son güncelleme tarihi : </span>  {profile.updatedAt}
                            </span>
                        )}


                    </div>

                    {/* Sağ Butonlar */}
                    <div className="flex items-center space-x-3">
                        <NavLink to={"/app"}
                            className="flex items-center space-x-2 px-4 py-2 text-white bg-[#010101] hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </NavLink>

                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#010101]  text-white rounded-lg  hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <Save size={18} />
                            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};


export default NavDesigner;