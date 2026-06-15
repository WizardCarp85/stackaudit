import { FaCheckCircle, FaPlusCircle, FaTimes } from "react-icons/fa";

interface Props {
  onSelect: (mode: "update" | "new") => void;
  onClose: () => void;
}

export default function UpdateModeModal({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Save Changes</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            You are editing a previously saved audit. How would you like to save these changes?
          </p>

          <button
            type="button"
            onClick={() => onSelect("update")}
            className="flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-white/5 hover:border-[#20714b]/40 hover:bg-[#20714b]/10 dark:hover:bg-[#20714b]/20 transition-all text-left group"
          >
            <div className="mt-0.5 text-[#20714b] text-xl group-hover:scale-110 transition-transform">
              <FaCheckCircle />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">Update old result</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Overwrite the original audit result. The link will remain the same.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelect("new")}
            className="flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-white/5 hover:border-[#20714b]/40 hover:bg-[#20714b]/10 dark:hover:bg-[#20714b]/20 transition-all text-left group"
          >
            <div className="mt-0.5 text-blue-500 text-xl group-hover:scale-110 transition-transform">
              <FaPlusCircle />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">Create a new one</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Save as a brand new audit with a new URL link. Your original remains untouched.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
