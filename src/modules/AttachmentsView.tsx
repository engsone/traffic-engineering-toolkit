/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { ATTACHMENTS_DATA, fileUrl } from "../data/lookupTables";
import { AttachmentItem } from "../types";
import { Search, Download, Upload, FileText, Check, Plus, Trash2, Link as LinkIcon } from "lucide-react";

export default function AttachmentsView() {
  const [attachments, setAttachments] = useState<AttachmentItem[]>(ATTACHMENTS_DATA);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  // Custom link/file state additions
  const [newTitleAr, setNewTitleAr] = useState<string>("");
  const [newTitleEn, setNewTitleEn] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("1.5 MB");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const filteredAttachments = attachments.filter((att) => {
    return (
      att.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDownload = (att: AttachmentItem) => {
    if (att.fileName) {
      window.open(fileUrl("المراجع", att.fileName), "_blank");
    } else {
      setDownloadedId(att.id);
      setTimeout(() => {
        setDownloadedId(null);
        alert(`محاكاة تحميل الملف المرفق بنجاح:\n- الاسم: ${att.titleAr}\n- الحجم: ${att.size}`);
      }, 1000);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المرفق المضاف من قائمتك؟")) {
      setAttachments(attachments.filter((a) => a.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr) return;

    const addedItem: AttachmentItem = {
      id: `custom_${Date.now()}`,
      titleAr: newTitleAr,
      titleEn: newTitleEn || "User Added Attachment File",
      descriptionAr: newDesc || "ملف مرجعي أو رابط تمت إضافته يدوياً من قبل مهندس السلامة الميداني.",
      size: newSize
    };

    setAttachments([addedItem, ...attachments]);
    setNewTitleAr("");
    setNewTitleEn("");
    setNewDesc("");
    setNewSize("1.5 MB");
    setShowAddForm(false);
  };

  // Drag and Drop simulation handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      const sizeStr = (droppedFile.size / (1024 * 1024)).toFixed(1) + " MB";
      
      const addedItem: AttachmentItem = {
        id: `custom_${Date.now()}`,
        titleAr: droppedFile.name.replace(/\.[^/.]+$/, ""),
        titleEn: "Local Dragged File",
        descriptionAr: "مستند تم سحبه وإفلاته بالواجهة للاحتفاظ به بمخازن المحاكاة الميدانية.",
        size: sizeStr
      };

      setAttachments([addedItem, ...attachments]);
      alert(`تم بنجاح تحميل وقبول مستند: ${droppedFile.name} بمخازن التطبيق الميداني.`);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selected = files[0];
      const sizeStr = (selected.size / (1024 * 1024)).toFixed(1) + " MB";
      
      const addedItem: AttachmentItem = {
        id: `custom_${Date.now()}`,
        titleAr: selected.name.replace(/\.[^/.]+$/, ""),
        titleEn: "Local Uploaded File",
        descriptionAr: "مستند تم إرفاقه من مستكشف الجهاز الفني.",
        size: sizeStr
      };

      setAttachments([addedItem, ...attachments]);
      alert(`تم إضافة مستند: ${selected.name}`);
    }
  };

  return (
    <div id="attachments-view-module" className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-primary">الفواصل الفنية والملحقات الإرشادية</h2>
            <p className="text-brand-muted text-sm leading-relaxed mt-1">
              مجموعة من وثائق التحضير والأدلة الميدانية المرفقة المعدة للطباعة والتشغيل السريع، مع إمكانية إرفاق ومزامنة ملفات AutoCAD أو روابط كود الطرق السعودي (SRC).
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 text-xs transition-all font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رابط مرجعي أو ملف</span>
          </button>
        </div>

        {/* Custom Add form state */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 space-y-4 text-right">
            <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1">
              <LinkIcon className="w-4 h-4 text-brand-primary" />
              <span>تسجيل ملف/رابط مرجعي مساند جديد</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">الاسم بالعربية للمرفق (حقل إجباري)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كتيب استلام أعمال تكسيات الردم"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">الاسم بالإنجليزية (إختياري)</label>
                <input
                  type="text"
                  placeholder="e.g., Embankment inspection guidelines"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">المضمون والملخص الاسترشادي</label>
                <textarea
                  placeholder="أدخل ملخص المرفق أو أهدافه لمساعدتك ميدانياً..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 h-20 bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">حجم المستند أو طبيعته</label>
                <input
                  type="text"
                  placeholder="مثال: 5.4 MB أو رابط PDF"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-1.5 px-3 bg-white text-gray-500 rounded border border-gray-200 text-xs font-bold"
              >
                إلغاء التراجع
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-brand-primary text-white rounded text-xs font-bold hover:bg-opacity-90"
              >
                تثبيت المستند
              </button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="البحث في المرفقات الإرشادية الخاصة بالمهندس م. حسان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 bg-slate-50 focus:ring-1 focus:ring-brand-primary outline-none"
          />
        </div>

        {/* Drag & Drop simulated block */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileClick}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-6 ${
            isDragging
              ? "border-brand-primary bg-brand-primary/5"
              : "border-gray-200 hover:border-brand-primary bg-slate-50 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.dwg,.doc,.docx,.xls,.xlsx,.png,.jpg"
          />
          <Upload className="w-8 h-8 text-brand-primary mx-auto mb-2" />
          <h4 className="text-xs font-bold text-gray-800">سحب وإفلات ملفات السلامة الإضافية هنا</h4>
          <p className="text-[10px] text-gray-400 mt-1">نسق مقبول: PDF, CAD DWG, Excel. يمكنك الإفلات أو النقر مباشرة لاستيراد الملفات يدوياً.</p>
        </div>

        {/* List of files */}
        <div className="space-y-3">
          {filteredAttachments.map((att) => (
            <div
              key={att.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-primary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
            >
              <div className="flex gap-3 items-start">
                <div className="bg-brand-primary/10 p-2.5 rounded-lg text-brand-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-xs">
                    {att.titleAr}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono font-medium">
                    {att.titleEn}
                  </p>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    {att.descriptionAr}
                  </p>
                </div>
              </div>

              {/* Download or delete */}
              <div className="flex gap-2 items-center w-full sm:w-auto shrink-0 justify-end">
                <span className="text-[10px] font-mono text-gray-400 font-bold ml-2">
                  {att.size}
                </span>

                <button
                  onClick={() => handleDownload(att)}
                  disabled={downloadedId === att.id}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded text-xs transition-colors font-bold ${
                    downloadedId === att.id
                      ? "bg-slate-100 text-slate-400"
                      : "bg-brand-primary text-white hover:bg-opacity-90"
                  }`}
                >
                  {downloadedId === att.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-success" />
                      <span>قيد التحميل...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل النسخة</span>
                    </>
                  )}
                </button>

                {/* If custom user item allow deleting */}
                {att.id.startsWith("custom_") && (
                  <button
                    onClick={() => handleDelete(att.id)}
                    className="p-1.5 border border-red-200 text-brand-danger hover:bg-red-50 rounded"
                    title="حذف المستند المضاف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAttachments.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              لا توجد مرفقات استرشادية لمهندس تبوك مطابقة لبحثك المحدد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
