"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function DestinationGrid({ destinations }: { destinations: any[] }) {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
        <p className="text-gray-500 dark:text-gray-400">No destinations found. Did you run the Supabase SQL schema?</p>
      </div>
    );
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {destinations.map((item) => (
        <motion.div key={item.id} variants={itemAnim}>
          <Link href={`/detail/${item.id}`} className="block h-full">
            <div className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden -translate-y-0 hover:-translate-y-1 h-full flex flex-col">
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                 {item.image_url ? (
                   <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full bg-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <span className="text-gray-500 text-sm">No Image</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                 <div className="absolute bottom-3 left-3 z-20 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1">
                   <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                   <span className="text-xs font-semibold text-white">{item.rating}</span>
                 </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-foreground dark:text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> <span className="truncate">{item.location}</span>
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                    <p className="font-bold text-foreground dark:text-white">
                      {Number(item.price) === 0 ? 'Free' : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
