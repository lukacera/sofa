import React from "react";
import Header from "../components/Header";
import { ArrowRight, Calendar } from "lucide-react";
import { TopicsGrid } from "../components/HomePageComponents/TopicsGrid";
import { EventsNearYou } from "../components/HomePageComponents/EventsNearYou";
import { auth } from "@/auth";

// const SingleEvent: React.FC<SingleEventProps> = ({ imageUrl }) => {
// return (
//     <Link
//       href={`/event`}
//       className="group block overflow-hidden rounded-xl 
//       bg-white shadow-md transition-all duration-300 hover:shadow-xl"
//     >
//       <div className="relative">
//         {/* Image container with overlay */}
//         <div className="relative aspect-square overflow-hidden">
//           <CldImage
//             alt="Sample image"
//             src={imageUrl}
//             width={300}
//             height={300}
//             crop="fill"
//             gravity="auto"
//           />
//           {/* Gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
//         </div>

//         {/* Content section */}
//         <div className="space-y-3 p-5">
//           <h3 className="text-xl text-left 
//           font-bold text-gray-900 group-hover:text-blue-600">
//             Hackaton, Barcelona
//           </h3>
//           <div className="flex items-center gap-1 text-gray-500 text-xs">
//             <MapPin size={16} className="flex-shrink-0" />
//             <span>Barcelona, Spain</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1 text-gray-600">
//               <Calendar size={16} className="flex-shrink-0" />
//               <span className="text-sm">12th of August</span>
//             </div>

//             {/* Divider dot */}
//             <div className="h-1 w-1 rounded-full bg-black" />

//             <div className="flex items-center gap-2 text-gray-600">
//               <Users size={16} className="flex-shrink-0" />
//               <span className="text-sm">125/500</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

export default async function Page() {
  // Fetch session on the server
  const session = await auth();

  return (
    <div className="max-w-screen bg-mainWhite">
      <Header />
      <main className="text-center p-20">
        <section
          className="p-10 bg-gradient-to-r from-primaryDarker/30 
        to-secondary rounded-lg flex justify-between"
        >
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-bold text-2xl">
              Welcome back, {session?.user?.name}!
            </h2>
            <span>
              You have <span className="font-bold">3</span> events to attend this month! 🎉
            </span>
          </div>
          <button
            className="border p-2 border-transparent rounded-lg 
          font-bold text-black flex items-center gap-2 bg-white"
          >
            <Calendar size={24} />
            <span>My Calendar</span>
          </button>
        </section>

        <section className="mt-20">
          <div className="flex flex-col items-center gap-5">
            <h2 className="font-bold text-2xl mb-5">Your upcoming events</h2>
            <span className="flex items-center gap-3">
              You have no upcoming events. 
              <a href="/events" className="px-3 py-2 rounded-lg bg-accent
              text-mainWhite flex">
                <span>Explore events</span>
                <ArrowRight size={24} />
              </a>
            </span>
          </div>
        </section>

        <EventsNearYou />

        <section className="flex flex-col gap-10 mt-20">
          <div className="flex flex-col items-center gap-5">
            <h2 className="font-bold text-2xl mb-5">Topics you might like</h2>
            <TopicsGrid />
          </div>
          <div className="flex flex-col items-center mt-20 gap-6">
            <EventsNearYou />
          </div>
        </section>
      </main>
    </div>
  );
}
