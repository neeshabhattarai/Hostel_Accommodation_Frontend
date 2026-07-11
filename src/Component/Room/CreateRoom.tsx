import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { PostRoom } from "../../api/RoomApi";
import { toast } from "react-toastify";
import { hostelApi } from "../../api/hostelApi";

export interface CreateRoomFormData {
  Room_Description: string;
  Room_Status: string;
  HostelId: string;
  Room_Price: number;
  Room_ImageFiles: FileList;
  // ── New fields ──
  Capacity: number;
  CurrentOccupancy: number;
  RoomType: string;
  Floor: string;
}

const ROOM_STATUSES = ["full", "open", "closed"];
const ROOM_TYPES = ["Single", "Double", "Triple"];
const FLOOR_OPTIONS = [
  { label: "Ground Floor", value: 0 },
  { label: "First Floor",  value: 1  },
  { label: "Second Floor", value:2 },
  { label: "Third Floor",  value:3  },
  { label: "Fourth Floor", value:4 },
];

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_EXTS = ["png", "jpg", "jpeg"];
const ALLOWED_EXTENSIONS_LABEL = ".png, .jpg, .jpeg";
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 8;
const MIN_FILES = 1;

interface Hostel {
  hostelId: string;
  name: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

interface FileValidationError {
  fileName: string;
  reason: string;
}

const isValidImageFile = (file: File): boolean => {
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.type);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extOk = ALLOWED_EXTS.includes(ext);
  return mimeOk || extOk;
};

const generateId = () => Math.random().toString(36).slice(2, 10);

