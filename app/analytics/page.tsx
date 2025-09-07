"use client";

import CheckAuth from "@/components/checkAuth";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {ChartPieInteractive} from "@/components/pieChart/pie_chart";

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `No. ${
    i + 1
  }) Lorem ipsum dolor sit amet libero tempus sed dictum dignissim dictumst vehicula pede porta eros turpis potenti ligula congue letius hac diam duis torquent id molestie tristique vestibulum nostra facilisis dui quisque mi placerat felis commodo at augue nisl bibendum rhoncus tellus non ultrices risus mattis elit taciti dis erat ridiculus proin feugiat velit ipsum convallis efficitur nibh eget auctor neque blandit venenatis integer nunc semper viverra quam platea interdum in curae maecenas urna consequat rutrum nisi scelerisque morbi fusce pulvinar metus ornare penatibus adipiscing lobortis amet vitae mollis finibus purus conubia praesent lacinia sit mus faucibus natoque hendrerit. Lorem ipsum dolor sit amet libero tempus sed dictum dignissim dictumst vehicula pede porta eros turpis potenti ligula congue letius hac diam duis torquent id molestie tristique vestibulum nostra facilisis dui quisque mi placerat felis commodo at augue nisl bibendum rhoncus tellus non ultrices risus mattis elit taciti dis erat ridiculus proin feugiat velit ipsum convallis efficitur nibh eget auctor neque blandit venenatis integer nunc semper viverra quam platea interdum in curae maecenas urna consequat rutrum nisi scelerisque morbi fusce pulvinar metus ornare penatibus adipiscing lobortis amet vitae mollis finibus purus conubia praesent lacinia sit mus faucibus natoque hendrerit. Lorem ipsum dolor sit amet libero tempus sed dictum dignissim dictumst vehicula pede porta eros turpis potenti ligula congue letius hac diam duis torquent id molestie tristique vestibulum nostra facilisis dui quisque mi placerat felis commodo at augue nisl bibendum rhoncus tellus non ultrices risus mattis elit taciti dis erat ridiculus proin feugiat velit ipsum convallis efficitur nibh eget auctor neque blandit venenatis integer nunc semper viverra quam platea interdum in curae maecenas urna consequat rutrum nisi scelerisque morbi fusce pulvinar metus ornare penatibus adipiscing lobortis amet vitae mollis finibus purus conubia praesent lacinia sit mus faucibus natoque hendrerit.`,
}));


export default function SecretPage() {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!user) router.replace("/");
    if (user?.role === "admin") router.replace("/admin/dashboard");
  }, [isClient, user, router]);

  // Position the underline whenever selectedItem changes OR on initial mount
  useEffect(() => {
    const updateUnderline = () => {
      const button = document.getElementById(`item-${selectedItem.id}`);
      if (button && scrollRef.current) {
        const rect = button.getBoundingClientRect();
        const parentRect = scrollRef.current.getBoundingClientRect();
        setUnderlinePos({
          left: rect.left - parentRect.left + scrollRef.current.scrollLeft,
          width: rect.width,
        });
      }
    };

    // Run after a small delay to ensure DOM is rendered
    const timeout = setTimeout(updateUnderline, 50);
    window.addEventListener("resize", updateUnderline);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateUnderline);
    };
  }, [selectedItem]);

  if (!isClient || !user) return <CheckAuth />;

  return (
    <div className="grid grid-cols-2 gap-4 mt-[10%] px-5 max-h-[70vh]">
      {/* Left: Buttons + Description */}
      <div className="flex flex-col h-full">
        {/* Scrollable buttons */}
        <div
          ref={scrollRef}
          className="relative flex items-center ml-5 space-x-7 w-[95%] overflow-x-auto overflow-y-hidden scrollbar-hidden"
          style={{ scrollBehavior: "smooth" }}
          onWheel={(e) => {
            e.preventDefault();
            if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              id={`item-${item.id}`}
              className={`px-2 rounded-lg text-left min-w-fit transition-transform duration-200 inline-block ${
                selectedItem.id === item.id
                  ? "font-bold scale-110 hover:cursor-pointer"
                  : "hover:cursor-pointer hover:scale-110"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              {item.title}
            </button>
          ))}

          {/* Underline */}
          <motion.div
            className="absolute bottom-0 h-1 bg-blue-500 rounded"
            animate={{ left: underlinePos.left, width: underlinePos.width }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
          />
        </div>

        {/* Description */}
        <div className="pl-5 py-5 pr-3 rounded-lg flex-1 max-h-[calc(70vh-3rem)] ">
          <div className="overflow-y-auto scrollbar-hidden h-full">
            <p className="text-justify">{selectedItem.description}</p>
          </div>
        </div>
      </div>

      <ChartPieInteractive />
    </div>
  );
}
