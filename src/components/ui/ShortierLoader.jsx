import { motion } from "framer-motion";

export default function ShortierLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent   backdrop-blur-sm">
            <motion.div
                className="flex flex-col items-center rounded-2xl  bg-white  p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >

                {/* “yazılma efekti” (typewriter tarzı) */}
                <div className="relative mt-2 h-7 overflow-hidden text-gray-600 font-handwritten text-xl">
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block text-blue-600 whitespace-nowrap overflow-hidden border-r-2 border-gray-500 pr-1"
                    >
                        Shortier is loading...
                    </motion.span>
                </div>

                {/* ilerleme çizgisi */}
                <div className="mt-5 h-1 w-36 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full w-1/2 bg-blue-500"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