const CreateRoom = () => {
  const [serverError, setServerError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<FileValidationError[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [hostelsLoading, setHostelsLoading] = useState(true);
  const [hostelsError, setHostelsError] = useState("");
  const res = useLoaderData();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        if (res == null) throw new Error("data not found");
        const data: Hostel[] = await hostelApi.getAll().then((res) => res);
        setHostels(data);
      } catch {
        setHostelsError("Could not load hostels. Please refresh.");
      } finally {
        setHostelsLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    return () => {
      filesWithPreview.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData>();

  const capacityValue = watch("Capacity");

  // ─── File Processing ───────────────────────────────────────────────────────

  const processFiles = useCallback(
    (incoming: File[]) => {
      const errors: string[] = [];
      const validationErrs: FileValidationError[] = [];
      const accepted: FileWithPreview[] = [];

      const remaining = MAX_FILES - filesWithPreview.length;
      if (incoming.length > remaining) {
        errors.push(
          `You can add at most ${MAX_FILES} images total. ${filesWithPreview.length} already selected — only ${remaining} more allowed.`
        );
        incoming = incoming.slice(0, remaining);
      }

      for (const file of incoming) {
        const isDuplicate = filesWithPreview.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        );
        if (isDuplicate) {
          validationErrs.push({ fileName: file.name, reason: "Duplicate file" });
          continue;
        }
        if (!isValidImageFile(file)) {
          validationErrs.push({
            fileName: file.name,
            reason: `Invalid type. Only ${ALLOWED_EXTENSIONS_LABEL} allowed`,
          });
          continue;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          validationErrs.push({
            fileName: file.name,
            reason: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_FILE_SIZE_MB} MB`,
          });
          continue;
        }
        accepted.push({ file, preview: URL.createObjectURL(file), id: generateId() });
      }

      setFileErrors(errors);
      setValidationErrors(validationErrs);
      if (accepted.length > 0) {
        setFilesWithPreview((prev) => [...prev, ...accepted]);
      }
    },
    [filesWithPreview]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeFile = (id: string) => {
    setFilesWithPreview((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.id !== id);
    });
    setFileErrors([]);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: CreateRoomFormData) => {
    if (filesWithPreview.length < MIN_FILES) {
      setFileErrors([`At least ${MIN_FILES} room image is required.`]);
      return;
    }

    setServerError("");
    setFileErrors([]);

    try {
      const formData = new FormData();
      formData.append("Room_Description", data.Room_Description);
      formData.append("Room_Status", data.Room_Status);
      formData.append("HostelId", String(data.HostelId));
      formData.append("Room_Price", String(data.Room_Price));
      // ── New fields ──
      formData.append("RoomType", data.RoomType);
      formData.append("Floor", data.Floor);
      formData.append("Capacity", String(data.Capacity));
      formData.append("CurrentOccupancy", String(data.CurrentOccupancy));

      filesWithPreview.forEach(({ file }) => {
        formData.append("Room_ImageFile", file);
      });

      const res = await PostRoom({ body: formData });

      if (res?.status === 201) {
        toast.success("Room created successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/");
      } else {
        setServerError("Failed to create room. Please try again.");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const hasFiles = filesWithPreview.length > 0;
  const atMax = filesWithPreview.length >= MAX_FILES;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-16">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-10">

          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create a Room</h1>
            <p className="text-slate-400 text-base mt-2">Add a new room listing to your hostel</p>
          </div>

          {serverError && (
            <div className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-base">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
            encType="multipart/form-data"
          >
            {/* ── Image Upload ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-medium text-slate-300">
                  Room Images
                  <span className="text-slate-500 font-normal text-sm ml-1">(up to {MAX_FILES})</span>
                </label>
                {hasFiles && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    atMax
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  }`}>
                    {filesWithPreview.length} / {MAX_FILES}
                  </span>
                )}
              </div>

              {/* Drop Zone */}
              {!atMax && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                    ${dragOver
                      ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
                      : fileErrors.length > 0
                      ? "border-red-500/60 bg-red-500/5"
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                  style={{ minHeight: "140px" }}
                >
                  <div className="flex flex-col items-center justify-center h-full py-8 px-6 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      dragOver ? "bg-indigo-600/30" : "bg-slate-700"
                    }`}>
                      <svg className={`w-6 h-6 transition-colors ${dragOver ? "text-indigo-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-slate-300 text-sm font-medium">
                      {hasFiles
                        ? <>Drop more images or <span className="text-indigo-400">browse</span></>
                        : <>Drag & drop or <span className="text-indigo-400">browse</span></>
                      }
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {ALLOWED_EXTENSIONS_LABEL} • Max {MAX_FILE_SIZE_MB} MB each • Up to {MAX_FILES} images
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* Max reached notice */}
              {atMax && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Maximum {MAX_FILES} images reached. Remove one to add another.
                </div>
              )}

              {/* Preview Grid */}
              {hasFiles && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {filesWithPreview.map(({ id, preview, file }, idx) => (
                    <div key={id} className="relative group rounded-lg overflow-hidden aspect-square border border-slate-700">
                      <img
                        src={preview}
                        alt={`Room image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 px-1">
                        <p className="text-white text-[10px] font-medium text-center leading-tight truncate w-full px-1">
                          {file.name}
                        </p>
                        <p className="text-slate-300 text-[10px]">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      {/* Primary badge */}
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          MAIN
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFile(id)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File-level errors (count / cap) */}
              {fileErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {fileErrors.map((err, i) => (
                    <p key={i} className="text-sm text-red-400 flex items-start gap-1">
                      <span className="shrink-0 mt-0.5">⚠</span> {err}
                    </p>
                  ))}
                </div>
              )}

              {/* Per-file validation errors */}
              {validationErrors.length > 0 && (
                <div className="mt-2 bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3 space-y-1">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Rejected files
                  </p>
                  {validationErrors.map((err, i) => (
                    <p key={i} className="text-sm text-red-400 flex items-start gap-2">
                      <span className="shrink-0">✗</span>
                      <span>
                        <span className="font-medium">{err.fileName}</span>
                        {" — "}
                        {err.reason}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {/* Helper hint */}
              {hasFiles && !atMax && (
                <p className="mt-1.5 text-xs text-slate-500">
                  First image will be used as the main thumbnail.
                </p>
              )}
            </div>

            {/* ── Description ── */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">
                Room Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the room — size, amenities, view..."
                className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                  errors.Room_Description ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                }`}
                {...register("Room_Description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Description is too short (min 10 chars)" },
                  maxLength: { value: 1000, message: "Description is too long (max 1000 chars)" },
                })}
              />
              {errors.Room_Description && (
                <p className="mt-2 text-sm text-red-400">⚠ {errors.Room_Description.message}</p>
              )}
            </div>

            {/* ── Room Type + Floor ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Room Type
                </label>
                <select
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.RoomType ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("RoomType", { required: "Room type is required" })}
                >
                  <option value="">Select type</option>
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.RoomType && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.RoomType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Floor
                </label>
                <select
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.Floor ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("Floor", { required: "Floor is required" })}
                >
                  <option value="">Select floor</option>
                  {FLOOR_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.Floor && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.Floor.message}</p>
                )}
              </div>
            </div>

            {/* ── Capacity + Current Occupancy ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 4"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.Capacity ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("Capacity", {
                    required: "Capacity is required",
                    min: { value: 1, message: "Capacity must be at least 1" },
                    max: { value: 20, message: "Capacity seems too high (max 20)" },
                    valueAsNumber: true,
                  })}
                />
                {errors.Capacity && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.Capacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Current Occupancy
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 2"
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.CurrentOccupancy ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("CurrentOccupancy", {
                    required: "Current occupancy is required",
                    min: { value: 0, message: "Occupancy cannot be negative" },
                    valueAsNumber: true,
                    validate: (value) =>
                      value <= (capacityValue ?? Infinity) ||
                      "Occupancy cannot exceed capacity",
                  })}
                />
                {errors.CurrentOccupancy && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.CurrentOccupancy.message}</p>
                )}
              </div>
            </div>

            {/* ── Price + Status ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Price <span className="text-slate-500 font-normal text-sm">(per night)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base font-medium select-none">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    className={`w-full pl-12 pr-5 py-3.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.Room_Price ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                    }`}
                    {...register("Room_Price", {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                      max: { value: 1_000_000, message: "Price seems unreasonably high" },
                      valueAsNumber: true,
                    })}
                  />
                </div>
                {errors.Room_Price && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.Room_Price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-slate-300 mb-2">
                  Room Status
                </label>
                <select
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent capitalize ${
                    errors.Room_Status ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("Room_Status", { required: "Status is required" })}
                >
                  <option value="">Select status</option>
                  {ROOM_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.Room_Status && (
                  <p className="mt-2 text-sm text-red-400">⚠ {errors.Room_Status.message}</p>
                )}
              </div>
            </div>

            {/* ── Hostel ── */}
            <div>
              <label className="block text-base font-medium text-slate-300 mb-2">
                Hostel Name
              </label>
              {hostelsLoading ? (
                <div className="w-full px-5 py-3.5 bg-slate-800 border border-slate-600 rounded-lg flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-slate-500 border-t-indigo-400 rounded-full animate-spin" />
                  <span className="text-slate-500 text-base">Loading hostels...</span>
                </div>
              ) : hostelsError ? (
                <div className="w-full px-5 py-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-base">
                  {hostelsError}
                </div>
              ) : (
                <select
                  className={`w-full px-5 py-3.5 bg-slate-800 border rounded-lg text-white text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.HostelId ? "border-red-500/60" : "border-slate-600 hover:border-slate-500"
                  }`}
                  {...register("HostelId", { required: "Please select a hostel" })}
                >
                  <option value="">Select a hostel</option>
                  {hostels.map((h) => (
                    <option key={h.hostelId} value={h.hostelId}>
                      {h.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.HostelId && (
                <p className="mt-2 text-sm text-red-400">⚠ {errors.HostelId.message}</p>
              )}
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg text-base transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-base transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
